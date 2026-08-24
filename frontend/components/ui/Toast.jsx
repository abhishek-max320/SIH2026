'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-agri-amber shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
};

const toastBorders = {
  success: 'border-emerald-500/40 bg-emerald-950/40',
  warning: 'border-amber-500/40 bg-amber-950/40',
  error: 'border-rose-500/40 bg-rose-950/40',
  info: 'border-sky-500/40 bg-sky-950/40',
};

export default function ToastItem({ id, type = 'info', title, message, onClose }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`glass-panel p-4 rounded-xl border flex items-start gap-3 w-80 sm:w-96 shadow-2xl backdrop-blur-xl ${toastBorders[type] || toastBorders.info}`}
    >
      {toastIcons[type] || toastIcons.info}
      
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold text-white truncate">{title}</h4>}
        {message && <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{message}</p>}
      </div>

      <button
        onClick={() => onClose(id)}
        className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
