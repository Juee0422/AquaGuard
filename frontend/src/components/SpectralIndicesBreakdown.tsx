import React from 'react';
import { Cpu, HelpCircle, Sparkles, Binary } from 'lucide-react';
import { SpectralIndices } from '../types';

interface SpectralIndicesBreakdownProps {
  indices: SpectralIndices;
}

export const SpectralIndicesBreakdown: React.FC<SpectralIndicesBreakdownProps> = ({ indices }) => {
  const indexCards = [
    {
      name: 'Floating Algae Index (FAI)',
      code: 'FAI',
      formula: 'B8 - [B4 + (B11 - B4) × ((842 - 665) / (1610 - 665))]',
      value: indices.fai,
      bands: 'B8 (NIR 842nm), B4 (Red 665nm), B11 (SWIR 1610nm)',
      description: 'Subtracts the linear baseline between Red and SWIR to isolate NIR reflectance peak of floating algal mats, unaffected by thin clouds or sun-glint.',
      color: 'text-teal-400 border-teal-500/40 bg-teal-500/10'
    },
    {
      name: 'Normalized Difference Water Index',
      code: 'NDWI',
      formula: '(B3 - B8) / (B3 + B8)',
      value: indices.ndwi,
      bands: 'B3 (Green 560nm), B8 (NIR 842nm)',
      description: 'Delineates open water bodies with threshold > 0.10. High green reflectance and total NIR absorption separates reservoir surface from surrounding terrestrial forest.',
      color: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
    },
    {
      name: 'Normalized Difference Vegetation Index',
      code: 'NDVI',
      formula: '(B8 - B4) / (B8 + B4)',
      value: indices.ndvi,
      bands: 'B8 (NIR 842nm), B4 (Red 665nm)',
      description: 'Quantifies chlorophyll absorption in the red spectrum relative to NIR scattering. High positive values indicate dense surface duckweed or algal blooms.',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      name: 'Normalized Difference Turbidity Index',
      code: 'NDTI',
      formula: '(B4 - B3) / (B4 + B3)',
      value: indices.ndti,
      bands: 'B4 (Red 665nm), B3 (Green 560nm)',
      description: 'Proxy for suspended particulate matter, post-monsoon silt runoff, and water column cloudiness.',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
  ];

  return (
    <div className="bg-obsidian-900/80 border border-obsidian-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Binary className="w-4 h-4 text-tealCyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Sentinel-2 MSI Multi-Spectral Band Math & Radiative Transfer
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-obsidian-950 px-2 py-1 rounded border border-obsidian-800">
          ESA Copernicus L2A Surface Reflectance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {indexCards.map((card, i) => (
          <div
            key={i}
            className="bg-obsidian-950/70 border border-obsidian-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-obsidian-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200">{card.code}</span>
                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded border ${card.color}`}>
                  {card.value.toFixed(4)}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-300 mb-2 truncate">
                {card.name}
              </div>

              <div className="bg-obsidian-900 px-2.5 py-1.5 rounded-lg border border-obsidian-800 font-mono text-[10px] text-teal-300 mb-2 overflow-x-auto">
                {card.formula}
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                {card.description}
              </p>
            </div>

            <div className="pt-2 border-t border-obsidian-800/80 text-[9px] text-slate-500 font-mono">
              Bands: {card.bands}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
