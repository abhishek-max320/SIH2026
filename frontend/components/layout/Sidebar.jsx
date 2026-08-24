'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scan,
  MapPin,
  Building2,
  FileCheck2,
  Settings,
  Bell,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems = [
    { href: '/dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard, role: ['farmer', 'admin'] },
    { href: '/scan', label: 'AI Crop Scanner', icon: Scan, role: ['farmer', 'expert', 'admin'] },
    { href: '/map', label: 'Outbreak Intelligence', icon: MapPin, role: ['farmer', 'officer', 'expert', 'admin'] },
    { href: '/government', label: 'Government Surveillance', icon: Building2, role: ['officer', 'admin'] },
    { href: '/expert', label: 'Expert Verification', icon: FileCheck2, role: ['expert', 'admin'] },
    { href: '/alerts', label: 'Alerts & Warnings', icon: Bell, role: ['farmer', 'officer', 'expert', 'admin'] },
    { href: '/admin', label: 'Model Registry & Health', icon: Settings, role: ['admin'] },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-white/10 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-4rem)]`}
      >
        <div>
          {/* Header on mobile */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 lg:hidden">
            <span className="font-bold text-sm text-white">Navigation</span>
            <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Persona Profile Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-agri-orange/20 border border-agri-orange/30 flex items-center justify-center text-agri-orange font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Farmer Rajesh Kumar'}</p>
                <p className="text-[10px] text-agri-orange font-mono uppercase tracking-wider">{user?.role || 'Farmer'}</p>
              </div>
            </div>
            {user?.location && (
              <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                <span className="truncate">{user.location}</span>
              </p>
            )}
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-agri-orange/15 text-agri-orange border border-agri-orange/30 font-semibold shadow-[0_0_12px_rgba(255,107,0,0.15)]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-orange' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-neutral-950 border border-emerald-500/20 flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-neutral-300">C++ Engine Active</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </aside>
    </>
  );
}
