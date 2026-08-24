'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-gradient-to-r from-agri-orange to-agri-amber hover:from-agri-orange-glow hover:to-amber-400 text-black font-semibold shadow-lg shadow-agri-orange/20 hover:shadow-agri-orange/40 hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-neutral-800/80 hover:bg-neutral-700 text-white border border-white/10 hover:border-white/20 active:scale-[0.98]',
  outline: 'bg-transparent text-agri-orange border border-agri-orange/50 hover:bg-agri-orange/10 hover:border-agri-orange active:scale-[0.98]',
  ghost: 'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5 active:scale-[0.98]',
  danger: 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 active:scale-[0.98]',
  glow: 'bg-agri-orange text-black font-bold shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:shadow-[0_0_30px_rgba(255,107,0,0.8)] hover:scale-[1.02] active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5 font-semibold',
  icon: 'p-2 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
