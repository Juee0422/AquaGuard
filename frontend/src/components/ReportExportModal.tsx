import React from 'react';
import {
  X,
  FileText,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Satellite
} from 'lucide-react';
import { ReservoirHealthResponse, SimulationParameters } from '../types';
import { api } from '../services/api';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthData: ReservoirHealthResponse | null;
  simParams?: SimulationParameters;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  healthData,
  simParams
}) => {
  if (!isOpen || !healthData) return null;

  const pdfUrl = api.getExportPdfUrl(healthData.reservoir.id, simParams);
  const csvUrl = api.getExportCsvUrl(healthData.reservoir.id, simParams);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-obsidian-900 border border-obsidian-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-obsidian-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Export Environmental Assessment Report
              </h2>
              <p className="text-xs text-slate-400">
                Official documentation for municipal water engineers & environmental agencies
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
        <div className="p-6 space-y-4">
          <div className="bg-obsidian-950/60 p-3.5 rounded-xl border border-obsidian-800 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Reservoir:</span>
              <strong className="text-slate-200">{healthData.reservoir.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Observation Source:</span>
              <span className="text-slate-200">{healthData.satellite_source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Alert Classification:</span>
              <span className="font-bold text-emerald-400">{healthData.metrics.alert_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-200 font-mono">{healthData.timestamp}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* PDF Option */}
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-800 border border-obsidian-700/70 hover:border-emerald-500/50 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                  Executive PDF Report
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Publication-ready formal summary with tables, chemical dosage guidelines, and HAB risk dials.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-obsidian-800">
                <span>Download PDF</span>
                <Download className="w-4 h-4" />
              </div>
            </a>

            {/* CSV Option */}
            <a
              href={csvUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-800 border border-obsidian-700/70 hover:border-teal-500/50 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-teal-300">
                  Raw CSV Telemetry
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Tabular dataset containing all multi-spectral indices, GIS coordinates, and physical parameters.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-teal-400 pt-2 border-t border-obsidian-800">
                <span>Download CSV</span>
                <Download className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-obsidian-800 bg-obsidian-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
