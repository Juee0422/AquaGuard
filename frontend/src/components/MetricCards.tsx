import React from 'react';
import {
  Activity,
  Layers,
  Thermometer,
  Eye,
  Wind,
  Droplet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { DerivedMetrics, SpectralIndices } from '../types';

interface MetricCardsProps {
  metrics: DerivedMetrics;
  indices: SpectralIndices;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, indices }) => {
  const cards = [
    {
      title: 'Chlorophyll-a',
      value: `${metrics.chlorophyll_a_ug_l.toFixed(1)}`,
      unit: 'µg/L',
      subtext: 'Primary photosynthetic pigment proxy',
      status: metrics.chlorophyll_a_ug_l > 25 ? 'High Risk' : metrics.chlorophyll_a_ug_l > 12 ? 'Elevated' : 'Optimal',
      statusColor: metrics.chlorophyll_a_ug_l > 25 ? 'text-red-400 bg-red-500/10 border-red-500/30' : metrics.chlorophyll_a_ug_l > 12 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      threshold: 'Safe threshold: < 10 µg/L',
    },
    {
      title: 'Floating Algae Index (FAI)',
      value: `${indices.fai.toFixed(4)}`,
      unit: 'index',
      subtext: 'B8 - [B4 + (B11-B4) × λ factor]',
      status: indices.fai > 0.035 ? 'Critical Bloom' : indices.fai > 0.015 ? 'Moderate Mat' : 'Clear Basin',
      statusColor: indices.fai > 0.035 ? 'text-red-400 bg-red-500/10 border-red-500/30' : indices.fai > 0.015 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      threshold: 'Threshold: > 0.015 indicates bloom',
    },
    {
      title: 'Turbidity Proxy (NDTI)',
      value: `${metrics.turbidity_fnu.toFixed(1)}`,
      unit: 'FNU',
      subtext: 'Suspended sediment & biomass scatter',
      status: metrics.turbidity_fnu > 10 ? 'High Turbidity' : metrics.turbidity_fnu > 5 ? 'Elevated' : 'Compliant',
      statusColor: metrics.turbidity_fnu > 10 ? 'text-red-400 bg-red-500/10 border-red-500/30' : metrics.turbidity_fnu > 5 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: <Droplet className="w-5 h-5 text-cyan-400" />,
      threshold: 'Potable limit: < 5.0 FNU',
    },
    {
      title: 'Water Clarity (Secchi)',
      value: `${metrics.water_clarity_secchi_m.toFixed(2)}`,
      unit: 'm',
      subtext: 'Photic zone optical depth',
      status: metrics.water_clarity_secchi_m < 1.0 ? 'Murky / Low' : metrics.water_clarity_secchi_m < 2.0 ? 'Moderate' : 'High Transparency',
      statusColor: metrics.water_clarity_secchi_m < 1.0 ? 'text-red-400 bg-red-500/10 border-red-500/30' : metrics.water_clarity_secchi_m < 2.0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      threshold: 'Ideal transparency: > 2.0 m',
    },
    {
      title: 'Surface Water Temp',
      value: `${metrics.surface_temperature_c.toFixed(1)}`,
      unit: '°C',
      subtext: 'Thermal micro-stratification driver',
      status: metrics.surface_temperature_c > 27 ? 'Heatwave Anomaly' : metrics.surface_temperature_c > 25 ? 'Mild Elevation' : 'Baseline Season',
      statusColor: metrics.surface_temperature_c > 27 ? 'text-red-400 bg-red-500/10 border-red-500/30' : metrics.surface_temperature_c > 25 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      icon: <Thermometer className="w-5 h-5 text-amber-400" />,
      threshold: 'Stratification danger: > 26.5 °C',
    },
    {
      title: 'Dissolved Oxygen Proxy',
      value: `${metrics.dissolved_oxygen_mg_l.toFixed(1)}`,
      unit: 'mg/L',
      subtext: 'Aquatic respiration & trophic health',
      status: metrics.dissolved_oxygen_mg_l < 4.0 ? 'Hypoxic Danger' : metrics.dissolved_oxygen_mg_l < 6.0 ? 'Moderate' : 'Well Oxygenated',
      statusColor: metrics.dissolved_oxygen_mg_l < 4.0 ? 'text-red-400 bg-red-500/10 border-red-500/30' : metrics.dissolved_oxygen_mg_l < 6.0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: <Wind className="w-5 h-5 text-emerald-400" />,
      threshold: 'Minimum standard: > 5.0 mg/L',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-obsidian-900/80 hover:bg-obsidian-850 border border-obsidian-700/60 rounded-2xl p-3.5 backdrop-blur-md transition-all duration-200 hover:shadow-glow-teal group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-300 truncate">{card.title}</span>
              <div className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700/60 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline space-x-1.5 mb-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {card.value}
              </span>
              <span className="text-xs text-slate-400 font-mono">{card.unit}</span>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight mb-2 line-clamp-1">{card.subtext}</p>
          </div>

          <div className="pt-2 border-t border-obsidian-800/80 flex items-center justify-between text-[10px]">
            <span className={`px-2 py-0.5 rounded-md font-semibold border ${card.statusColor}`}>
              {card.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
