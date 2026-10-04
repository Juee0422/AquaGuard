import React from 'react';
import { Binary, Satellite, Info, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
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
      description:
        'Subtracts the linear baseline between Red and SWIR to isolate the steep NIR reflectance peak of floating cyanobacterial scum. Unlike terrestrial NDVI, FAI is immune to aerosol variation, thin cirrus clouds, and ocean/lake sun-glint.',
      color: 'text-teal-300 border-teal-500/40 bg-teal-500/10',
      badge: 'Gold Standard for Lake HAB'
    },
    {
      name: 'Normalized Difference Water Index',
      code: 'NDWI',
      formula: '(B3 - B8) / (B3 + B8)',
      value: indices.ndwi,
      bands: 'B3 (Green 560nm), B8 (NIR 842nm)',
      description:
        'Delineates open water bodies with threshold > 0.10. High green reflectance combined with almost total NIR absorption by pure water cleanly separates reservoir shorelines from surrounding Western Ghats forest canopy.',
      color: 'text-sky-300 border-sky-500/40 bg-sky-500/10',
      badge: 'Water Boundary Mask'
    },
    {
      name: 'Normalized Difference Vegetation Index',
      code: 'NDVI',
      formula: '(B8 - B4) / (B8 + B4)',
      value: indices.ndvi,
      bands: 'B8 (NIR 842nm), B4 (Red 665nm)',
      description:
        'Quantifies chlorophyll absorption in the red spectrum relative to NIR scattering. High positive values indicate dense surface duckweed, water hyacinth, or mature surface algal mats.',
      color: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
      badge: 'Vegetative Mat Density'
    },
    {
      name: 'Normalized Difference Turbidity Index',
      code: 'NDTI',
      formula: '(B4 - B3) / (B4 + B3)',
      value: indices.ndti,
      bands: 'B4 (Red 665nm), B3 (Green 560nm)',
      description:
        'Optical proxy for suspended inorganic sediment, silt runoff from post-monsoon river tributaries, and total particulate scatter in the water column.',
      color: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      badge: 'Sediment & Silt Proxy'
    },
  ];

  return (
    <div id="spectral-science" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sentinel-2 Multi-Spectral Physics & Band Math
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bio-optical radiative transfer equations computed on Copernicus Level-2A bottom-of-atmosphere surface reflectance
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-obsidian-900 px-3 py-1.5 rounded-xl border border-obsidian-800">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>Copernicus MSI Wavelengths</span>
        </div>
      </div>

      {/* Spacious 2-column on md / 4-column on xl with generous padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {indexCards.map((card, i) => (
          <div
            key={i}
            className="bg-obsidian-900/80 border border-obsidian-700/70 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-obsidian-600 transition-all hover:shadow-lg"
          >
            <div>
              {/* Card Top: Code & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-white tracking-wide">{card.code}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-obsidian-800 text-slate-300 border border-obsidian-700">
                  {card.badge}
                </span>
              </div>

              {/* Full Name */}
              <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3">
                {card.name}
              </h3>

              {/* Current Value Display */}
              <div className="flex items-baseline space-x-2 mb-3">
                <span className={`text-2xl font-black font-mono px-3 py-1 rounded-xl border ${card.color}`}>
                  {card.value.toFixed(4)}
                </span>
                <span className="text-xs text-slate-400">active value</span>
              </div>

              {/* Formula Block */}
              <div className="bg-obsidian-950 px-3.5 py-2.5 rounded-xl border border-obsidian-800 font-mono text-xs text-teal-300 mb-3 overflow-x-auto shadow-inner">
                {card.formula}
              </div>

              {/* Explanation Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {card.description}
              </p>
            </div>

            {/* Bands Used Footer */}
            <div className="pt-3 border-t border-obsidian-800/90 text-[11px] text-slate-500 font-mono">
              <strong className="text-slate-400">Bands:</strong> {card.bands}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
