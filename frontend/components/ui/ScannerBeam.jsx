'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScannerBeam({ active = true, color = '#FF6B00' }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
      {/* Moving Laser Beam */}
      <motion.div
        animate={{
          top: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-0 right-0 h-1.5 shadow-[0_0_20px_#FF6B00,0_0_35px_#FF6B00]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        }}
      >
        {/* Soft Glow Trail */}
        <div
          className="absolute -top-12 left-0 right-0 h-12 opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color} 100%)`,
          }}
        />
      </motion.div>

      {/* Futuristic Corner Reticles */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-agri-orange" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-agri-orange" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-agri-orange" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-agri-orange" />
    </div>
  );
}
