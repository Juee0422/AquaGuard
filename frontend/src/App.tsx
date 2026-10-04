import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroIntro } from './components/HeroIntro';
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
import { AlertCircle, Waves, Satellite, ShieldCheck, Heart, Sparkles } from 'lucide-react';

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

  // Load reservoirs list
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

  const handleScrollToDashboard = () => {
    const el = document.getElementById('dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentReservoir = reservoirs.find((r) => r.id === selectedReservoirId) || reservoirs[0];
  const totalCapacityMld = reservoirs.reduce((sum, r) => sum + r.capacity_mld, 0);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Sticky Header */}
      <Header
        healthData={healthData}
        onOpenSimulation={() => setIsSimModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onRefresh={loadData}
        isSimulating={isSimulating}
        isLoading={isLoading}
      />

      {/* Welcoming Hero / Intro Landing Section */}
      <div id="overview">
        <HeroIntro
          onExploreDashboard={handleScrollToDashboard}
          onOpenSimulation={() => setIsSimModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          totalCapacityMld={totalCapacityMld}
          totalReservoirs={reservoirs.length}
        />
      </div>

      {/* Main Expansive Dashboard Container */}
      <main id="dashboard" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Error Alert if any */}
        {error && (
          <div className="p-5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-between shadow-glow-coral">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-800/80 hover:bg-red-700 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* 1. Threat Alert Status Banner */}
        {healthData && (
          <section className="space-y-4">
            <ThreatAlertBanner
              metrics={healthData.metrics}
              indices={healthData.indices}
              reservoirName={healthData.reservoir.name}
            />
          </section>
        )}

        {/* 2. Reservoir Selector Section */}
        {reservoirs.length > 0 && (
          <section>
            <ReservoirSelector
              reservoirs={reservoirs}
              selectedId={selectedReservoirId}
              onSelect={(id) => setSelectedReservoirId(id)}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* 3. Key Biophysical Water Quality Metrics (Spacious 6 Cards) */}
        {healthData && (
          <section id="indices">
            <MetricCards
              metrics={healthData.metrics}
              indices={healthData.indices}
            />
          </section>
        )}

        {/* 4. Interactive GIS Map Section (Dedicated full-width view) */}
        {currentReservoir && (
          <section>
            <MapContainer
              reservoir={currentReservoir}
              spatialZones={spectralData?.spatial_zones || []}
              alertLevel={healthData?.metrics.alert_level || 'SAFE'}
            />
          </section>
        )}

        {/* 5. Multi-Temporal Trend Analytics Section */}
        {timeSeriesData && (
          <section>
            <TimeSeriesChart
              timeSeries={timeSeriesData.time_series}
              thresholds={timeSeriesData.thresholds}
              lookbackDays={lookbackDays}
              onDaysChange={(d) => setLookbackDays(d)}
            />
          </section>
        )}

        {/* 6. Multi-Spectral Band Math Scientific Section */}
        {healthData && (
          <section>
            <SpectralIndicesBreakdown indices={healthData.indices} />
          </section>
        )}

        {/* 7. Treatment Plant Mitigation Directives & Operations Playbook */}
        {healthData && (
          <section>
            <MitigationPanel
              actions={healthData.mitigation_actions}
              alertLevel={healthData.metrics.alert_level}
            />
          </section>
        )}
      </main>

      {/* Spacious, Informative Footer */}
      <footer className="mt-20 border-t border-obsidian-800 bg-obsidian-950 px-4 sm:px-6 lg:px-8 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emeraldWater-500/20 text-emerald-400 flex items-center justify-center">
                <Waves className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white">AquaGuard AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Orbital satellite multi-spectral remote sensing for harmful algal bloom early warning, water clarity surveillance, and municipal public health defense.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Monitored Lakes & Watersheds
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Tansa Reservoir (Thane/Palghar)</li>
              <li>• Bhatsa Lake (Shahapur Catchment)</li>
              <li>• Middle & Upper Vaitarna (Igatpuri)</li>
              <li>• Tulsi Lake (SGNP National Park)</li>
              <li>• Powai Lake (Urban Bio-Indicator)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Remote Sensing Physics
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Floating Algae Index (FAI, Hu 2009)</li>
              <li>• Normalized Difference Water Index (NDWI)</li>
              <li>• Turbidity Index (NDTI) & Secchi Depth</li>
              <li>• Chlorophyll-a Inversion Algorithms</li>
              <li>• Copernicus Sentinel-2 MSI 10m L2A</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Water Authorities Supported
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Bhandup Water Treatment Complex, Panjrapur Filtration Works, Brihanmumbai Municipal Corporation (BMC), and Maharashtra Pollution Control Board.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              Status: Operational Sentinel-2 Stream
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-obsidian-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AquaGuard AI • All Sentinel-2 satellite data provided by European Space Agency (ESA) Copernicus Programme.</p>
          <div className="flex items-center space-x-4">
            <a href="#overview" className="hover:text-emerald-400 transition-colors">Back to Top ↑</a>
            <button onClick={() => setIsExportModalOpen(true)} className="hover:text-teal-400 transition-colors">Export Report</button>
            <button onClick={() => setIsSimModalOpen(true)} className="hover:text-amber-400 transition-colors">Simulation Engine</button>
          </div>
        </div>
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
