'use client';

import React from 'react';

export function Card({
  children,
  className = '',
  glow = false,
  subtle = false,
  hover = false,
  ...props
}) {
  const baseStyle = subtle
    ? 'glass-panel-subtle'
    : glow
    ? 'glass-panel-glow'
    : 'glass-panel';

  const hoverStyle = hover
    ? 'hover:border-agri-orange/40 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-2xl p-6 relative overflow-hidden ${baseStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-agri-orange/10 border border-agri-orange/20 flex items-center justify-center text-agri-orange shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white text-base tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 ${className}`}>
      {children}
    </div>
  );
}
