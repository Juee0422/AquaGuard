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
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { TimeSeriesPoint } from '../types';

interface TimeSeriesChartProps {
  timeSeries: TimeSeriesPoint[];
  thresholds?: {
    fai_moderate: number;
    fai_critical: number;
    chlorophyll_a_moderate: number;
    chlorophyll_a_critical: number;
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
  const [metricMode, setMetricMode] = useState<'fai' | 'chlorophyll' | 'risk'>('fai');

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: TimeSeriesPoint = payload[0].payload;
      return (
        <div className="bg-obsidian-950/95 border border-obsidian-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-slate-200 border-b border-obsidian-800 pb-1 mb-2 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                data.alert_level === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : data.alert_level === 'MODERATE'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {data.alert_level}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Floating Algae Index:</span>
              <span className="font-mono font-bold text-teal-400">{data.fai.toFixed(4)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Chlorophyll-a:</span>
              <span className="font-mono font-bold text-emerald-400">{data.chlorophyll_a} µg/L</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Turbidity:</span>
              <span className="font-mono font-bold text-cyan-400">{data.turbidity} FNU</span>
            </div>
            <div className="flex justify-between gap-4">
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
    <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-glass flex flex-col justify-between">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emeraldWater-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Multi-Temporal Satellite Progression & Threshold Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            5-day Sentinel-2 MSI orbital revisit cycle with historical baseline tracking
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-obsidian-800">
            <button
              onClick={() => setMetricMode('fai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'fai'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FAI (Algae)
            </button>
            <button
              onClick={() => setMetricMode('chlorophyll')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'chlorophyll'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chl-a (µg/L)
            </button>
            <button
              onClick={() => setMetricMode('risk')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                metricMode === 'risk'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Score
            </button>
          </div>

          {/* Lookback Horizon Selector */}
          <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-obsidian-800 text-xs">
            {[60, 120, 180, 365].map((days) => (
              <button
                key={days}
                onClick={() => onDaysChange(days)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lookbackDays === days
                    ? 'bg-emeraldWater-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {days === 365 ? '1Y' : `${days}d`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorChla" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              tick={{ fontSize: 10 }}
              tickLine={false}
              tickFormatter={(v) => {
                const parts = v.split('-');
                return parts.length === 3 ? `${parts[1]}/${parts[2]}` : v;
              }}
            />
            <YAxis stroke="#64748B" tick={{ fontSize: 10 }} tickLine={false} />
            <Tooltip content={customTooltip} />

            {/* Threshold reference lines */}
            {metricMode === 'fai' && (
              <>
                <ReferenceLine
                  y={thresholds?.fai_critical ?? 0.040}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Critical Bloom', fill: '#EF4444', fontSize: 10, position: 'top' }}
                />
                <ReferenceLine
                  y={thresholds?.fai_moderate ?? 0.015}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{ value: 'Moderate Alert', fill: '#F59E0B', fontSize: 10, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="fai"
                  name="Floating Algae Index"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorFai)"
                />
              </>
            )}

            {metricMode === 'chlorophyll' && (
              <>
                <ReferenceLine
                  y={thresholds?.chlorophyll_a_critical ?? 35.0}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'WHO Potable Alert (35 µg/L)', fill: '#EF4444', fontSize: 10, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="chlorophyll_a"
                  name="Chlorophyll-a"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorChla)"
                />
              </>
            )}

            {metricMode === 'risk' && (
              <>
                <ReferenceLine
                  y={65}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Severe Danger', fill: '#EF4444', fontSize: 10, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="bloom_risk_score"
                  name="HAB Risk Score"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
