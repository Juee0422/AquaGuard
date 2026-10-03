import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ReservoirSelector } from './components/ReservoirSelector';
import { ThreatAlertBanner } from './components/ThreatAlertBanner';
import { MetricCards } from './components/MetricCards';
import { MapContainer } from './components/MapContainer';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { SpectralIndicesBreakdown } from './components/SpectralIndicesBreakdown';
import { MitigationPanel } from './components/MitigationPanel';
import { SimulationModal } from './components/SimulationModal';
import { ReportExportModal } from './components/ReportExportModal';

import {
  ReservoirInfo,
  ReservoirHealthResponse,
  TimeSeriesResponse,
  SpectralIndicesResponse,
  SimulationParameters
} from './types';
import { api } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_SIM_PARAMS: SimulationParameters = {
  nutrient_spike_factor: 1.0,
  water_temp_anomaly_c: 0.0,
  rainfall_runoff_days: 0,
  sunlight_hours: 8.0,
};

export const App: React.FC = () => {
  const [reservoirs, setReservoirs] = useState<ReservoirInfo[]>([]);
  const [selectedReservoirId, setSelectedReservoirId] = useState<string>('tansa');
  const [healthData, setHealthData] = useState<ReservoirHealthResponse | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResponse | null>(null);
  const [spectralData, setSpectralData] = useState<SpectralIndicesResponse | null>(null);
  
  const [simParams, setSimParams] = useState<SimulationParameters>(DEFAULT_SIM_PARAMS);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [lookbackDays, setLookbackDays] = useState<number>(180);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isSimulating =
    simParams.nutrient_spike_factor !== 1.0 ||
    simParams.water_temp_anomaly_c !== 0.0 ||
    simParams.rainfall_runoff_days !== 0 ||
    simParams.sunlight_hours !== 8.0;

  // Load reservoirs initial list
  useEffect(() => {
    async function init() {
      try {
        const resList = await api.getReservoirs();
        setReservoirs(resList);
        if (resList.length > 0) {
          setSelectedReservoirId(resList[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to establish satellite telemetry link. Make sure backend is running.');
      }
    }
    init();
  }, []);

  // Fetch telemetry whenever selected reservoir, lookback window, or simulation params change
  const loadData = useCallback(async () => {
    if (!selectedReservoirId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [health, ts, spectral] = await Promise.all([
        api.getReservoirHealth(selectedReservoirId, isSimulating ? simParams : undefined),
        api.getTimeSeries(selectedReservoirId, lookbackDays),
        api.getSpectralIndices(selectedReservoirId),
      ]);
      setHealthData(health);
      setTimeSeriesData(ts);
      setSpectralData(spectral);
    } catch (err: any) {
      console.error(err);
      setError(`Telemetry retrieval failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedReservoirId, lookbackDays, isSimulating, simParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetSimulation = () => {
    setSimParams(DEFAULT_SIM_PARAMS);
  };

  const currentReservoir = reservoirs.find((r) => r.id === selectedReservoirId) || reservoirs[0];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        healthData={healthData}
        onOpenSimulation={() => setIsSimModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onRefresh={loadData}
        isSimulating={isSimulating}
        isLoading={isLoading}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 space-y-5">
        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-red-800/60 hover:bg-red-700/80 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Reservoir Quick Switcher Tabs */}
        {reservoirs.length > 0 && (
          <ReservoirSelector
            reservoirs={reservoirs}
            selectedId={selectedReservoirId}
            onSelect={(id) => setSelectedReservoirId(id)}
            isLoading={isLoading}
          />
        )}

        {/* Threat Alert Status Banner */}
        {healthData && (
          <ThreatAlertBanner
            metrics={healthData.metrics}
            indices={healthData.indices}
            reservoirName={healthData.reservoir.name}
          />
        )}

        {/* 6 Key Water Quality Biophysical Metric Cards */}
        {healthData && (
          <MetricCards
            metrics={healthData.metrics}
            indices={healthData.indices}
          />
        )}

        {/* GIS Map & Time Series Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Interactive GIS Map */}
          {currentReservoir && (
            <MapContainer
              reservoir={currentReservoir}
              spatialZones={spectralData?.spatial_zones || []}
              alertLevel={healthData?.metrics.alert_level || 'SAFE'}
            />
          )}

          {/* Time Series Area Chart */}
          {timeSeriesData && (
            <TimeSeriesChart
              timeSeries={timeSeriesData.time_series}
              thresholds={timeSeriesData.thresholds}
              lookbackDays={lookbackDays}
              onDaysChange={(d) => setLookbackDays(d)}
            />
          )}
        </div>

        {/* Sentinel-2 Multi-Spectral Band Math Equations */}
        {healthData && (
          <SpectralIndicesBreakdown indices={healthData.indices} />
        )}

        {/* Treatment Plant Mitigation Protocols Checklist */}
        {healthData && (
          <MitigationPanel
            actions={healthData.mitigation_actions}
            alertLevel={healthData.metrics.alert_level}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-obsidian-800/80 bg-obsidian-950/80 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          AquaGuard AI • Built with ESA Copernicus Sentinel-2 MSI Multi-spectral Data & Google Earth Engine API
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Serving Municipal Drinking Water Systems, Regional Irrigation Authorities, & Environmental Protection Boards
        </p>
      </footer>

      {/* Simulation / Stress-Testing Modal */}
      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        params={simParams}
        onChange={(newParams) => setSimParams(newParams)}
        onReset={handleResetSimulation}
        isSimulating={isSimulating}
      />

      {/* PDF & CSV Report Export Modal */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        healthData={healthData}
        simParams={isSimulating ? simParams : undefined}
      />
    </div>
  );
};
export default App;
