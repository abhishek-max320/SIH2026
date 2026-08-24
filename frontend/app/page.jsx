'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Scan, ArrowRight, Zap, CheckCircle2, Cpu, Activity, Globe, Compass, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/ui/Button';
import StatsCounter from '../components/landing/StatsCounter';
import HowItWorks from '../components/landing/HowItWorks';
import TechStackGrid from '../components/landing/TechStackGrid';
import OutbreakRadarPreview from '../components/landing/OutbreakRadarPreview';
import Hero3DCanvas from '../components/3d/Hero3DCanvas';

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      {/* Top Navbar */}
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      {/* Mobile Drawer Only */}
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* ===================== HERO SECTION ===================== */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-agri-orange/10 border border-agri-orange/30 text-agri-orange text-xs font-mono">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                <span>SMART INDIA HACKATHON 2026 ENTERPRISE PROTOTYPE</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                Detect Earlier.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-orange via-agri-amber to-amber-300 glow-text-orange">
                  Protect Smarter.
                </span>{' '}
                Grow Better.
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-light">
                AgriSentinel AI is an agricultural intelligence platform that goes beyond basic leaf classification. It detects pathogens, estimates area severity, analyzes microclimate risk via a native C++ engine, and warns nearby farmers to stop regional outbreaks before they spread.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/scan">
                  <Button size="lg" variant="primary" icon={Scan} className="shadow-agri-orange/30">
                    Scan Your Crop
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" icon={ArrowRight}>
                    Explore Farmer Dashboard
                  </Button>
                </Link>
              </div>

              {/* Verification bullets */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-mono">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Native C++ Risk Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified ICAR Protocols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>25km Early Warning Network</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Holographic Crop Scene */}
            <div className="lg:col-span-5">
              <div className="glass-panel-glow rounded-3xl p-4 border border-agri-orange/30 relative">
                <Hero3DCanvas />
              </div>
            </div>
          </div>
        </section>

        {/* ===================== LIVE METRICS ===================== */}
        <StatsCounter />

        {/* ===================== HOW IT WORKS ===================== */}
        <HowItWorks />

        {/* ===================== OUTBREAK RADAR SIMULATOR ===================== */}
        <OutbreakRadarPreview />

        {/* ===================== CORE TECH STACK ===================== */}
        <TechStackGrid />

        {/* ===================== SIH 2026 ARCHITECTURE CALLOUT ===================== */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-neutral-900/50 to-black">
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="text-xs font-mono text-agri-orange uppercase tracking-widest px-3 py-1 rounded-full bg-agri-orange/10 border border-agri-orange/30">
                READY FOR JUDGING
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Designed for Farmers. Powered for Governments.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Experience the deterministic 1-click SIH Demo Flow connecting Farmer Scan, Automated QC, Dual CNN/YOLO AI, C++ Haversine Proximity, and Government Heatmap surveillance in real time.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link href="/scan">
                  <Button size="lg" variant="primary" icon={Scan}>
                    Launch AI Crop Scanner
                  </Button>
                </Link>
                <Link href="/government">
                  <Button size="lg" variant="outline" icon={ExternalLink}>
                    View Government Surveillance
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="glass-panel border-t border-white/10 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agri-orange to-agri-amber flex items-center justify-center text-black font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">AGRISENTINEL AI</span>
              <span className="block text-[10px] text-neutral-500 font-mono">Smart India Hackathon 2026</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-neutral-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Farmer Dashboard</Link>
            <Link href="/scan" className="hover:text-white transition-colors">AI Scanner</Link>
            <Link href="/map" className="hover:text-white transition-colors">Outbreak Map</Link>
            <Link href="/government" className="hover:text-white transition-colors">Government Hub</Link>
            <Link href="/expert" className="hover:text-white transition-colors">Expert Review</Link>
          </div>

          <div className="text-[11px] font-mono text-neutral-500">
            Powered by Next.js, FastAPI & Native C++17
          </div>
        </div>
      </footer>
    </div>
  );
}
