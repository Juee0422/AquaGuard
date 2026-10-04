import React from 'react';
import {
  Activity,
  Layers,
  Thermometer,
  Eye,
  Wind,
  Droplet,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DerivedMetrics, SpectralIndices } from '../types';

interface MetricCardsProps {
  metrics: DerivedMetrics;
  indices: SpectralIndices;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, indices }) => {
  const cards = [
    {
      title: 'Chlorophyll-a Concentration',
      value: `${metrics.chlorophyll_a_ug_l.toFixed(1)}`,
      unit: 'µg/L',
      subtext: 'Primary photosynthetic pigment indicating live algal biomass in the photic layer.',
      status: metrics.chlorophyll_a_ug_l > 25 ? 'High Risk' : metrics.chlorophyll_a_ug_l > 12 ? 'Elevated' : 'Optimal Baseline',
      statusColor:
        metrics.chlorophyll_a_ug_l > 25
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : metrics.chlorophyll_a_ug_l > 12
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      threshold: '< 10.0 µg/L (WHO Potable Standard)',
      bandOrigin: 'Sentinel-2 B4 (665nm) & B3 (560nm)'
    },
    {
      title: 'Floating Algae Index (FAI)',
      value: `${indices.fai.toFixed(4)}`,
      unit: 'index',
      subtext: 'Baseline subtraction separating surface scum from water background without glint bias.',
      status: indices.fai > 0.035 ? 'Critical Bloom' : indices.fai > 0.015 ? 'Moderate Mat' : 'Clear Photic Layer',
      statusColor:
        indices.fai > 0.035
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : indices.fai > 0.015
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-teal-300 bg-teal-500/20 border-teal-500/40',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      threshold: '> 0.015 indicates algal surface mat',
      bandOrigin: 'Sentinel-2 B8 (842nm), B4 (665nm), B11 (1610nm)'
    },
    {
      title: 'Water Column Turbidity (NDTI)',
      value: `${metrics.turbidity_fnu.toFixed(1)}`,
      unit: 'FNU',
      subtext: 'Suspended mineral silt, colloidal mud, and organic particulate scatter.',
      status: metrics.turbidity_fnu > 10 ? 'High Turbidity' : metrics.turbidity_fnu > 5 ? 'Elevated Silt' : 'Clear & Compliant',
      statusColor:
        metrics.turbidity_fnu > 10
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : metrics.turbidity_fnu > 5
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      icon: <Droplet className="w-5 h-5 text-cyan-400" />,
      threshold: '< 5.0 FNU (Potable treatment limit)',
      bandOrigin: 'Sentinel-2 B4 (665nm) & B3 (560nm)'
    },
    {
      title: 'Water Clarity & Transparency',
      value: `${metrics.water_clarity_secchi_m.toFixed(2)}`,
      unit: 'meters',
      subtext: 'Estimated Secchi disk depth showing solar irradiance penetration limit.',
      status: metrics.water_clarity_secchi_m < 1.0 ? 'Turbid / Poor' : metrics.water_clarity_secchi_m < 2.0 ? 'Moderate' : 'High Transparency',
      statusColor:
        metrics.water_clarity_secchi_m < 1.0
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : metrics.water_clarity_secchi_m < 2.0
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      threshold: '> 2.0 m (Oligotrophic target)',
      bandOrigin: 'Derived Bio-Optical Inversion Model'
    },
    {
      title: 'Surface Water Temperature',
      value: `${metrics.surface_temperature_c.toFixed(1)}`,
      unit: '°C',
      subtext: 'Surface epilimnion temperature driving thermal micro-stratification and cyanobacterial growth.',
      status: metrics.surface_temperature_c > 27 ? 'Stratified Heatwave' : metrics.surface_temperature_c > 25 ? 'Seasonal Warmth' : 'Baseline Cool',
      statusColor:
        metrics.surface_temperature_c > 27
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : metrics.surface_temperature_c > 25
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-teal-300 bg-teal-500/20 border-teal-500/40',
      icon: <Thermometer className="w-5 h-5 text-amber-400" />,
      threshold: 'Critical bloom catalyst: > 26.5 °C',
      bandOrigin: 'Meteorological & Thermal Telemetry'
    },
    {
      title: 'Dissolved Oxygen Proxy',
      value: `${metrics.dissolved_oxygen_mg_l.toFixed(1)}`,
      unit: 'mg/L',
      subtext: 'Bio-chemical oxygen balance in top photic zone indicating respiration vs photosynthesis.',
      status: metrics.dissolved_oxygen_mg_l < 4.0 ? 'Hypoxic Risk' : metrics.dissolved_oxygen_mg_l < 6.0 ? 'Moderate' : 'Well Oxygenated',
      statusColor:
        metrics.dissolved_oxygen_mg_l < 4.0
          ? 'text-red-300 bg-red-500/20 border-red-500/40'
          : metrics.dissolved_oxygen_mg_l < 6.0
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
          : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      icon: <Wind className="w-5 h-5 text-emerald-400" />,
      threshold: '> 5.0 mg/L (Healthy aquatic life)',
      bandOrigin: 'Multi-parameter Bio-Trophic Model'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tealCyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Biophysical Water Quality Indices
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-spectral parameters evaluated against World Health Organization (WHO) and Central Pollution Control Board (CPCB) standards
          </p>
        </div>
      </div>

      {/* Spacious 3-column / 6-card layout with generous padding and readable text */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-obsidian-900/80 hover:bg-obsidian-850/90 border border-obsidian-700/70 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-glow-teal hover:border-teal-500/40 group relative flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Title & Icon */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-slate-200">{card.title}</span>
                <div className="p-2 rounded-xl bg-obsidian-800 border border-obsidian-700/80 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
              </div>

              {/* Value & Unit */}
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {card.value}
                </span>
                <span className="text-sm font-semibold text-slate-400 font-mono">{card.unit}</span>
              </div>

              {/* Subtext description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {card.subtext}
              </p>
            </div>

            {/* Bottom Status & Threshold Information */}
            <div className="pt-3 border-t border-obsidian-800/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${card.statusColor}`}>
                  {card.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Threshold:</span>
                <span className="font-mono text-slate-300 font-medium">{card.threshold}</span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Source: {card.bandOrigin}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
