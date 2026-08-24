'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Scan, User, Globe, ChevronDown, Menu, X, Bell, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import VoiceAssistantModal from '../voice/VoiceAssistantModal';

export default function Navbar({ onOpenMobileNav }) {
  const pathname = usePathname();
  const { user, switchRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Farmer Dashboard' },
    { href: '/scan', label: 'AI Crop Scanner' },
    { href: '/map', label: 'Outbreak Intelligence' },
    { href: '/government', label: 'Surveillance Hub' },
    { href: '/expert', label: 'Expert Review' },
  ];

  const roles = [
    { id: 'farmer', label: '🌾 Farmer Portal', desc: 'Crop scan & localized alerts' },
    { id: 'expert', label: '🔬 Agronomist Expert', desc: 'Review & correct AI diagnosis' },
    { id: 'officer', label: '🏛️ Govt. Surveillance', desc: 'Regional heatmap & outbreak analytics' },
    { id: 'admin', label: '⚡ System Admin', desc: 'Platform & model management' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-orange to-agri-amber flex items-center justify-center shadow-lg shadow-agri-orange/20 group-hover:shadow-agri-orange/40 transition-all duration-300">
              <ShieldCheck className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-white text-lg flex items-center gap-1.5">
                AGRISENTINEL <span className="text-agri-orange text-xs font-mono px-1.5 py-0.5 rounded bg-agri-orange/10 border border-agri-orange/30">AI</span>
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono tracking-tight">Crop Health & Outbreak Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-agri-orange/15 text-agri-orange border border-agri-orange/30 shadow-[0_0_10px_rgba(255,107,0,0.15)]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Role Switcher & Actions */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:border-agri-orange/30 transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-agri-orange" />
            <span>{lang === 'EN' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* SIH 2026 Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-agri-orange/30 text-xs text-white hover:border-agri-orange transition-all shadow-[0_0_10px_rgba(255,107,0,0.1)]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono capitalize font-medium">{user?.role || 'Farmer'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel-glow rounded-2xl p-2 border border-agri-orange/30 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  SIH Demo Persona Switcher
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col ${
                      user?.role === r.id
                        ? 'bg-agri-orange/15 text-agri-orange font-semibold'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Assistant Trigger */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="p-2 rounded-xl bg-agri-orange/10 border border-agri-orange/30 text-agri-orange hover:bg-agri-orange hover:text-black transition-all"
            title="Voice Assistant (Hindi / English)"
          >
            <Activity className="w-4 h-4 animate-pulse" />
          </button>

          {/* Scan CTA */}
          <Link href="/scan">
            <Button size="sm" variant="primary" icon={Scan} className="shadow-agri-orange/30">
              <span className="hidden sm:inline">Scan Crop</span>
            </Button>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900 border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </header>
  );
}
