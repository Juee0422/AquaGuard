import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Beaker,
  Shield,
  Layers,
  ChevronRight
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
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-emeraldWater-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Mitigation Strategy Engine & Water Plant Directives
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generated operational procedures calibrated to active satellite bloom severity
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Plant Status:</span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
              alertLevel === 'CRITICAL'
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : alertLevel === 'MODERATE'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {alertLevel === 'CRITICAL' ? 'Emergency Protocol' : alertLevel === 'MODERATE' ? 'Elevated Monitoring' : 'Standard Routine'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((act) => {
          const isDone = !!completedIds[act.id];

          return (
            <div
              key={act.id}
              onClick={() => toggleAction(act.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-obsidian-950/40 border-obsidian-800 opacity-60'
                  : 'bg-obsidian-950/80 hover:bg-obsidian-850 border-obsidian-700/70 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className={`mt-0.5 flex-shrink-0 transition-colors ${
                    isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${isDone ? 'fill-emerald-500/20' : ''}`} />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getUrgencyBadge(
                        act.urgency
                      )}`}
                    >
                      {act.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-obsidian-800 px-2 py-0.5 rounded border border-obsidian-700">
                      {act.category}
                    </span>
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {act.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{act.action_item}</p>

                  {act.recommended_dosage && (
                    <div className="text-[11px] text-teal-300 font-mono flex items-center gap-1.5 pt-0.5">
                      <Beaker className="w-3 h-3 text-teal-400" />
                      <span>
                        <strong>Prescribed Dosage / Config:</strong> {act.recommended_dosage}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-obsidian-800/80 pt-2 sm:pt-0 sm:pl-4 text-right flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Metric</span>
                <span className="text-xs font-medium text-slate-200">{act.target_parameter}</span>
                <span className="text-[10px] text-emerald-400 mt-1">
                  {isDone ? 'Protocol Completed' : 'Click to Mark Complete'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
