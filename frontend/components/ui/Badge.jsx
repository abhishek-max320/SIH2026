'use client';

import React from 'react';

const variants = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  orange: 'bg-agri-orange/10 text-agri-orange border-agri-orange/30 shadow-[0_0_10px_rgba(255,107,0,0.15)]',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
  blue: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  neutral: 'bg-neutral-800 text-neutral-300 border-white/10',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3.5 py-1.5 text-sm font-semibold',
};

export default function Badge({
  children,
  variant = 'orange',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${variants[variant] || variants.orange} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'emerald'
              ? 'bg-emerald-400 animate-pulse'
              : variant === 'rose'
              ? 'bg-rose-400 animate-pulse'
              : variant === 'orange'
              ? 'bg-agri-orange animate-pulse'
              : 'bg-current'
          }`}
        />
      )}
      {children}
    </span>
  );
}
