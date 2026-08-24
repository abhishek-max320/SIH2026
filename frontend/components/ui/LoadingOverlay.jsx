'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';
import { SCAN_STAGES } from '../../utils/constants';

export default function LoadingOverlay({
  currentStep = 1,
  progress = 0,
  stageTitle = 'Analyzing Crop Specimen...',
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-glow rounded-3xl p-8 max-w-lg w-full border border-agri-orange/40 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Top Glowing AI Node */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-agri-orange to-agri-amber flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,107,0,0.5)]">
          <Cpu className="w-8 h-8 text-black animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-wide mb-1">
          AI Pipeline Active
        </h3>
        <p className="text-xs text-agri-orange font-mono mb-6">{stageTitle}</p>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-900 rounded-full h-2.5 p-0.5 border border-white/10 mb-6 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-agri-orange to-agri-amber h-full rounded-full shadow-[0_0_12px_#FF6B00]"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>

        {/* Step Breakdown */}
        <div className="space-y-2 text-left max-h-48 overflow-y-auto pr-2">
          {SCAN_STAGES.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;

            return (
              <div
                key={s.step}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                  isCurrent
                    ? 'bg-agri-orange/15 border border-agri-orange/40 text-white'
                    : isDone
                    ? 'bg-white/5 text-neutral-400'
                    : 'text-neutral-600'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-agri-orange animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500 shrink-0">
                      {s.step}
                    </span>
                  )}
                  <span className="truncate">{s.label}</span>
                </div>

                {isCurrent && (
                  <span className="font-mono text-[10px] text-agri-orange shrink-0">
                    PROCESSING
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
