import logging
import os
from typing import Dict, Any, Tuple, Optional
from datetime import datetime, timedelta

from models import (
    ReservoirInfo, SpectralIndices, DerivedMetrics,
    MitigationAction, SpatialZoneFeature, TimeSeriesPoint
)
import mock_gis

logger = logging.getLogger("aquaguard.gee")

class EarthEngineService:
    def __init__(self):
        self.ee_available = False
        self._initialize_gee()

    def _initialize_gee(self):
        """Attempts to initialize Google Earth Engine. Falls back gracefully to mock GIS if credentials missing."""
        try:
            import ee
            # Check for GEE project or environment variable
            project = os.getenv("EARTHENGINE_PROJECT")
            if project:
                ee.Initialize(project=project)
            else:
                ee.Initialize()
            self.ee_available = True
            logger.info("Successfully authenticated and initialized Google Earth Engine API.")
        except Exception as e:
            self.ee_available = False
            logger.warning(
                f"Google Earth Engine initialization skipped ({str(e)}). "
                "AquaGuard AI will operate in High-Fidelity Synthetic GIS & Remote Sensing Mode."
            )

    def compute_sentinel2_indices(
        self,
        reservoir_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        nutrient_spike_factor: float = 1.0,
        water_temp_anomaly_c: float = 0.0,
        rainfall_runoff_days: int = 0,
        sunlight_hours: float = 8.0,
    ) -> Tuple[SpectralIndices, DerivedMetrics, list[MitigationAction], bool]:
        """
        Processes Sentinel-2 S2_SR_HARMONIZED imagery for the specified reservoir.
        Computes NDWI, FAI, NDVI, NDTI using Copernicus multi-spectral bands.
        Falls back to realistic GIS simulation if GEE is not initialized or error occurs.
        """
        reservoir = mock_gis.RESERVOIRS.get(reservoir_id, mock_gis.RESERVOIRS["tansa"])

        # If GEE is enabled and we are not doing a synthetic simulation stress-test
        if self.ee_available and nutrient_spike_factor == 1.0 and water_temp_anomaly_c == 0.0:
            try:
                import ee
                aoi = ee.Geometry.Point([reservoir.lng, reservoir.lat]).buffer(reservoir.surface_area_sqkm * 350)
                
                if not end_date:
                    end_dt = datetime.now()
                    start_dt = end_dt - timedelta(days=30)
                    start_date = start_dt.strftime("%Y-%m-%d")
                    end_date = end_dt.strftime("%Y-%m-%d")

                # Filter Sentinel-2 Surface Reflectance Harmonized collection
                collection = (
                    ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                    .filterBounds(aoi)
                    .filterDate(start_date, end_date)
                    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
                    .sort("system:time_start", False)
                )

                image = collection.first()

                if image is not None:
                    # Band math:
                    # B3: Green (560 nm)
                    # B4: Red (665 nm)
                    # B8: NIR (842 nm)
                    # B11: SWIR-1 (1610 nm)
                    b3 = image.select("B3").multiply(0.0001)
                    b4 = image.select("B4").multiply(0.0001)
                    b8 = image.select("B8").multiply(0.0001)
                    b11 = image.select("B11").multiply(0.0001)

                    # 1. NDWI = (B3 - B8) / (B3 + B8)
                    ndwi = (b3.subtract(b8)).divide(b3.add(b8)).rename("NDWI")

                    # 2. Water Mask threshold > 0.1
                    water_mask = ndwi.gt(0.1)

                    # 3. FAI = B8 - [B4 + (B11 - B4) * ((842 - 665) / (1610 - 665))]
                    # (842 - 665) / (1610 - 665) = 177 / 945 = 0.1873
                    lambda_factor = (842.0 - 665.0) / (1610.0 - 665.0)
                    baseline = b4.add(b11.subtract(b4).multiply(lambda_factor))
                    fai = b8.subtract(baseline).rename("FAI").updateMask(water_mask)

                    # 4. NDVI = (B8 - B4) / (B8 + B4)
                    ndvi = (b8.subtract(b4)).divide(b8.add(b4)).rename("NDVI").updateMask(water_mask)

                    # 5. NDTI = (B4 - B3) / (B4 + B3)
                    ndti = (b4.subtract(b3)).divide(b4.add(b3)).rename("NDTI").updateMask(water_mask)

                    # Reduce region to mean stats
                    stats = image.addBands([ndwi, fai, ndvi, ndti]).reduceRegion(
                        reducer=ee.Reducer.mean(),
                        geometry=aoi,
                        scale=20,
                        maxPixels=1e8
                    ).getInfo()

                    fai_val = float(stats.get("FAI", 0.008) or 0.008)
                    ndvi_val = float(stats.get("NDVI", 0.12) or 0.12)
                    ndwi_val = float(stats.get("NDWI", 0.65) or 0.65)
                    ndti_val = float(stats.get("NDTI", 0.08) or 0.08)

                    # Derive water metrics
                    chla = max(2.0, round(10.0 ** (1.85 * fai_val + 0.82), 1))
                    turb = max(1.5, round((ndti_val + 0.1) * 35.0, 1))
                    temp = 24.5
                    secchi = max(0.5, round(12.0 / (turb + chla * 0.4), 2))
                    do = max(3.0, round(8.8 - 0.05 * chla, 2))
                    bloom_cov = min(95.0, max(2.0, round((fai_val / 0.05) * 70.0, 1)))
                    risk = min(100, max(5, int((fai_val / 0.04) * 60 + (chla / 35.0) * 40)))
                    alert = "CRITICAL" if risk >= 65 else ("MODERATE" if risk >= 35 else "SAFE")

                    indices = SpectralIndices(ndwi=ndwi_val, fai=fai_val, ndvi=ndvi_val, ndti=ndti_val)
                    metrics = DerivedMetrics(
                        chlorophyll_a_ug_l=chla,
                        turbidity_fnu=turb,
                        surface_temperature_c=temp,
                        water_clarity_secchi_m=secchi,
                        dissolved_oxygen_mg_l=do,
                        bloom_coverage_percent=bloom_cov,
                        bloom_risk_score=risk,
                        alert_level=alert,
                        primary_driver="Real Sentinel-2 MSI L2A surface reflectance ingestion."
                    )
                    _, _, actions = mock_gis.compute_simulated_metrics(reservoir_id)
                    return indices, metrics, actions, False
            except Exception as e:
                logger.error(f"GEE processing failed: {e}. Falling back to simulation engine.")

        # Fallback / Simulation
        indices, metrics, actions = mock_gis.compute_simulated_metrics(
            reservoir_id=reservoir_id,
            nutrient_spike_factor=nutrient_spike_factor,
            water_temp_anomaly_c=water_temp_anomaly_c,
            rainfall_runoff_days=rainfall_runoff_days,
            sunlight_hours=sunlight_hours
        )
        return indices, metrics, actions, True

    def get_spatial_zones(self, reservoir_id: str, base_fai: float, base_chla: float, base_turb: float) -> list[SpatialZoneFeature]:
        return mock_gis.get_reservoir_zones(reservoir_id, base_fai, base_chla, base_turb)

    def get_time_series(self, reservoir_id: str, days: int = 180) -> list[TimeSeriesPoint]:
        return mock_gis.generate_time_series_data(reservoir_id, days)

# Singleton instance
gee_service = EarthEngineService()
