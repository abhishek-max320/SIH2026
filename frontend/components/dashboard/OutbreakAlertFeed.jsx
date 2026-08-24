'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Radio, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OutbreakAlertFeed({ alerts = [] }) {
  const defaultAlerts = alerts.length > 0 ? alerts : [
    {
      id: 1,
      title: '🚨 Nearby Wheat Leaf Rust Outbreak',
      message: 'Active Puccinia rust cluster detected 3.8 km away. Current relative humidity (84%) creates high sporulation risk.',
      severity: 'HIGH',
      distance_km: 3.8,
      disease_name: 'Wheat Leaf Rust',
      created_at: '2 hours ago',
    },
    {
      id: 2,
      title: '🌦️ Microclimate Disease Risk Warning',
      message: 'Dew point elevation expected over next 48h. Prophylactic bio-spray recommended.',
      severity: 'MODERATE',
      distance_km: 0.0,
      disease_name: 'Weather Vector',
      created_at: '5 hours ago',
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-agri-orange animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nearby Outbreak Radar</h3>
          </div>
          <span className="text-[10px] font-mono text-agri-orange">C++ RADIUS ACTIVE</span>
        </div>

        <div className="space-y-3">
          {defaultAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                alert.severity === 'HIGH'
                  ? 'bg-rose-950/30 border-rose-500/40 hover:border-rose-500'
                  : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white leading-tight">{alert.title}</h4>
                {alert.distance_km > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono text-rose-400 border border-rose-500/30 shrink-0">
                    {alert.distance_km} km
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <Link href="/map" className="text-xs text-agri-orange hover:text-agri-orange-glow font-medium flex items-center gap-1">
          <span>View Full Surveillance Heatmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
