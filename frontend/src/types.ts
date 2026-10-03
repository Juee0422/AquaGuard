export interface ReservoirInfo {
  id: string;
  name: string;
  district: string;
  state: string;
  country: string;
  lat: float;
  lng: float;
  zoom: number;
  capacity_mld: number;
  full_storage_capacity_mcm: number;
  surface_area_sqkm: number;
  description: string;
  key_water_supply_for: string;
}

export type float = number;

export interface SpectralIndices {
  ndwi: number;
  fai: number;
  ndvi: number;
  ndti: number;
}

export interface DerivedMetrics {
  chlorophyll_a_ug_l: number;
  turbidity_fnu: number;
  surface_temperature_c: number;
  water_clarity_secchi_m: number;
  dissolved_oxygen_mg_l: number;
  bloom_coverage_percent: number;
  bloom_risk_score: number;
  alert_level: 'SAFE' | 'MODERATE' | 'CRITICAL';
  primary_driver: string;
}

export interface MitigationAction {
  id: string;
  title: string;
  category: string;
  urgency: 'Routine' | 'High' | 'Critical';
  action_item: string;
  target_parameter: string;
  recommended_dosage?: string;
  status: string;
}

export interface SimulationParameters {
  nutrient_spike_factor: number;
  water_temp_anomaly_c: number;
  rainfall_runoff_days: number;
  sunlight_hours: number;
}

export interface ReservoirHealthResponse {
  reservoir: ReservoirInfo;
  timestamp: string;
  satellite_source: string;
  cloud_cover_percent: number;
  indices: SpectralIndices;
  metrics: DerivedMetrics;
  mitigation_actions: MitigationAction[];
  is_simulated: boolean;
  simulation_factors?: SimulationParameters | null;
}

export interface TimeSeriesPoint {
  date: string;
  fai: number;
  ndvi: number;
  ndti: number;
  chlorophyll_a: number;
  turbidity: number;
  bloom_risk_score: number;
  alert_level: 'SAFE' | 'MODERATE' | 'CRITICAL';
  is_simulated: boolean;
}

export interface TimeSeriesResponse {
  reservoir_id: string;
  reservoir_name: string;
  time_series: TimeSeriesPoint[];
  thresholds: {
    fai_moderate: number;
    fai_critical: number;
    chlorophyll_a_moderate: number;
    chlorophyll_a_critical: number;
    turbidity_warning: number;
  };
}

export interface SpatialZoneFeature {
  zone_id: string;
  zone_name: string;
  fai: number;
  chlorophyll_a: number;
  turbidity: number;
  risk_level: 'SAFE' | 'MODERATE' | 'CRITICAL';
  color_hex: string;
  geojson: any;
}

export interface SpectralIndicesResponse {
  reservoir_id: string;
  reservoir_name: string;
  indices: SpectralIndices;
  band_wavelengths: Record<string, string>;
  spatial_zones: SpatialZoneFeature[];
  geojson_boundary: any;
}
