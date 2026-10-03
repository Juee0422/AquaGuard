import React, { useEffect, useState } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Polygon,
  Popup,
  useMap,
  GeoJSON
} from 'react-leaflet';
import L from 'leaflet';
import { Layers, Globe, Eye, Maximize2, ShieldAlert } from 'lucide-react';
import { ReservoirInfo, SpatialZoneFeature } from '../types';

interface MapContainerProps {
  reservoir: ReservoirInfo;
  spatialZones: SpatialZoneFeature[];
  alertLevel: 'SAFE' | 'MODERATE' | 'CRITICAL';
}

// Helper component to center and zoom map when reservoir changes
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
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-obsidian-700/60 bg-obsidian-900 shadow-glass flex flex-col h-[480px]">
      {/* Map Control Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center space-x-2 bg-obsidian-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-obsidian-700/70 shadow-lg">
        <Globe className="w-3.5 h-3.5 text-emeraldWater-400" />
        <span className="text-xs font-bold text-slate-200">{reservoir.name}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          ({reservoir.lat.toFixed(4)}°N, {reservoir.lng.toFixed(4)}°E)
        </span>
      </div>

      {/* Basemap Switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center bg-obsidian-950/85 backdrop-blur-md rounded-xl p-1 border border-obsidian-700/70 shadow-lg space-x-1">
        <button
          onClick={() => setBaseLayer('dark')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            baseLayer === 'dark'
              ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Obsidian GIS
        </button>
        <button
          onClick={() => setBaseLayer('satellite')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            baseLayer === 'satellite'
              ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Copernicus Sat
        </button>
        <button
          onClick={() => setBaseLayer('street')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            baseLayer === 'street'
              ? 'bg-emeraldWater-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Topo / Streets
        </button>
      </div>

      {/* Leaflet Map */}
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
          // Convert GeoJSON coords to [lat, lng] format for Leaflet
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
                weight: isCritical ? 2.5 : 1.5,
                dashArray: isCritical ? '4, 4' : undefined
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[200px] text-slate-900">
                  <div className="font-bold text-xs border-b pb-1 mb-1.5 flex items-center justify-between">
                    <span>{zone.zone_name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isCritical
                          ? 'bg-red-100 text-red-700'
                          : isModerate
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {zone.risk_level}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Floating Algae (FAI):</span>
                      <strong className="font-mono">{zone.fai.toFixed(4)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chlorophyll-a:</span>
                      <strong className="font-mono">{zone.chlorophyll_a} µg/L</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Turbidity:</span>
                      <strong className="font-mono">{zone.turbidity} FNU</strong>
                    </div>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </LeafletMap>

      {/* Floating Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-obsidian-950/90 backdrop-blur-md p-2.5 rounded-xl border border-obsidian-700/70 shadow-lg text-[11px] text-slate-300 space-y-1.5">
        <div className="font-semibold text-slate-200 flex items-center space-x-1.5 pb-1 border-b border-obsidian-800">
          <Layers className="w-3.5 h-3.5 text-tealCyan-400" />
          <span>Multi-Spectral FAI Heatmap Legend</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-emerald-500 shadow-sm" />
          <span>Safe Water (FAI &lt; 0.015)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-amber-500 shadow-sm" />
          <span>Moderate Biomass (0.015 - 0.035)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-red-500 animate-pulse shadow-sm" />
          <span>Critical Bloom Alert (FAI &gt; 0.035)</span>
        </div>
      </div>
    </div>
  );
};
