import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { TrendingUp, Calendar, AlertCircle, Info, Sparkles, Sliders } from 'lucide-react';
import { TimeSeriesPoint } from '../types';

interface TimeSeriesChartProps {
  timeSeries: TimeSeriesPoint[];
  thresholds?: {
    fai_moderate: number;
    fai_critical: number;
    chlorophyll_a_moderate: number;
    chlorophyll_a_critical: number;
    turbidity_warning: number;
  };
  lookbackDays: number;
  onDaysChange: (days: number) => void;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  timeSeries,
  thresholds,
  lookbackDays,
  onDaysChange
}) => {
  const [metricMode, setMetricMode] = useState<'fai' | 'chlorophyll' | 'turbidity' | 'risk'>('fai');

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: TimeSeriesPoint = payload[0].payload;
      return (
        <div className="bg-obsidian-950/95 border border-obsidian-700/80 p-4 rounded-2xl shadow-2xl text-xs backdrop-blur-md min-w-[230px]">
          <div className="font-bold text-slate-100 border-b border-obsidian-800 pb-2 mb-2 flex items-center justify-between gap-3">
            <span>Observation: {label}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                data.alert_level === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : data.alert_level === 'MODERATE'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {data.alert_level}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Floating Algae Index:</span>
              <span className="font-mono font-bold text-teal-400">{data.fai.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Chlorophyll-a:</span>
              <span className="font-mono font-bold text-emerald-400">{data.chlorophyll_a} µg/L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Water Turbidity:</span>
              <span className="font-mono font-bold text-cyan-400">{data.turbidity} FNU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HAB Risk Score:</span>
              <span className="font-mono font-bold text-amber-400">{data.bloom_risk_score} / 100</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="time-series" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Multi-Temporal Satellite Trends & Seasonal Phenology
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical 5-day Copernicus Sentinel-2 MSI observation cadence tracking post-monsoon runoff and thermal bloom windows
          </p>
        </div>
      </div>

      {/* Main Chart Container with Generous Padding */}
      <div className="bg-obsidian-900/80 border border-obsidian-700/70 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-glass space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-obsidian-950 p-1.5 rounded-2xl border border-obsidian-800 flex-wrap gap-1">
            <button
              onClick={() => setMetricMode('fai')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                metricMode === 'fai'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floating Algae (FAI)
            </button>
            <button
              onClick={() => setMetricMode('chlorophyll')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                metricMode === 'chlorophyll'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chlorophyll-a (µg/L)
            </button>
            <button
              onClick={() => setMetricMode('turbidity')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                metricMode === 'turbidity'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Turbidity (FNU)
            </button>
            <button
              onClick={() => setMetricMode('risk')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                metricMode === 'risk'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Composite Risk Dial (0-100)
            </button>
          </div>

          {/* Time Window Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Time Horizon:</span>
            <div className="flex items-center bg-obsidian-950 p-1.5 rounded-2xl border border-obsidian-800 text-xs">
              {[60, 120, 180, 365].map((days) => (
                <button
                  key={days}
                  onClick={() => onDaysChange(days)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    lookbackDays === days
                      ? 'bg-emeraldWater-500/20 text-emerald-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {days === 365 ? '1 Year' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spacious Chart Area */}
        <div className="h-80 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorFaiLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorChlaLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTurbLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRiskLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                tickLine={false}
                tickFormatter={(v) => {
                  const parts = v.split('-');
                  return parts.length === 3 ? `${parts[1]}/${parts[2]}` : v;
                }}
              />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} />
              <Tooltip content={customTooltip} />

              {/* Threshold Lines */}
              {metricMode === 'fai' && (
                <>
                  <ReferenceLine
                    y={thresholds?.fai_critical ?? 0.040}
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Critical Bloom Threshold (0.040)', fill: '#EF4444', fontSize: 11, position: 'top' }}
                  />
                  <ReferenceLine
                    y={thresholds?.fai_moderate ?? 0.015}
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Moderate Biomass (0.015)', fill: '#F59E0B', fontSize: 11, position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="fai"
                    name="Floating Algae Index"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorFaiLarge)"
                  />
                </>
              )}

              {metricMode === 'chlorophyll' && (
                <>
                  <ReferenceLine
                    y={thresholds?.chlorophyll_a_critical ?? 35.0}
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'WHO Severe Limit (35.0 µg/L)', fill: '#EF4444', fontSize: 11, position: 'top' }}
                  />
                  <ReferenceLine
                    y={thresholds?.chlorophyll_a_moderate ?? 15.0}
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Elevated Biomass (15.0 µg/L)', fill: '#F59E0B', fontSize: 11, position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="chlorophyll_a"
                    name="Chlorophyll-a"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorChlaLarge)"
                  />
                </>
              )}

              {metricMode === 'turbidity' && (
                <>
                  <ReferenceLine
                    y={thresholds?.turbidity_warning ?? 5.0}
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Potable Drinking Limit (5.0 FNU)', fill: '#EF4444', fontSize: 11, position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="turbidity"
                    name="Turbidity"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTurbLarge)"
                  />
                </>
              )}

              {metricMode === 'risk' && (
                <>
                  <ReferenceLine
                    y={65}
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Severe Danger (Score > 65)', fill: '#EF4444', fontSize: 11, position: 'top' }}
                  />
                  <ReferenceLine
                    y={35}
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{ value: 'Moderate Risk (Score > 35)', fill: '#F59E0B', fontSize: 11, position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bloom_risk_score"
                    name="HAB Risk Score"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRiskLarge)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scientific Interpretation Footer Note */}
        <div className="pt-4 border-t border-obsidian-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              <strong>Seasonal Trend Note:</strong> Post-monsoon runoff (July–September) peaks turbidity; warming temperatures (October–November & March–May) trigger surface cyanobacteria proliferation.
            </span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">
            Data Source: ESA Copernicus Sentinel-2 Level-2A
          </span>
        </div>
      </div>
    </div>
  );
};
