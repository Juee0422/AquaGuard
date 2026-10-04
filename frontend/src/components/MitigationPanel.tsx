import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Beaker,
  Shield,
  Layers,
  ChevronRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { MitigationAction } from '../types';

interface MitigationPanelProps {
  actions: MitigationAction[];
  alertLevel: 'SAFE' | 'MODERATE' | 'CRITICAL';
}

export const MitigationPanel: React.FC<MitigationPanelProps> = ({ actions, alertLevel }) => {
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const toggleAction = (id: string) => {
    setCompletedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div id="mitigation" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Water Treatment Plant Mitigation Directives & Emergency Playbook
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Prescriptive chemical dosages and intake adjustments calibrated to active satellite bloom severity
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Treatment Complex State:</span>
          <span
            className={`px-3 py-1 rounded-full font-black uppercase text-[11px] border ${
              alertLevel === 'CRITICAL'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : alertLevel === 'MODERATE'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {alertLevel === 'CRITICAL' ? 'Emergency Protocol Active' : alertLevel === 'MODERATE' ? 'Elevated Coagulation Monitoring' : 'Standard Routine Monitoring'}
          </span>
        </div>
      </div>

      {/* Spacious Mitigation Action Cards */}
      <div className="space-y-4">
        {actions.map((act, idx) => {
          const isDone = !!completedIds[act.id];

          return (
            <div
              key={act.id}
              onClick={() => toggleAction(act.id)}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                isDone
                  ? 'bg-obsidian-950/40 border-obsidian-800 opacity-60'
                  : 'bg-obsidian-900/80 hover:bg-obsidian-850 border-obsidian-700/70 hover:border-teal-500/40 hover:shadow-glow-teal'
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  type="button"
                  className={`mt-1 flex-shrink-0 transition-colors ${
                    isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-6 h-6 ${isDone ? 'fill-emerald-500/20' : ''}`} />
                </button>

                <div className="space-y-2">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Step #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border ${getUrgencyBadge(
                        act.urgency
                      )}`}
                    >
                      {act.urgency}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-obsidian-800 px-2.5 py-0.5 rounded-lg border border-obsidian-700">
                      {act.category}
                    </span>
                    <span className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {act.title}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {act.action_item}
                  </p>

                  {act.recommended_dosage && (
                    <div className="text-xs text-teal-300 font-mono flex items-center gap-2 pt-1">
                      <Beaker className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>
                        <strong className="text-teal-200">Recommended Chemical Dosing / Configuration:</strong> {act.recommended_dosage}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Target Metric & Status */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-obsidian-800 pt-3 lg:pt-0 lg:pl-6 text-right flex-shrink-0 min-w-[200px]">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Objective</span>
                  <span className="text-xs font-semibold text-slate-200">{act.target_parameter}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-obsidian-800 text-slate-300 border border-obsidian-700 hover:text-white'
                    }`}
                  >
                    {isDone ? 'Directive Completed ✓' : 'Click to Acknowledge'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
