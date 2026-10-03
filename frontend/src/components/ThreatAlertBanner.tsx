import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, Activity, Info } from 'lucide-react';
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
        border: 'border-red-500/40',
        bg: 'bg-gradient-to-r from-red-950/60 via-red-900/30 to-obsidian-900/90',
        glow: 'shadow-glow-coral',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
        accentText: 'text-red-400',
        icon: <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce" />,
        statusLabel: 'CRITICAL BLOOM ALERT',
        description: 'Hazardous cyanobacterial proliferation detected. High potential for microcystin/anatoxin release and severe filter clogging at raw water intake.',
      }
    : isModerate
    ? {
        border: 'border-amber-500/40',
        bg: 'bg-gradient-to-r from-amber-950/50 via-amber-900/20 to-obsidian-900/90',
        glow: 'shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentText: 'text-amber-400',
        icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        statusLabel: 'MODERATE BLOOM RISK',
        description: 'Elevated floating algae density observed in shallow inlets. Preemptive chemical dosage adjustments recommended to suppress MIB/Geosmin odor compounds.',
      }
    : {
        border: 'border-emerald-500/30',
        bg: 'bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-obsidian-900/90',
        glow: 'shadow-glow-emerald',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentText: 'text-emerald-400',
        icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        statusLabel: 'OPTIMAL / SAFE STATUS',
        description: 'Surface waters exhibit low trophic index and high optical clarity. Normal drinking water treatment protocols remain fully compliant.',
      };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${themeConfig.border} ${themeConfig.bg} ${themeConfig.glow} p-4 sm:p-5 transition-all duration-300`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Icon, Badge, Description */}
        <div className="flex items-start space-x-3.5 flex-1">
          <div className="mt-0.5 p-2 rounded-xl bg-obsidian-800/80 border border-obsidian-700/60 shadow-inner">
            {themeConfig.icon}
          </div>

          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${themeConfig.badgeBg}`}
              >
                {themeConfig.statusLabel}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Target: <strong className="text-slate-200">{reservoirName}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {themeConfig.description}
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-0.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>
                <strong>Primary Driver:</strong> {metrics.primary_driver}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Risk Score Gauge & Key Telemetry Badges */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 lg:border-l lg:border-obsidian-700/60 lg:pl-6">
          {/* Risk Score Dial */}
          <div className="flex items-center space-x-3 bg-obsidian-900/80 px-3.5 py-2 rounded-xl border border-obsidian-700/50">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">HAB Risk Score</div>
              <div className={`text-2xl font-black ${themeConfig.accentText}`}>
                {metrics.bloom_risk_score}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className="w-12 h-2.5 bg-obsidian-800 rounded-full overflow-hidden border border-obsidian-700">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCritical ? 'bg-red-500' : isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${metrics.bloom_risk_score}%` }}
              />
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-obsidian-800/80 px-2.5 py-1.5 rounded-lg border border-obsidian-700/50">
              <span className="text-slate-400 block text-[10px] uppercase">Bloom Area</span>
              <span className="font-bold text-slate-200">{metrics.bloom_coverage_percent}%</span>
            </div>
            <div className="bg-obsidian-800/80 px-2.5 py-1.5 rounded-lg border border-obsidian-700/50">
              <span className="text-slate-400 block text-[10px] uppercase">FAI Index</span>
              <span className={`font-bold font-mono ${themeConfig.accentText}`}>{indices.fai.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
