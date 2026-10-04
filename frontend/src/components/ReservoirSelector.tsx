import React from 'react';
import { MapPin, Droplets, Database, Compass, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
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
    <div id="reservoirs" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Monitored Drinking Water Reservoirs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Select a target reservoir to inspect Sentinel-2 MSI surface reflectance, spatial sub-zones, and bio-optical indices
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-obsidian-900/80 px-3 py-1.5 rounded-xl border border-obsidian-800 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-tealCyan-400" />
          <span>{reservoirs.length} Watershed Catchments Monitored</span>
        </div>
      </div>

      {/* Spacious Reservoir Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {reservoirs.map((res) => {
          const isSelected = res.id === selectedId;
          return (
            <button
              key={res.id}
              onClick={() => onSelect(res.id)}
              disabled={isLoading}
              className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-900 border-emeraldWater-500/70 shadow-glow-emerald ring-1 ring-emerald-500/40 transform -translate-y-0.5'
                  : 'bg-obsidian-900/60 hover:bg-obsidian-850/80 border-obsidian-700/60 hover:border-obsidian-600 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emeraldWater-500/10 rounded-bl-full pointer-events-none" />
              )}

              <div>
                {/* Top Status & Lake Name */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-sm sm:text-base font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-100 group-hover:text-white'}`}>
                    {res.name}
                  </span>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {isSelected ? (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-500" />
                    )}
                  </div>
                </div>

                {/* District / Geography */}
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-tealCyan-400 flex-shrink-0" />
                  <span className="truncate">{res.district}</span>
                </div>

                {/* Description snippet */}
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {res.description}
                </p>
              </div>

              {/* Bottom Metrics Pill */}
              <div className="pt-3 border-t border-obsidian-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Daily Supply:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {res.capacity_mld > 0 ? `${res.capacity_mld} MLD` : 'Ecological Lake'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Surface Area:</span>
                  <span className="font-mono text-slate-300">{res.surface_area_sqkm} km²</span>
                </div>

                <div className="text-[10px] text-emerald-400/90 font-medium pt-1 flex items-center justify-between">
                  <span>{isSelected ? 'Active Live View' : 'Click to inspect'}</span>
                  <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
