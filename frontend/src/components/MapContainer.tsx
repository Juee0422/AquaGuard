import React, { useEffect, useState } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Polygon,
  Popup,
  useMap
} from 'react-leaflet';
import { Layers, Globe, Eye, Maximize2, ShieldAlert, MapPin, Info } from 'lucide-react';
import { ReservoirInfo, SpatialZoneFeature } from '../types';

interface MapContainerProps {
  reservoir: ReservoirInfo;
  spatialZones: SpatialZoneFeature[];
  alertLevel: 'SAFE' | 'MODERATE' | 'CRITICAL';
}

const MapViewController: React.FC<{ lat: number; lng: number; zoom: number }> = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
};

export const MapContainer: React.FC<MapContainerProps> = ({
  reservoir,
  spatialZones,
  alertLevel
}) => {
  const [baseLayer, setBaseLayer] = useState<'dark' | 'satellite' | 'street'>('dark');

  const tileLayers = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Sentinel-2 MSI Optical Base'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  };

  return (
    <div id="gis-map" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Sentinel-2 GIS Mapping & Zoned Risk Heatmap
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            High-resolution spatial delineation of catchment inlets, pelagic central waters, and dam intake facilities
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-obsidian-900 px-3 py-1.5 rounded-xl border border-obsidian-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {reservoir.name}: <strong>{reservoir.lat.toFixed(4)}°N, {reservoir.lng.toFixed(4)}°E</strong>
          </span>
        </div>
      </div>

      {/* Main Spacious Map Box */}
      <div className="relative rounded-3xl overflow-hidden border border-obsidian-700/70 bg-obsidian-900 shadow-glass flex flex-col h-[560px] sm:h-[620px]">
        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center space-x-3 bg-obsidian-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-obsidian-700/80 shadow-xl">
          <Globe className="w-4 h-4 text-emeraldWater-400" />
          <div>
            <div className="text-xs font-bold text-white">{reservoir.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Surface Area: {reservoir.surface_area_sqkm} km² • {reservoir.district}
            </div>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="absolute top-4 right-4 z-[1000] flex items-center bg-obsidian-950/90 backdrop-blur-md rounded-2xl p-1.5 border border-obsidian-700/80 shadow-xl space-x-1.5">
          <button
            onClick={() => setBaseLayer('dark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              baseLayer === 'dark'
                ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Obsidian GIS
          </button>
          <button
            onClick={() => setBaseLayer('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              baseLayer === 'satellite'
                ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Copernicus Sat
          </button>
          <button
            onClick={() => setBaseLayer('street')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              baseLayer === 'street'
                ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Topo & Streams
          </button>
        </div>

        {/* Leaflet Map Canvas */}
        <LeafletMap
          center={[reservoir.lat, reservoir.lng]}
          zoom={reservoir.zoom}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <MapViewController lat={reservoir.lat} lng={reservoir.lng} zoom={reservoir.zoom} />
          <TileLayer
            url={tileLayers[baseLayer].url}
            attribution={tileLayers[baseLayer].attribution}
          />

          {/* Spatial Risk Sub-Zones */}
          {spatialZones.map((zone) => {
            const coords = zone.geojson.coordinates[0].map(
              (c: [number, number]) => [c[1], c[0]] as [number, number]
            );

            const isCritical = zone.risk_level === 'CRITICAL';
            const isModerate = zone.risk_level === 'MODERATE';

            return (
              <Polygon
                key={zone.zone_id}
                positions={coords}
                pathOptions={{
                  color: zone.color_hex,
                  fillColor: zone.color_hex,
                  fillOpacity: isCritical ? 0.65 : isModerate ? 0.45 : 0.3,
                  weight: isCritical ? 3.0 : 1.8,
                  dashArray: isCritical ? '6, 6' : undefined
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 min-w-[220px] text-slate-900">
                    <div className="font-bold text-xs border-b pb-1.5 mb-2 flex items-center justify-between">
                      <span className="text-slate-900">{zone.zone_name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          isCritical
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : isModerate
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        }`}
                      >
                        {zone.risk_level}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Floating Algae (FAI):</span>
                        <strong className="font-mono text-slate-900">{zone.fai.toFixed(4)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Chlorophyll-a:</span>
                        <strong className="font-mono text-slate-900">{zone.chlorophyll_a} µg/L</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Turbidity (NDTI):</span>
                        <strong className="font-mono text-slate-900">{zone.turbidity} FNU</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </LeafletMap>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-obsidian-950/95 backdrop-blur-md p-4 rounded-2xl border border-obsidian-700/80 shadow-2xl text-xs text-slate-300 space-y-2.5 max-w-xs">
          <div className="font-bold text-white flex items-center space-x-2 pb-1.5 border-b border-obsidian-800">
            <Layers className="w-4 h-4 text-tealCyan-400" />
            <span>Spectral Risk Classification</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Safe Baseline (FAI &lt; 0.015)</div>
              <div className="text-[10px] text-slate-400">Clear photic zone, low cyanobacteria density</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Moderate Mat (0.015 - 0.035)</div>
              <div className="text-[10px] text-slate-400">Sub-surface buildup; optimize coagulation</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shadow-sm flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Critical Bloom (FAI &gt; 0.035)</div>
              <div className="text-[10px] text-slate-400">Microcystin risk; emergency depth intake gate active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
