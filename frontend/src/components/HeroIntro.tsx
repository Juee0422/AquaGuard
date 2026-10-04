import React from 'react';
import {
  Satellite,
  Waves,
  ShieldAlert,
  Sparkles,
  ArrowDown,
  SlidersHorizontal,
  Download,
  Activity,
  Layers,
  CheckCircle2,
  Database,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';

interface HeroIntroProps {
  onExploreDashboard: () => void;
  onOpenSimulation: () => void;
  onOpenExport: () => void;
  totalCapacityMld: number;
  totalReservoirs: number;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  onExploreDashboard,
  onOpenSimulation,
  onOpenExport,
  totalCapacityMld,
  totalReservoirs
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 border-b border-obsidian-800/80">
      {/* Ambient background glow & radial highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none opacity-40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emeraldWater-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-24 right-1/4 w-[420px] h-[420px] bg-tealCyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-obsidian-900/60 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Announcement Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-glow-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Copernicus Sentinel-2 MSI • 10m Multi-spectral Telemetry Active</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-obsidian-800/90 border border-obsidian-700/80 text-slate-300 text-xs font-medium backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5 text-tealCyan-400" />
            <span>Protecting Greater Mumbai & Western Ghats Water Reserves</span>
          </div>
        </div>

        {/* Hero Title & Mission Statement */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Satellite-Powered Early Warning for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Harmful Algal Blooms
            </span>{' '}
            & Drinking Water Security
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            AquaGuard AI fuses orbital satellite surface reflectance with bio-optical band mathematics to detect
            toxic cyanobacteria, floating algal scums, and post-monsoon turbidity anomalies days before conventional laboratory tests.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onExploreDashboard}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emeraldWater-500 to-tealCyan-600 hover:from-emeraldWater-600 hover:to-tealCyan-700 text-white shadow-glow-emerald hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Live Telemetry & GIS</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={onOpenSimulation}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl text-sm font-semibold bg-obsidian-900/90 hover:bg-obsidian-800 border border-obsidian-700 hover:border-amber-500/50 text-slate-200 hover:text-white transition-all backdrop-blur-md"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>What-If Stress Simulator</span>
            </button>

            <button
              onClick={onOpenExport}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl text-sm font-semibold bg-obsidian-900/90 hover:bg-obsidian-800 border border-obsidian-700 hover:border-teal-500/50 text-slate-200 hover:text-white transition-all backdrop-blur-md"
            >
              <Download className="w-4 h-4 text-tealCyan-400" />
              <span>Audit Report PDF</span>
            </button>
          </div>
        </div>

        {/* Live Surveillance Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4">
          <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-5 text-center backdrop-blur-md hover:border-emerald-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mb-1">
              {totalCapacityMld.toLocaleString()}+
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              MLD Potable Supply
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Daily municipal water volume</p>
          </div>

          <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-5 text-center backdrop-blur-md hover:border-teal-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black font-mono text-tealCyan-400 mb-1">
              21.5M+
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Citizens Protected
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mumbai & Thane Metropolitan Region</p>
          </div>

          <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-5 text-center backdrop-blur-md hover:border-sky-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black font-mono text-sky-400 mb-1">
              5 Days
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sentinel-2 Revisit
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Copernicus constellation cadence</p>
          </div>

          <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-5 text-center backdrop-blur-md hover:border-amber-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 mb-1">
              {totalReservoirs} Lakes
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Reservoirs
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Tansa, Bhatsa, Vaitarna, Tulsi, Powai</p>
          </div>
        </div>

        {/* 4 Feature Pillars with Spacious Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          <div className="bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/80 border border-obsidian-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-glow-emerald transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-emerald-400">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">10m Multi-Spectral GIS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct pixel band extraction across B3 (Green 560nm), B4 (Red 665nm), B8 (NIR 842nm), and B11 (SWIR 1610nm) calibrated for water surface reflectance.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-obsidian-800 text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
              <span>Sentinel-2 L2A Harmonized</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/80 border border-obsidian-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-teal-500/50 hover:shadow-glow-teal transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-teal-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Floating Algae Index (FAI)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Separates sub-surface cyanobacterial colonies and surface scums from atmospheric haze, providing superior early detection over terrestrial NDVI.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-obsidian-800 text-[11px] font-medium text-teal-400 flex items-center gap-1.5">
              <span>Hu (2009) Algae Algorithm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/80 border border-obsidian-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Plant Operator Directives</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prescriptive chemical dosages (PAC dosing, Polyaluminium Chloride coagulant adjustment) and intake gate depth calibrations for water treatment plants.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-obsidian-800 text-[11px] font-medium text-cyan-400 flex items-center gap-1.5">
              <span>Bhandup & Panjrapur Ready</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-obsidian-900/90 to-obsidian-950/80 border border-obsidian-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)] transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-amber-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">What-If Ecological Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test future scenarios including post-monsoon agricultural fertilizer runoff, heatwave temperature anomalies, and solar radiation fluctuations in real time.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-obsidian-800 text-[11px] font-medium text-amber-400 flex items-center gap-1.5">
              <span>Interactive Stress Tester</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
