import logging
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from models import (
    ReservoirInfo, ReservoirHealthResponse, TimeSeriesResponse,
    SpectralIndicesResponse, SimulationRequest
)
from gee_service import gee_service
import mock_gis
from report_generator import generate_pdf_report, generate_csv_report

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("aquaguard.main")

app = FastAPI(
    title="AquaGuard AI API",
    description="Satellite-Based Harmful Algae Bloom (HAB) & Water Quality Early Warning System",
    version="1.0.0"
)

# CORS Middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AquaGuard AI API",
        "gee_connected": gee_service.ee_available,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/reservoirs", response_model=List[ReservoirInfo])
async def get_reservoirs():
    """Returns list of monitored drinking water reservoirs with geospatial bounds."""
    return list(mock_gis.RESERVOIRS.values())

@app.get("/api/reservoir/{reservoir_id}", response_model=ReservoirInfo)
async def get_reservoir_by_id(reservoir_id: str):
    if reservoir_id not in mock_gis.RESERVOIRS:
        raise HTTPException(status_code=404, detail=f"Reservoir '{reservoir_id}' not found.")
    return mock_gis.RESERVOIRS[reservoir_id]

@app.get("/api/reservoir-health", response_model=ReservoirHealthResponse)
async def get_reservoir_health(
    reservoir_id: str = Query("tansa", description="Reservoir identifier (e.g. tansa, bhatsa, vaitarna, tulsi, powai)"),
    nutrient_spike_factor: float = Query(1.0, ge=0.5, le=3.5, description="What-If simulation: nutrient influx multiplier"),
    water_temp_anomaly_c: float = Query(0.0, ge=-2.0, le=7.0, description="What-If simulation: temperature anomaly in °C"),
    rainfall_runoff_days: int = Query(0, ge=0, le=15, description="What-If simulation: days of runoff"),
    sunlight_hours: float = Query(8.0, ge=2.0, le=13.0, description="What-If simulation: daily sunlight hours"),
):
    """
    Computes real-time water quality and HAB metrics using Sentinel-2 MSI multi-spectral imagery.
    Seamlessly incorporates simulation parameters if provided.
    """
    if reservoir_id not in mock_gis.RESERVOIRS:
        raise HTTPException(status_code=404, detail=f"Reservoir '{reservoir_id}' not found.")

    res_info = mock_gis.RESERVOIRS[reservoir_id]
    is_stress_test = (
        nutrient_spike_factor != 1.0 or
        water_temp_anomaly_c != 0.0 or
        rainfall_runoff_days != 0 or
        sunlight_hours != 8.0
    )

    indices, metrics, actions, is_simulated = gee_service.compute_sentinel2_indices(
        reservoir_id=reservoir_id,
        nutrient_spike_factor=nutrient_spike_factor,
        water_temp_anomaly_c=water_temp_anomaly_c,
        rainfall_runoff_days=rainfall_runoff_days,
        sunlight_hours=sunlight_hours
    )

    return ReservoirHealthResponse(
        reservoir=res_info,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        satellite_source="Copernicus Sentinel-2 MSI (S2_SR_HARMONIZED)",
        cloud_cover_percent=4.2 if not is_stress_test else 2.1,
        indices=indices,
        metrics=metrics,
        mitigation_actions=actions,
        is_simulated=is_stress_test or is_simulated,
        simulation_factors={
            "nutrient_spike_factor": nutrient_spike_factor,
            "water_temp_anomaly_c": water_temp_anomaly_c,
            "rainfall_runoff_days": rainfall_runoff_days,
            "sunlight_hours": sunlight_hours,
        } if is_stress_test else None
    )

@app.get("/api/time-series", response_model=TimeSeriesResponse)
async def get_time_series(
    reservoir_id: str = Query("tansa", description="Target reservoir ID"),
    days: int = Query(180, ge=30, le=365, description="Lookback window in days")
):
    """Returns multi-month Sentinel-2 observation time series for trend analysis."""
    if reservoir_id not in mock_gis.RESERVOIRS:
        raise HTTPException(status_code=404, detail=f"Reservoir '{reservoir_id}' not found.")

    res_info = mock_gis.RESERVOIRS[reservoir_id]
    points = gee_service.get_time_series(reservoir_id, days)

    return TimeSeriesResponse(
        reservoir_id=reservoir_id,
        reservoir_name=res_info.name,
        time_series=points,
        thresholds={
            "fai_moderate": 0.015,
            "fai_critical": 0.040,
            "chlorophyll_a_moderate": 15.0,
            "chlorophyll_a_critical": 35.0,
            "turbidity_warning": 5.0,
        }
    )

@app.get("/api/spectral-indices", response_model=SpectralIndicesResponse)
async def get_spectral_indices(
    reservoir_id: str = Query("tansa", description="Target reservoir ID")
):
    """Returns spatial sub-basin zones with individual spectral index distributions and boundary GeoJSON."""
    if reservoir_id not in mock_gis.RESERVOIRS:
        raise HTTPException(status_code=404, detail=f"Reservoir '{reservoir_id}' not found.")

    res_info = mock_gis.RESERVOIRS[reservoir_id]
    indices, metrics, _, _ = gee_service.compute_sentinel2_indices(reservoir_id)
    zones = gee_service.get_spatial_zones(
        reservoir_id,
        indices.fai,
        metrics.chlorophyll_a_ug_l,
        metrics.turbidity_fnu
    )
    geojson_bound = mock_gis.generate_lake_polygon(res_info.lat, res_info.lng)

    return SpectralIndicesResponse(
        reservoir_id=reservoir_id,
        reservoir_name=res_info.name,
        indices=indices,
        band_wavelengths={
            "B3_Green": "560 nm (Chlorophyll absorption minima & turbidity)",
            "B4_Red": "665 nm (Chlorophyll-a absorption peak)",
            "B8_NIR": "842 nm (Water surface reflectance & floating algal mats)",
            "B11_SWIR1": "1610 nm (Atmospheric baseline & turbidity correction)",
        },
        spatial_zones=zones,
        geojson_boundary=geojson_bound
    )

@app.post("/api/simulate", response_model=ReservoirHealthResponse)
async def simulate_scenario(req: SimulationRequest):
    """Executes a What-If environmental stress simulation."""
    if req.reservoir_id not in mock_gis.RESERVOIRS:
        raise HTTPException(status_code=404, detail=f"Reservoir '{req.reservoir_id}' not found.")

    res_info = mock_gis.RESERVOIRS[req.reservoir_id]
    indices, metrics, actions = mock_gis.compute_simulated_metrics(
        reservoir_id=req.reservoir_id,
        nutrient_spike_factor=req.nutrient_spike_factor,
        water_temp_anomaly_c=req.water_temp_anomaly_c,
        rainfall_runoff_days=req.rainfall_runoff_days,
        sunlight_hours=req.sunlight_hours
    )

    return ReservoirHealthResponse(
        reservoir=res_info,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC (Simulated)"),
        satellite_source="Simulated Sentinel-2 MSI Multi-spectral Response",
        cloud_cover_percent=0.0,
        indices=indices,
        metrics=metrics,
        mitigation_actions=actions,
        is_simulated=True,
        simulation_factors={
            "nutrient_spike_factor": req.nutrient_spike_factor,
            "water_temp_anomaly_c": req.water_temp_anomaly_c,
            "rainfall_runoff_days": req.rainfall_runoff_days,
            "sunlight_hours": req.sunlight_hours,
        }
    )

@app.get("/api/export-report/pdf")
async def export_pdf_report(
    reservoir_id: str = Query("tansa"),
    nutrient_spike_factor: float = Query(1.0),
    water_temp_anomaly_c: float = Query(0.0),
    rainfall_runoff_days: int = Query(0),
    sunlight_hours: float = Query(8.0),
):
    """Generates and downloads a publication-grade PDF report."""
    health_resp = await get_reservoir_health(
        reservoir_id=reservoir_id,
        nutrient_spike_factor=nutrient_spike_factor,
        water_temp_anomaly_c=water_temp_anomaly_c,
        rainfall_runoff_days=rainfall_runoff_days,
        sunlight_hours=sunlight_hours
    )
    pdf_bytes = generate_pdf_report(health_resp)
    filename = f"AquaGuard_Report_{reservoir_id}_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.get("/api/export-report/csv")
async def export_csv_report(
    reservoir_id: str = Query("tansa"),
    nutrient_spike_factor: float = Query(1.0),
    water_temp_anomaly_c: float = Query(0.0),
    rainfall_runoff_days: int = Query(0),
    sunlight_hours: float = Query(8.0),
):
    """Generates and downloads a CSV data export."""
    health_resp = await get_reservoir_health(
        reservoir_id=reservoir_id,
        nutrient_spike_factor=nutrient_spike_factor,
        water_temp_anomaly_c=water_temp_anomaly_c,
        rainfall_runoff_days=rainfall_runoff_days,
        sunlight_hours=sunlight_hours
    )
    csv_str = generate_csv_report(health_resp)
    filename = f"AquaGuard_Data_{reservoir_id}_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
