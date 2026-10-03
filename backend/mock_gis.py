import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
from models import (
    ReservoirInfo, SpectralIndices, DerivedMetrics,
    MitigationAction, SpatialZoneFeature, TimeSeriesPoint
)

RESERVOIRS: Dict[str, ReservoirInfo] = {
    "tansa": ReservoirInfo(
        id="tansa",
        name="Tansa Reservoir",
        district="Thane & Palghar",
        state="Maharashtra",
        country="India",
        lat=19.6975,
        lng=73.2625,
        zoom=13,
        capacity_mld=490.0,
        full_storage_capacity_mcm=208.7,
        surface_area_sqkm=19.4,
        description="Major freshwater source for Greater Mumbai municipal supply built across the Tansa River inside Tansa Wildlife Sanctuary.",
        key_water_supply_for="Brihanmumbai Municipal Corporation (BMC) - Island City & Western Suburbs"
    ),
    "bhatsa": ReservoirInfo(
        id="bhatsa",
        name="Bhatsa Lake",
        district="Shahapur, Thane",
        state="Maharashtra",
        country="India",
        lat=19.5264,
        lng=73.4478,
        zoom=12,
        capacity_mld=1850.0,
        full_storage_capacity_mcm=942.0,
        surface_area_sqkm=32.8,
        description="Largest single water supplier for Mumbai and Thane metropolitan region with integrated hydro-electric and irrigation channels.",
        key_water_supply_for="BMC (over 50% of total drinking water) & Thane Municipal Corp"
    ),
    "vaitarna": ReservoirInfo(
        id="vaitarna",
        name="Middle & Upper Vaitarna",
        district="Igatpuri & Mokhada, Nashik/Palghar",
        state="Maharashtra",
        country="India",
        lat=19.7042,
        lng=73.5358,
        zoom=12,
        capacity_mld=1020.0,
        full_storage_capacity_mcm=455.0,
        surface_area_sqkm=28.5,
        description="High-altitude impoundment in Western Ghats providing gravity-fed raw water to Bhandup Water Treatment Complex.",
        key_water_supply_for="Central Mumbai & Suburban Master Distribution Reservoirs"
    ),
    "tulsi": ReservoirInfo(
        id="tulsi",
        name="Tulsi Lake",
        district="Mumbai Suburban",
        state="Maharashtra",
        country="India",
        lat=19.1932,
        lng=72.9152,
        zoom=14,
        capacity_mld=18.0,
        full_storage_capacity_mcm=10.4,
        surface_area_sqkm=1.35,
        description="Protected rain-fed lake situated within Sanjay Gandhi National Park, catering to South Mumbai backup reserves.",
        key_water_supply_for="South Mumbai institutional zones & SGNP ecological preserve"
    ),
    "powai": ReservoirInfo(
        id="powai",
        name="Powai Lake",
        district="Mumbai Suburban",
        state="Maharashtra",
        country="India",
        lat=19.1245,
        lng=72.9054,
        zoom=14,
        capacity_mld=0.0,
        full_storage_capacity_mcm=5.4,
        surface_area_sqkm=2.1,
        description="Urban lake in northern Mumbai prone to anthropogenic eutrophication, agricultural-urban runoff, and seasonal Microcystis blooms.",
        key_water_supply_for="Non-potable municipal use, recreational park, and bio-indicator monitoring"
    ),
}

def generate_lake_polygon(center_lat: float, center_lng: float, scale_lat: float = 0.04, scale_lng: float = 0.05, num_pts: int = 40) -> Dict[str, Any]:
    """Generates an organic, natural-looking lake boundary GeoJSON polygon around the coordinates."""
    coords = []
    for i in range(num_pts):
        angle = (2 * math.pi * i) / num_pts
        # Organic radial perturbation
        r = 1.0 + 0.32 * math.sin(3 * angle) + 0.18 * math.cos(5 * angle + 0.5) + 0.12 * math.sin(7 * angle)
        lat = center_lat + r * scale_lat * math.sin(angle)
        lng = center_lng + r * scale_lng * math.cos(angle)
        coords.append([round(lng, 6), round(lat, 6)])
    coords.append(coords[0])  # Close loop
    return {
        "type": "Polygon",
        "coordinates": [coords]
    }

def get_reservoir_zones(reservoir_id: str, base_fai: float, base_chla: float, base_turbidity: float) -> List[SpatialZoneFeature]:
    """Generates sub-basin zones for spatial mapping with distinct spectral indices."""
    res = RESERVOIRS.get(reservoir_id, RESERVOIRS["tansa"])
    lat, lng = res.lat, res.lng
    
    zone_defs = [
        {"name": "Northern River Inflow Delta", "d_lat": 0.022, "d_lng": 0.005, "scale": 0.012, "fai_mult": 1.45, "turb_mult": 1.6},
        {"name": "Central Deep Pelagic Basin", "d_lat": 0.000, "d_lng": 0.000, "scale": 0.016, "fai_mult": 0.85, "turb_mult": 0.8},
        {"name": "South Dam Intake Facility", "d_lat": -0.020, "d_lng": -0.008, "scale": 0.011, "fai_mult": 0.95, "turb_mult": 0.9},
        {"name": "Western Shallow Bay", "d_lat": 0.005, "d_lng": -0.024, "scale": 0.013, "fai_mult": 1.55, "turb_mult": 1.3},
        {"name": "Eastern Agricultural Shoreline", "d_lat": -0.004, "d_lng": 0.022, "scale": 0.012, "fai_mult": 1.35, "turb_mult": 1.25},
    ]

    zones: List[SpatialZoneFeature] = []
    for idx, zd in enumerate(zone_defs):
        z_fai = round(base_fai * zd["fai_mult"], 4)
        z_chla = round(base_chla * zd["fai_mult"], 2)
        z_turb = round(base_turbidity * zd["turb_mult"], 2)

        if z_fai > 0.045 or z_chla > 30.0:
            risk = "CRITICAL"
            color = "#EF4444"  # Coral red
        elif z_fai > 0.015 or z_chla > 15.0:
            risk = "MODERATE"
            color = "#F59E0B"  # Amber
        else:
            risk = "SAFE"
            color = "#10B981"  # Emerald

        poly = generate_lake_polygon(lat + zd["d_lat"], lng + zd["d_lng"], scale_lat=zd["scale"], scale_lng=zd["scale"] * 1.2, num_pts=16)
        zones.append(
            SpatialZoneFeature(
                zone_id=f"{reservoir_id}-zone-{idx+1}",
                zone_name=zd["name"],
                fai=z_fai,
                chlorophyll_a=z_chla,
                turbidity=z_turb,
                risk_level=risk,
                color_hex=color,
                geojson=poly
            )
        )
    return zones

def compute_simulated_metrics(
    reservoir_id: str,
    nutrient_spike_factor: float = 1.0,
    water_temp_anomaly_c: float = 0.0,
    rainfall_runoff_days: int = 0,
    sunlight_hours: float = 8.0,
) -> Tuple[SpectralIndices, DerivedMetrics, List[MitigationAction]]:
    """Calculates scientifically-derived bio-optical metrics & mitigation recommendations."""
    # Baseline reservoir characteristics
    base_profiles = {
        "tansa": {"base_fai": 0.008, "base_chla": 7.5, "base_turb": 4.2, "temp": 24.5, "ndwi": 0.65, "ndvi": 0.12},
        "bhatsa": {"base_fai": 0.006, "base_chla": 5.8, "base_turb": 3.8, "temp": 24.0, "ndwi": 0.70, "ndvi": 0.09},
        "vaitarna": {"base_fai": 0.005, "base_chla": 4.9, "base_turb": 3.2, "temp": 22.8, "ndwi": 0.74, "ndvi": 0.07},
        "tulsi": {"base_fai": 0.014, "base_chla": 11.2, "base_turb": 5.5, "temp": 26.0, "ndwi": 0.58, "ndvi": 0.18},
        "powai": {"base_fai": 0.038, "base_chla": 28.5, "base_turb": 12.4, "temp": 27.5, "ndwi": 0.46, "ndvi": 0.32},
    }
    prof = base_profiles.get(reservoir_id, base_profiles["tansa"])

    # Multipliers based on environmental drivers
    temp_factor = 1.0 + max(0.0, water_temp_anomaly_c) * 0.14
    nutrient_factor = (nutrient_spike_factor ** 1.35)
    runoff_factor = 1.0 + (rainfall_runoff_days * 0.08)
    sunlight_factor = (sunlight_hours / 8.0) ** 0.65

    # Bloom expansion model
    bio_multiplier = temp_factor * nutrient_factor * sunlight_factor
    fai_val = prof["base_fai"] * bio_multiplier + (0.018 if nutrient_spike_factor > 2.0 else 0.0)
    chla_val = prof["base_chla"] * bio_multiplier
    turb_val = prof["base_turb"] * runoff_factor * (1.0 + 0.15 * (bio_multiplier - 1.0))
    ndwi_val = max(0.15, prof["ndwi"] - 0.06 * (fai_val / 0.04))
    ndvi_val = min(0.85, prof["ndvi"] + 0.45 * (fai_val / 0.05))
    ndti_val = round((turb_val - 2.0) / (turb_val + 20.0), 3)

    # Derived physics/water quality proxies
    surf_temp = prof["temp"] + water_temp_anomaly_c
    secchi_depth = max(0.4, round(12.0 / (turb_val + chla_val * 0.45), 2))
    dissolved_o2 = max(2.1, round(9.2 - 0.4 * (surf_temp - 22.0) - (0.06 * chla_val if chla_val > 20 else -0.2), 2))
    bloom_cov = min(94.0, max(2.0, round((fai_val / 0.06) * 75.0, 1)))

    # Composite HAB Risk Score (0 - 100)
    # Weights: FAI (45%), Chlorophyll-a (30%), Turbidity (15%), Temp Anomaly (10%)
    fai_norm = min(1.0, max(0.0, (fai_val - 0.002) / 0.065))
    chla_norm = min(1.0, max(0.0, (chla_val - 4.0) / 45.0))
    turb_norm = min(1.0, max(0.0, (turb_val - 2.0) / 25.0))
    temp_norm = min(1.0, max(0.0, max(0.0, water_temp_anomaly_c) / 5.0))
    risk_score = int(round((fai_norm * 45 + chla_norm * 30 + turb_norm * 15 + temp_norm * 10)))
    risk_score = min(100, max(5, risk_score))

    # Alert level classification
    if risk_score >= 65 or fai_val >= 0.040 or chla_val >= 35.0:
        alert_level = "CRITICAL"
        primary_driver = "Severe cyanobacteria proliferation triggered by elevated thermal stratification and nutrient influx."
    elif risk_score >= 35 or fai_val >= 0.016 or chla_val >= 16.0:
        alert_level = "MODERATE"
        primary_driver = "Sub-surface algal biomass buildup with localized buoyant mats in shallow bays and river deltas."
    else:
        alert_level = "SAFE"
        primary_driver = "Optimal oligotrophic to mesotrophic equilibrium; low turbidity and clear photic zone."

    indices = SpectralIndices(
        ndwi=round(ndwi_val, 4),
        fai=round(fai_val, 4),
        ndvi=round(ndvi_val, 4),
        ndti=round(ndti_val, 4)
    )

    metrics = DerivedMetrics(
        chlorophyll_a_ug_l=round(chla_val, 1),
        turbidity_fnu=round(turb_val, 1),
        surface_temperature_c=round(surf_temp, 1),
        water_clarity_secchi_m=secchi_depth,
        dissolved_oxygen_mg_l=dissolved_o2,
        bloom_coverage_percent=bloom_cov,
        bloom_risk_score=risk_score,
        alert_level=alert_level,
        primary_driver=primary_driver
    )

    # Actionable Mitigation Strategies for Treatment Plant Operators
    actions: List[MitigationAction] = []
    if alert_level == "CRITICAL":
        actions.extend([
            MitigationAction(
                id="act-01",
                title="Intake Gate Submersion & Depth Adjustment",
                category="Intake Control",
                urgency="Critical",
                action_item="Lower raw intake sluice gates to deeper hypolimnion (>8m depth) to bypass floating surface cyanobacterial scums.",
                target_parameter="Intake Chlorophyll-a / Microcystin",
                recommended_dosage="Depth adjustment to -9.5m",
                status="Immediate Action Required"
            ),
            MitigationAction(
                id="act-02",
                title="Powdered Activated Carbon (PAC) Dosing",
                category="Treatment",
                urgency="Critical",
                action_item="Inject PAC slurry at raw water flash-mixer prior to coagulation to adsorb cyanotoxins and MIB/Geosmin odor compounds.",
                target_parameter="Taste, Odor & Toxin Neutralization",
                recommended_dosage="18 - 25 mg/L PAC continuous feed",
                status="Active"
            ),
            MitigationAction(
                id="act-03",
                title="Ultrasonic Algae Disruption Deployment",
                category="In-situ Barrier",
                urgency="High",
                action_item="Mobilize solar-powered ultrasonic buoy transmitters across the southern intake channel to collapse algal gas vesicles.",
                target_parameter="Cellular Buoyancy Suppression",
                recommended_dosage="Frequency sweep 28-34 kHz across 4 buoys",
                status="Mobilizing"
            ),
            MitigationAction(
                id="act-04",
                title="Public Health & Regional Agency Notification",
                category="Public Health",
                urgency="Critical",
                action_item="Transmit automated HAB early warning bulletin to Municipal Health Department & Pollution Control Board with GIS bloom bounds.",
                target_parameter="Drinking Water Standards Compliance",
                recommended_dosage="ELISA toxin assay confirmation within 4h",
                status="Notification Dispatched"
            )
        ])
    elif alert_level == "MODERATE":
        actions.extend([
            MitigationAction(
                id="act-01",
                title="Coagulant Dosage Optimization",
                category="Treatment",
                urgency="High",
                action_item="Increase Polyaluminium Chloride (PACL) / Alum dosage by 25% to account for elevated cellular organic matter and turbidity.",
                target_parameter="Turbidity & Settling Velocity",
                recommended_dosage="14 - 18 mg/L PACL coagulant",
                status="Recommended"
            ),
            MitigationAction(
                id="act-02",
                title="Multi-Spectral Satellite Monitoring Cadence",
                category="Monitoring",
                urgency="High",
                action_item="Flag next Sentinel-2 MSI overpass in 3 days. Cross-verify with PlanetScope 3m high-resolution tasking if cloud cover exceeds 20%.",
                target_parameter="Spatial Bloom Tracking",
                recommended_dosage="Daily automated optical ingestion",
                status="Scheduled"
            ),
            MitigationAction(
                id="act-03",
                title="Surface Aeration & Destratification",
                category="In-situ Barrier",
                urgency="Routine",
                action_item="Engage subsurface bubble aerators at reservoir inlet bays to disrupt thermal micro-layering and suppress Microcystis buoyancy.",
                target_parameter="Thermal Stratification & Dissolved O2",
                recommended_dosage="Continuous 120 CFM aeration cycle",
                status="Operational"
            )
        ])
    else:
        actions.extend([
            MitigationAction(
                id="act-01",
                title="Baseline Water Quality Verification",
                category="Monitoring",
                urgency="Routine",
                action_item="Maintain standard optical sensor calibrations and weekly grab-sampling at intake towers.",
                target_parameter="Baseline Indices Verification",
                recommended_dosage="Standard operating protocol",
                status="Normal"
            ),
            MitigationAction(
                id="act-02",
                title="Riparian Buffer & Watershed Inspection",
                category="Watershed Mgmt",
                urgency="Routine",
                action_item="Inspect agricultural drainage ditches and perimeter wildlife sanctuary boundaries for non-point source nutrient discharges.",
                target_parameter="Nitrate & Phosphate Influx",
                recommended_dosage="Bi-weekly perimeter drone survey",
                status="In Progress"
            )
        ])

    return indices, metrics, actions

def generate_time_series_data(reservoir_id: str, days_back: int = 180) -> List[TimeSeriesPoint]:
    """Generates a realistic multi-month time series showing seasonal variations and satellite observations."""
    points: List[TimeSeriesPoint] = []
    base_date = datetime.now() - timedelta(days=days_back)
    
    # Seasonality curves: Monsoon (July-Sept) -> Post-monsoon bloom (Oct-Nov) -> Winter stable (Dec-Feb) -> Pre-monsoon warm (March-May)
    for i in range(0, days_back + 1, 5):  # Sentinel-2 revisit ~5 days
        curr_date = base_date + timedelta(days=i)
        day_of_year = curr_date.timetuple().tm_yday

        # Harmonic seasonal wave for temperature and bloom
        temp_cycle = math.sin((day_of_year - 80) * 2 * math.pi / 365)
        monsoon_runoff = math.exp(-((day_of_year - 230) ** 2) / (2 * (35 ** 2)))  # Peak in August
        bloom_peak = math.exp(-((day_of_year - 290) ** 2) / (2 * (25 ** 2)))     # Peak in late October

        res_bias = 0.02 if reservoir_id == "powai" else 0.005
        fai = max(0.002, 0.007 + res_bias + 0.025 * bloom_peak + 0.006 * temp_cycle)
        chla = max(3.5, 7.0 + (res_bias * 500) + 24.0 * bloom_peak + 5.0 * temp_cycle)
        turb = max(2.5, 4.0 + 18.0 * monsoon_runoff + 6.0 * bloom_peak)
        ndvi = max(0.05, 0.12 + 0.28 * (fai / 0.03))
        ndti = round((turb - 2.0) / (turb + 22.0), 3)

        risk = int(min(98, max(8, (fai / 0.04) * 55 + (chla / 35.0) * 35)))
        if risk >= 65:
            alert = "CRITICAL"
        elif risk >= 35:
            alert = "MODERATE"
        else:
            alert = "SAFE"

        points.append(
            TimeSeriesPoint(
                date=curr_date.strftime("%Y-%m-%d"),
                fai=round(fai, 4),
                ndvi=round(ndvi, 4),
                ndti=round(ndti, 4),
                chlorophyll_a=round(chla, 1),
                turbidity=round(turb, 1),
                bloom_risk_score=risk,
                alert_level=alert,
                is_simulated=False
            )
        )
    return points
