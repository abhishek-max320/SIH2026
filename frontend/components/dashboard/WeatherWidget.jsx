'use client';

import React from 'react';
import { Thermometer, Droplets, CloudRain, Wind, AlertCircle, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';

export default function WeatherWidget({ weather }) {
  const data = weather || {
    temperature: 24.5,
    humidity: 78.0,
    precipitation_mm: 0.0,
    wind_speed_kmh: 12.0,
    disease_favorability_index: 72.0,
    disease_risk_category: 'MODERATE',
    dew_risk: 'Moderate Condensation',
    summary: 'Warm daytime with elevated relative humidity favorable for spore dispersal.',
  };

  const isHighFav = data.disease_favorability_index >= 70;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
      {/* Background soft glow if critical */}
      {isHighFav && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-agri-orange/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Local Microclimate</span>
            <span className="text-[10px] font-mono text-neutral-400">Ludhiana, Punjab</span>
          </div>
          <Badge
            variant={isHighFav ? 'orange' : 'emerald'}
            size="sm"
            dot={true}
          >
            {data.disease_risk_category} SPORE RISK
          </Badge>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-1.5 text-neutral-400 text-xs mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temp</span>
            </div>
            <p className="text-base font-extrabold font-mono text-white">{data.temperature}°C</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-1.5 text-neutral-400 text-xs mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity</span>
            </div>
            <p className="text-base font-extrabold font-mono text-white">{data.humidity}%</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-1.5 text-neutral-400 text-xs mb-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>Rainfall</span>
            </div>
            <p className="text-base font-extrabold font-mono text-white">{data.precipitation_mm} mm</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-1.5 text-neutral-400 text-xs mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wind</span>
            </div>
            <p className="text-base font-extrabold font-mono text-white">{data.wind_speed_kmh} km/h</p>
          </div>
        </div>
      </div>

      {/* Disease Favorability Summary */}
      <div className="p-3 rounded-xl bg-agri-orange/10 border border-agri-orange/20 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-agri-orange font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Disease Transmission Index:
          </span>
          <span className="font-mono font-bold text-agri-orange">{data.disease_favorability_index}%</span>
        </div>
        <p className="text-neutral-300 text-[11px] leading-relaxed">{data.summary}</p>
      </div>
    </div>
  );
}
