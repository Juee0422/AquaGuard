import React from 'react';
import { MapPin, Droplets, Database } from 'lucide-react';
import { ReservoirInfo } from '../types';

interface ReservoirSelectorProps {
  reservoirs: ReservoirInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export const ReservoirSelector: React.FC<ReservoirSelectorProps> = ({
  reservoirs,
  selectedId,
  onSelect,
  isLoading
}) => {
  return (
    <div className="bg-obsidian-900/70 border border-obsidian-700/60 rounded-2xl p-2.5 backdrop-blur-md">
      <div className="flex items-center space-x-2 px-3 py-1.5 mb-1.5 border-b border-obsidian-800">
        <MapPin className="w-3.5 h-3.5 text-emeraldWater-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Target Drinking Water Reservoirs & Watersheds
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {reservoirs.map((res) => {
          const isSelected = res.id === selectedId;
          return (
            <button
              key={res.id}
              onClick={() => onSelect(res.id)}
              disabled={isLoading}
              className={`text-left p-3 rounded-xl border transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-obsidian-800 to-obsidian-800/90 border-emeraldWater-500/60 shadow-glow-emerald ring-1 ring-emerald-500/30'
                  : 'bg-obsidian-900/40 hover:bg-obsidian-800/60 border-obsidian-700/50 hover:border-obsidian-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-emeraldWater-500/10 rounded-bl-full pointer-events-none" />
              )}
              
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {res.name}
                </span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1 truncate">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="truncate">{res.district}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-obsidian-700/40 text-[10px]">
                <span className="text-slate-400">Capacity:</span>
                <span className="font-mono font-semibold text-slate-200">{res.capacity_mld} MLD</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
