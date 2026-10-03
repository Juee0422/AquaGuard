import React from 'react';
import { Satellite, Waves, ShieldAlert, Sparkles, Download, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { ReservoirHealthResponse } from '../types';

interface HeaderProps {
  healthData: ReservoirHealthResponse | null;
  onOpenSimulation: () => void;
  onOpenExport: () => void;
  onRefresh: () => void;
  isSimulating: boolean;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  healthData,
  onOpenSimulation,
  onOpenExport,
  onRefresh,
  isSimulating,
  isLoading
}) => {
  return (
    <header className="sticky top-0 z-40 bg-obsidian-950/80 backdrop-blur-md border-b border-obsidian-700/60 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Satellite Indicator */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emeraldWater-500 to-tealCyan-600 flex items-center justify-center shadow-glow-emerald">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emeraldWater-400 rounded-full border-2 border-obsidian-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                AquaGuard AI
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.4 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Satellite className="w-3.5 h-3.5 text-tealCyan-400" />
              <span>Copernicus Sentinel-2 MSI • 10m Multi-spectral Telemetry</span>
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-800/80 border border-obsidian-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emeraldWater-400 animate-ping" />
            <span className="text-slate-300 font-medium">
              {isSimulating ? 'Simulation Mode Active' : 'Sentinel-2 Ingestion Active'}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Satellite Imagery"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Simulation Slider Trigger */}
          <button
            onClick={onOpenSimulation}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 border-obsidian-700 hover:border-teal-500/40'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-tealCyan-400" />
            <span>{isSimulating ? 'Adjust Scenario' : 'What-If Simulation'}</span>
            {isSimulating && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Export Report Trigger */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emeraldWater-500 to-tealCyan-600 hover:from-emeraldWater-600 hover:to-tealCyan-700 text-white shadow-glow-emerald transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
