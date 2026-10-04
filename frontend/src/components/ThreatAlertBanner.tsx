import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, Activity, Info, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { DerivedMetrics, SpectralIndices } from '../types';

interface ThreatAlertBannerProps {
  metrics: DerivedMetrics;
  indices: SpectralIndices;
  reservoirName: string;
}

export const ThreatAlertBanner: React.FC<ThreatAlertBannerProps> = ({
  metrics,
  indices,
  reservoirName
}) => {
  const isCritical = metrics.alert_level === 'CRITICAL';
  const isModerate = metrics.alert_level === 'MODERATE';

  const themeConfig = isCritical
    ? {
        border: 'border-red-500/50',
        bg: 'bg-gradient-to-r from-red-950/70 via-red-900/30 to-obsidian-900/90',
        glow: 'shadow-glow-coral',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
        accentText: 'text-red-400',
        barColor: 'bg-red-500',
        icon: <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce" />,
        statusLabel: 'CRITICAL CYANOTOXIN & BLOOM ALERT',
        description:
          'Hazardous cyanobacterial proliferation detected. High potential for microcystin/anatoxin release and severe filter clogging at raw water intake works.',
        actionSummary: 'Immediate depth gate submersion & emergency PAC carbon adsorption active.',
      }
    : isModerate
    ? {
        border: 'border-amber-500/50',
        bg: 'bg-gradient-to-r from-amber-950/60 via-amber-900/25 to-obsidian-900/90',
        glow: 'shadow-[0_0_25px_-3px_rgba(245,158,11,0.25)]',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        accentText: 'text-amber-400',
        barColor: 'bg-amber-400',
        icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
        statusLabel: 'MODERATE ALGAL BIOMASS SURGE',
        description:
          'Elevated floating algae density observed in shallow inlets. Preemptive chemical dosage adjustments recommended to suppress MIB/Geosmin odor compounds.',
        actionSummary: 'Elevate coagulant dosing by 25% and activate intake bubble aeration.',
      }
    : {
        border: 'border-emerald-500/40',
        bg: 'bg-gradient-to-r from-emerald-950/50 via-emerald-900/20 to-obsidian-900/90',
        glow: 'shadow-glow-emerald',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        accentText: 'text-emerald-400',
        barColor: 'bg-emerald-400',
        icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
        statusLabel: 'OPTIMAL POTABLE WATER STATUS',
        description:
          'Surface waters exhibit low trophic index and high optical clarity. Normal drinking water treatment protocols remain fully compliant.',
        actionSummary: 'Standard baseline optical calibrations and watershed surveillance.',
      };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${themeConfig.border} ${themeConfig.bg} ${themeConfig.glow} p-6 sm:p-7 transition-all duration-300 backdrop-blur-md`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Icon, Badge, Description */}
        <div className="flex items-start space-x-4 flex-1">
          <div className="mt-1 p-3 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/80 shadow-inner flex-shrink-0">
            {themeConfig.icon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <span
                className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${themeConfig.badgeBg}`}
              >
                {themeConfig.statusLabel}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                Active Telemetry: <strong className="text-white font-bold">{reservoirName}</strong>
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-3xl">
              {themeConfig.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-300">Primary Ecological Driver:</strong> {metrics.primary_driver}
                </span>
              </div>
              <div className="hidden sm:block text-slate-600">•</div>
              <div className="text-teal-300 font-medium">
                <strong>Directive:</strong> {themeConfig.actionSummary}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Risk Score Dial & Key Telemetry Badges */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6 lg:border-l lg:border-obsidian-700/60 lg:pl-8 flex-shrink-0">
          {/* Risk Score Dial */}
          <div className="bg-obsidian-900/90 px-5 py-3.5 rounded-2xl border border-obsidian-700/60 shadow-lg min-w-[170px]">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              Composite HAB Threat
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${themeConfig.accentText}`}>
                {metrics.bloom_risk_score}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="w-full h-2.5 bg-obsidian-800 rounded-full overflow-hidden border border-obsidian-700 mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${themeConfig.barColor}`}
                style={{ width: `${metrics.bloom_risk_score}%` }}
              />
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-obsidian-900/80 px-4 py-2.5 rounded-xl border border-obsidian-700/60 min-w-[110px]">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bloom Area</span>
              <span className="text-base font-bold text-white font-mono">{metrics.bloom_coverage_percent}%</span>
            </div>
            <div className="bg-obsidian-900/80 px-4 py-2.5 rounded-xl border border-obsidian-700/60 min-w-[110px]">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">FAI Index</span>
              <span className={`text-base font-bold font-mono ${themeConfig.accentText}`}>
                {indices.fai.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
