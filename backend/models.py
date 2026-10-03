from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ReservoirInfo(BaseModel):
    id: str
    name: str
    district: str
    state: str
    country: str = "India"
    lat: float
    lng: float
    zoom: int = 13
    capacity_mld: float = Field(..., description="Million Litres per Day supply capacity")
    full_storage_capacity_mcm: float = Field(..., description="Million Cubic Metres storage capacity")
    surface_area_sqkm: float
    description: str
    key_water_supply_for: str

class SpectralIndices(BaseModel):
    ndwi: float = Field(..., description="Normalized Difference Water Index: (B3 - B8) / (B3 + B8)")
    fai: float = Field(..., description="Floating Algae Index: B8 - [B4 + (B11 - B4) * ((842 - 665) / (1610 - 665))]")
    ndvi: float = Field(..., description="Normalized Difference Vegetation Index: (B8 - B4) / (B8 + B4)")
    ndti: float = Field(..., description="Normalized Difference Turbidity Index: (B4 - B3) / (B4 + B3)")

class DerivedMetrics(BaseModel):
    chlorophyll_a_ug_l: float = Field(..., description="Micrograms per liter (µg/L)")
    turbidity_fnu: float = Field(..., description="Formazin Nephelometric Units")
    surface_temperature_c: float = Field(..., description="Degrees Celsius")
    water_clarity_secchi_m: float = Field(..., description="Secchi disk depth in meters")
    dissolved_oxygen_mg_l: float = Field(..., description="Dissolved oxygen in mg/L")
    bloom_coverage_percent: float = Field(..., description="Percentage of reservoir area affected by bloom")
    bloom_risk_score: int = Field(..., ge=0, le=100, description="Composite HAB risk score (0-100)")
    alert_level: str = Field(..., description="SAFE | MODERATE | CRITICAL")
    primary_driver: str

class MitigationAction(BaseModel):
    id: str
    title: str
    category: str  # Treatment, Monitoring, Intake, Public Health
    urgency: str   # Routine, High, Critical
    action_item: str
    target_parameter: str
    recommended_dosage: Optional[str] = None
    status: str = "Pending"

class ReservoirHealthResponse(BaseModel):
    reservoir: ReservoirInfo
    timestamp: str
    satellite_source: str
    cloud_cover_percent: float
    indices: SpectralIndices
    metrics: DerivedMetrics
    mitigation_actions: List[MitigationAction]
    is_simulated: bool = False
    simulation_factors: Optional[Dict[str, Any]] = None

class TimeSeriesPoint(BaseModel):
    date: str
    fai: float
    ndvi: float
    ndti: float
    chlorophyll_a: float
    turbidity: float
    bloom_risk_score: int
    alert_level: str
    is_simulated: bool = False

class TimeSeriesResponse(BaseModel):
    reservoir_id: str
    reservoir_name: str
    time_series: List[TimeSeriesPoint]
    thresholds: Dict[str, float]

class SpatialZoneFeature(BaseModel):
    zone_id: str
    zone_name: str
    fai: float
    chlorophyll_a: float
    turbidity: float
    risk_level: str
    color_hex: str
    geojson: Dict[str, Any]

class SpectralIndicesResponse(BaseModel):
    reservoir_id: str
    reservoir_name: str
    indices: SpectralIndices
    band_wavelengths: Dict[str, str]
    spatial_zones: List[SpatialZoneFeature]
    geojson_boundary: Dict[str, Any]

class SimulationRequest(BaseModel):
    reservoir_id: str = "tansa"
    nutrient_spike_factor: float = Field(1.0, ge=0.5, le=3.5, description="Agricultural & runoff nutrient multiplier")
    water_temp_anomaly_c: float = Field(0.0, ge=-2.0, le=7.0, description="Temperature anomaly in degrees C")
    rainfall_runoff_days: int = Field(0, ge=0, le=15, description="Days of continuous post-monsoon runoff")
    sunlight_hours: float = Field(8.0, ge=2.0, le=13.0, description="Daily sunlight exposure hours")
