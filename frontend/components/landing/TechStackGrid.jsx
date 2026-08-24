'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CloudSun, Compass, Cpu, CheckCheck, LineChart } from 'lucide-react';

const technologies = [
  {
    icon: Eye,
    title: 'Computer Vision & Deep CNN',
    desc: 'Deep learning classifiers with OpenCV preprocessing and Grad-CAM activation mapping for explainable diagnosis.',
    tags: ['PyTorch', 'OpenCV', 'Grad-CAM'],
    color: 'text-agri-orange',
  },
  {
    icon: Cpu,
    title: 'C++17 High-Performance Engine',
    desc: 'Sub-millisecond native spatial indexing, multi-ring cluster aggregation (1-25km), and weighted epidemiological risk scoring.',
    tags: ['C++17', 'Haversine', 'ctypes Native Bridge'],
    color: 'text-amber-400',
  },
  {
    icon: CloudSun,
    title: 'Microclimate Weather Intelligence',
    desc: 'Real-time temperature, humidity, and rainfall analysis via Open-Meteo to model disease transmission favorability.',
    tags: ['Open-Meteo', 'Dew Point Index', 'Forecast'],
    color: 'text-sky-400',
  },
  {
    icon: Compass,
    title: 'Geospatial Outbreak Radar',
    desc: 'Interactive Leaflet epidemiology maps visualizing disease hotspots, vector trajectories, and high-risk districts.',
    tags: ['Leaflet', 'PostGIS', 'Spatial Clustering'],
    color: 'text-emerald-400',
  },
  {
    icon: CheckCheck,
    title: 'Verified Agronomic Protocol',
    desc: 'Curated agricultural management guidance with approved biological, cultural, and chemical controls and safety precautions.',
    tags: ['ICAR / Verified', 'Safety Alerts', 'HITL Verification'],
    color: 'text-rose-400',
  },
  {
    icon: LineChart,
    title: 'Government Surveillance Portal',
    desc: 'District-level epidemic trends, top vulnerable crops, and outbreak forecasting dashboards for agricultural authorities.',
    tags: ['Recharts', 'Surveillance KPIs', 'Audit Logs'],
    color: 'text-purple-400',
  },
];

export default function TechStackGrid() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono text-agri-orange uppercase tracking-widest px-3 py-1 rounded-full bg-agri-orange/10 border border-agri-orange/30">
          CORE INNOVATIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
          Engineered for Smart India Hackathon 2026
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          A hybrid multi-tier stack intentionally leveraging Python, C++, Next.js, and PostGIS for speed, accuracy, and scalability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-agri-orange/40 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${tech.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">{tech.title}</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{tech.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-white/5">
                {tech.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
