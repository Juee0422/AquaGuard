import {
  ReservoirInfo,
  ReservoirHealthResponse,
  TimeSeriesResponse,
  SpectralIndicesResponse,
  SimulationParameters
} from '../types';

const API_BASE = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8000/api'
  : '/api';

export const api = {
  async getReservoirs(): Promise<ReservoirInfo[]> {
    const res = await fetch(`${API_BASE}/reservoirs`);
    if (!res.ok) throw new Error('Failed to fetch reservoirs list');
    return res.json();
  },

  async getReservoirHealth(
    reservoirId: string,
    simParams?: SimulationParameters
  ): Promise<ReservoirHealthResponse> {
    const params = new URLSearchParams({ reservoir_id: reservoirId });
    if (simParams) {
      params.append('nutrient_spike_factor', simParams.nutrient_spike_factor.toString());
      params.append('water_temp_anomaly_c', simParams.water_temp_anomaly_c.toString());
      params.append('rainfall_runoff_days', simParams.rainfall_runoff_days.toString());
      params.append('sunlight_hours', simParams.sunlight_hours.toString());
    }

    const res = await fetch(`${API_BASE}/reservoir-health?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch health for reservoir ${reservoirId}`);
    return res.json();
  },

  async getTimeSeries(reservoirId: string, days: number = 180): Promise<TimeSeriesResponse> {
    const params = new URLSearchParams({
      reservoir_id: reservoirId,
      days: days.toString()
    });
    const res = await fetch(`${API_BASE}/time-series?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch time series for ${reservoirId}`);
    return res.json();
  },

  async getSpectralIndices(reservoirId: string): Promise<SpectralIndicesResponse> {
    const params = new URLSearchParams({ reservoir_id: reservoirId });
    const res = await fetch(`${API_BASE}/spectral-indices?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch spectral indices for ${reservoirId}`);
    return res.json();
  },

  getExportPdfUrl(reservoirId: string, simParams?: SimulationParameters): string {
    const params = new URLSearchParams({ reservoir_id: reservoirId });
    if (simParams) {
      params.append('nutrient_spike_factor', simParams.nutrient_spike_factor.toString());
      params.append('water_temp_anomaly_c', simParams.water_temp_anomaly_c.toString());
      params.append('rainfall_runoff_days', simParams.rainfall_runoff_days.toString());
      params.append('sunlight_hours', simParams.sunlight_hours.toString());
    }
    return `${API_BASE}/export-report/pdf?${params.toString()}`;
  },

  getExportCsvUrl(reservoirId: string, simParams?: SimulationParameters): string {
    const params = new URLSearchParams({ reservoir_id: reservoirId });
    if (simParams) {
      params.append('nutrient_spike_factor', simParams.nutrient_spike_factor.toString());
      params.append('water_temp_anomaly_c', simParams.water_temp_anomaly_c.toString());
      params.append('rainfall_runoff_days', simParams.rainfall_runoff_days.toString());
      params.append('sunlight_hours', simParams.sunlight_hours.toString());
    }
    return `${API_BASE}/export-report/csv?${params.toString()}`;
  }
};
