import React from 'react';
import {
  X,
  Sliders,
  Flame,
  Droplets,
  Sun,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { SimulationParameters } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SimulationParameters;
  onChange: (params: SimulationParameters) => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  params,
  onChange,
  onReset,
  isSimulating
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      name: 'Baseline Pristine',
      desc: 'Optimal post-monsoon oligotrophic equilibrium',
      config: { nutrient_spike_factor: 1.0, water_temp_anomaly_c: 0.0, rainfall_runoff_days: 0, sunlight_hours: 8.0 }
    },
    {
      name: 'Agricultural Influx',
      desc: 'Post-harvest fertilizer & nitrogen runoff',
      config: { nutrient_spike_factor: 2.2, water_temp_anomaly_c: 1.5, rainfall_runoff_days: 5, sunlight_hours: 9.0 }
    },
    {
      name: 'Summer Heatwave',
      desc: 'Extreme thermal stratification & water stagnation',
      config: { nutrient_spike_factor: 1.6, water_temp_anomaly_c: 4.8, rainfall_runoff_days: 0, sunlight_hours: 11.5 }
    },
    {
      name: 'Severe HAB Bloom',
      desc: 'Catastrophic post-monsoon nutrient spike + heatwave',
      config: { nutrient_spike_factor: 3.2, water_temp_anomaly_c: 5.5, rainfall_runoff_days: 10, sunlight_hours: 12.0 }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-obsidian-900 border border-obsidian-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-obsidian-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                What-If Environmental Stress Test Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate nutrient influx, heatwave anomalies, and solar exposure on HAB dynamics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Quick Stress-Test Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange(preset.config)}
                  className="p-2.5 rounded-xl bg-obsidian-950/70 hover:bg-obsidian-800 border border-obsidian-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-2">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Slider 1: Nutrient Multiplier */}
            <div className="bg-obsidian-950/60 p-4 rounded-xl border border-obsidian-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Nutrient Spike Factor (Nitrogen & Phosphorus)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {params.nutrient_spike_factor.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.05"
                value={params.nutrient_spike_factor}
                onChange={(e) =>
                  onChange({ ...params, nutrient_spike_factor: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.5x (Oligotrophic)</span>
                <span>1.0x (Normal Baseline)</span>
                <span>3.5x (Severe Agricultural Runoff)</span>
              </div>
            </div>

            {/* Slider 2: Water Temperature Anomaly */}
            <div className="bg-obsidian-950/60 p-4 rounded-xl border border-obsidian-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Water Temperature Anomaly (°C Heatwave)
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {params.water_temp_anomaly_c > 0 ? `+${params.water_temp_anomaly_c.toFixed(1)}` : params.water_temp_anomaly_c.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="7.0"
                step="0.1"
                value={params.water_temp_anomaly_c}
                onChange={(e) =>
                  onChange({ ...params, water_temp_anomaly_c: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-2.0 °C (Cool)</span>
                <span>0.0 °C (Seasonal Baseline)</span>
                <span>+7.0 °C (Severe Heatwave)</span>
              </div>
            </div>

            {/* Slider 3: Runoff Days */}
            <div className="bg-obsidian-950/60 p-4 rounded-xl border border-obsidian-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Post-Monsoon Turbidity Runoff Days
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {params.rainfall_runoff_days} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={params.rainfall_runoff_days}
                onChange={(e) =>
                  onChange({ ...params, rainfall_runoff_days: parseInt(e.target.value) })
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 Days</span>
                <span>7 Days (Medium Runoff)</span>
                <span>15 Days (Silt Inundation)</span>
              </div>
            </div>

            {/* Slider 4: Sunlight Hours */}
            <div className="bg-obsidian-950/60 p-4 rounded-xl border border-obsidian-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  Daily Solar Irradiance / Sunlight Hours
                </span>
                <span className="font-mono font-bold text-yellow-400 text-sm">
                  {params.sunlight_hours.toFixed(1)} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="13.0"
                step="0.5"
                value={params.sunlight_hours}
                onChange={(e) =>
                  onChange({ ...params, sunlight_hours: parseFloat(e.target.value) })
                }
                className="w-full accent-yellow-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2.0 hrs (Heavy Cloud)</span>
                <span>8.0 hrs (Clear Day)</span>
                <span>13.0 hrs (High Summer Solstice)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-obsidian-800 bg-obsidian-950 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-obsidian-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Satellite Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emeraldWater-500 to-tealCyan-600 hover:from-emeraldWater-600 hover:to-tealCyan-700 text-white shadow-glow-emerald transition-all"
          >
            Apply Scenario & Return to Map
          </button>
        </div>
      </div>
    </div>
  );
};
