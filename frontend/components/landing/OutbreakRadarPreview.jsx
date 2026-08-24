'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, AlertTriangle, ShieldCheck, MapPin, Wind, Droplets, Thermometer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';

export default function OutbreakRadarPreview() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');

  const demoScenarios = {
    wheat: {
      disease: 'Wheat Leaf Rust (Puccinia triticina)',
      riskScore: 82,
      riskLevel: 'HIGH RISK',
      nearbyReports: 14,
      closestDist: '3.8 km',
      temp: '24°C (Favorable)',
      humidity: '84% (Critical)',
      recommendation: 'Inspect flag leaf immediately. Prepare prophylactic triazole fungicide spray if weather persists.',
    },
    rice: {
      disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
      riskScore: 68,
      riskLevel: 'HIGH RISK',
      nearbyReports: 8,
      closestDist: '6.2 km',
      temp: '29°C (Optimum)',
      humidity: '88% (High)',
      recommendation: 'Drain standing water if field flooded. Avoid excessive nitrogen fertilizer application.',
    },
    tomato: {
      disease: 'Early Blight (Alternaria solani)',
      riskScore: 45,
      riskLevel: 'MODERATE RISK',
      nearbyReports: 3,
      closestDist: '11.5 km',
      temp: '22°C (Moderate)',
      humidity: '65% (Normal)',
      recommendation: 'Ensure bottom leaves do not touch soil mulch. Monitor for concentric target-like spots.',
    },
  };

  const current = demoScenarios[selectedCrop] || demoScenarios.wheat;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-agri-orange/30 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-agri-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-agri-orange/15 border border-agri-orange/30 text-agri-orange text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE OUTBREAK RADAR SIMULATOR</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Instant Early Warning Before Pathogens Spread to Your Field.
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              When a nearby farmer detects an infection, our native C++ engine computes spatial proximity, evaluates real-time humidity and wind vectors, and automatically alerts susceptible farmers within minutes.
            </p>

            {/* Crop Select Pills */}
            <div className="flex items-center gap-2 pt-2">
              {['wheat', 'rice', 'tomato'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    selectedCrop === crop
                      ? 'bg-agri-orange text-black font-bold shadow-[0_0_15px_rgba(255,107,0,0.5)]'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/scan">
                <Button size="md" variant="primary" icon={ArrowRight}>
                  Run Live Farm Scan
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Simulated Alert Card */}
          <div className="lg:col-span-6">
            <motion.div
              key={selectedCrop}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-2xl p-6 border border-agri-orange/40 shadow-2xl bg-black/60"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                      {current.riskLevel} ALERT
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">{current.disease}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-mono font-extrabold text-agri-orange">
                    {current.riskScore}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 block">/100 RISK</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-agri-orange" />
                    <span>Nearest</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mt-1">{current.closestDist}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-amber-400" />
                    <span>Cluster</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mt-1">{current.nearbyReports} cases</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-sky-400" />
                    <span>Temp</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mt-1">{current.temp.split(' ')[0]}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>Humidity</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mt-1">{current.humidity.split(' ')[0]}</p>
                </div>
              </div>

              {/* Verified Action */}
              <div className="p-3.5 rounded-xl bg-agri-orange/10 border border-agri-orange/20">
                <p className="text-[11px] font-mono text-agri-orange font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RECOMMENDED PREVENTIVE PROTOCOL:</span>
                </p>
                <p className="text-xs text-neutral-200 leading-relaxed">{current.recommendation}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
