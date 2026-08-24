'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function OutbreakMap({
  outbreaks = [],
  center = [30.9010, 75.8573], // Ludhiana, Punjab
  zoom = 8,
  selectedRadiusKm = 25,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[550px] rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-agri-orange border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-mono text-agri-orange">RENDERING GEOSPATIAL POSTGIS RADAR...</p>
      </div>
    );
  }

  const getMarkerColor = (severity) => {
    if (severity >= 75) return '#F43F5E'; // Critical Rose
    if (severity >= 50) return '#FF6B00'; // High Orange
    if (severity >= 25) return '#F59E0B'; // Moderate Amber
    return '#10B981'; // Low Green
  };

  return (
    <div className="w-full h-[550px] rounded-2xl overflow-hidden border border-agri-orange/30 shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* CartoDB Dark Matter Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Current Farm Center Pin & Radius Perimeter Ring */}
        <CircleMarker
          center={center}
          radius={9}
          pathOptions={{
            color: '#FFFFFF',
            fillColor: '#FF6B00',
            fillOpacity: 1.0,
            weight: 2,
          }}
        >
          <Popup>
            <div className="p-2 text-neutral-900">
              <strong className="block text-xs font-bold text-orange-600">🌾 Monitored Farm (Ludhiana)</strong>
              <p className="text-[11px] text-gray-600">Your registered farm coordinates</p>
            </div>
          </Popup>
        </CircleMarker>

        {/* Active C++ Alert Radius Ring */}
        <Circle
          center={center}
          radius={selectedRadiusKm * 1000}
          pathOptions={{
            color: '#FF6B00',
            fillColor: '#FF6B00',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '6, 6',
          }}
        />

        {/* Outbreak Incident Markers */}
        {outbreaks.map((ob) => {
          const color = getMarkerColor(ob.severity_percent);
          return (
            <CircleMarker
              key={ob.id}
              center={[ob.latitude, ob.longitude]}
              radius={Math.max(6, Math.min(18, ob.severity_percent / 4))}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.65,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="p-2 text-neutral-900 space-y-1 font-sans">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-xs" style={{ color: color }}>
                      {ob.crop} • {ob.disease}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 font-medium">
                    District: {ob.district}, {ob.state}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Severity: <strong>{ob.severity_percent}%</strong> | AI Confidence: <strong>{ob.confidence}%</strong>
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Status: <strong className="text-red-600">{ob.status}</strong>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-xl border border-white/10 text-xs text-white z-20 pointer-events-auto space-y-1.5 backdrop-blur-md">
        <span className="font-bold font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
          Epidemic Risk Index
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px]">Low (&lt;25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-[11px]">Moderate (25-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-agri-orange" />
          <span className="text-[11px]">High (50-75%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-[11px]">Critical (&gt;75%)</span>
        </div>
      </div>
    </div>
  );
}
