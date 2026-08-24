'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HealthGauge({ score = 87, size = 180 }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10B981'; // Green
  let label = 'EXCELLENT';
  let glow = 'rgba(16, 185, 129, 0.4)';

  if (score < 40) {
    color = '#EF4444'; // Red
    label = 'CRITICAL ATTENTION';
    glow = 'rgba(239, 68, 68, 0.4)';
  } else if (score < 70) {
    color = '#FF6B00'; // Orange
    label = 'MODERATE STRESS';
    glow = 'rgba(255, 107, 0, 0.4)';
  } else if (score < 85) {
    color = '#F59E0B'; // Amber
    label = 'FAVORABLE / GOOD';
    glow = 'rgba(245, 158, 11, 0.4)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Gauge Arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold font-mono text-white tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">/ 100 SCORE</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider"
          style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}40`,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
