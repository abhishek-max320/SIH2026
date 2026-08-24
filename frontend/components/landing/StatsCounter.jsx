'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bug, Target, Activity } from 'lucide-react';

const stats = [
  {
    icon: ShieldAlert,
    value: '25+',
    label: 'Crop Diseases Supported',
    desc: 'Wheat, Rice, Tomato, Potato, Maize',
    color: 'text-agri-orange',
    border: 'border-agri-orange/30',
  },
  {
    icon: Bug,
    value: '15+',
    label: 'Pest Categories',
    desc: 'Real-time YOLO Bounding Box Detection',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    icon: Target,
    value: '94.7%',
    label: 'AI Diagnostic Confidence',
    desc: 'Multi-layer CNN + Explainable Grad-CAM',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  {
    icon: Activity,
    value: '24×7',
    label: 'Regional Surveillance',
    desc: 'C++ Spatial Outbreak Early Warning',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
  },
];

export default function StatsCounter() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`glass-panel p-6 rounded-2xl border ${item.border} hover:border-agri-orange/50 transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">SIH Prototype</span>
              </div>
              <h3 className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${item.color}`}>
                {item.value}
              </h3>
              <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
