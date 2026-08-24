'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Search, BarChart3, Radio, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'SCAN',
    subtitle: 'High-Res Specimen Capture',
    desc: 'Capture or drop leaf specimen. Automated OpenCV QC evaluates illumination, blur, and focus clarity.',
    icon: Camera,
    color: 'text-agri-orange',
    border: 'border-agri-orange/30',
  },
  {
    step: '02',
    title: 'DETECT',
    subtitle: 'Dual AI Inference',
    desc: 'Deep CNN classifies crop pathogens while YOLO isolates insect pests with precise bounding boxes.',
    icon: Search,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    step: '03',
    title: 'ANALYZE',
    subtitle: 'Severity & Grad-CAM',
    desc: 'Calculates affected leaf area % (Mild to Critical) and highlights symptomatic tissue via Grad-CAM.',
    icon: BarChart3,
    color: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  {
    step: '04',
    title: 'PREDICT',
    subtitle: 'C++ Spatial Risk Engine',
    desc: 'Combines microclimate weather with C++ Haversine spatial outbreak clusters to compute 0-100 risk.',
    icon: Radio,
    color: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  {
    step: '05',
    title: 'PROTECT',
    subtitle: 'Verified Action & Early Alert',
    desc: 'Dispatches verified agronomic treatment protocols and alerts susceptible farms within a 25 km radius.',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono text-agri-orange uppercase tracking-widest px-3 py-1 rounded-full bg-agri-orange/10 border border-agri-orange/30">
          SURVEILLANCE LIFECYCLE
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
          How AgriSentinel AI Operates
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          From single-leaf symptom detection to government-level epidemiological containment in 5 synchronized phases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`glass-panel p-6 rounded-2xl border ${item.border} flex flex-col justify-between relative group hover:shadow-[0_0_25px_rgba(255,107,0,0.15)] transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-neutral-500">{item.step}</span>
                  <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base tracking-wider">{item.title}</h3>
                <p className={`text-xs font-semibold ${item.color} mt-0.5`}>{item.subtitle}</p>
                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">{item.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-neutral-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
