'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Scan, Sprout, MapPin, AlertTriangle, ArrowRight, Activity, Layers, Calendar, RefreshCw } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import HealthGauge from '../../components/dashboard/HealthGauge';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import OutbreakAlertFeed from '../../components/dashboard/OutbreakAlertFeed';
import RecentScansTimeline from '../../components/dashboard/RecentScansTimeline';
import { useAuth } from '../../context/AuthContext';
import { weatherService, outbreakService } from '../../services/outbreakService';
import { scanService } from '../../services/scanService';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [scansData, alertsData, weatherData] = await Promise.allSettled([
          scanService.getRecentScans(5),
          outbreakService.getAlerts(user?.id || 1),
          outbreakService.getFarmRisk(1),
        ]);

        if (scansData.status === 'fulfilled') setRecentScans(scansData.value);
        if (alertsData.status === 'fulfilled') setAlerts(alertsData.value);
        if (weatherData.status === 'fulfilled') setWeather(weatherData.value?.weather);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Persistent Sidebar */}
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>FARM TELEMETRY ONLINE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Good Morning, {user?.name || 'Farmer Rajesh Kumar'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-agri-orange shrink-0" />
                <span>{user?.farm_name || 'Ludhiana Golden Acres'}, Punjab • 12.5 Acres Monitored</span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/scan">
                <Button size="md" variant="primary" icon={Scan} className="shadow-agri-orange/30">
                  Scan Specimen
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Row: Circular Health Score + Active Plots + Microclimate */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Health Score Gauge */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
              <div className="w-full flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Crop Health Score</h3>
                <Badge variant="emerald" size="sm">ACTIVE</Badge>
              </div>

              <div className="py-2">
                <HealthGauge score={87} size={170} />
              </div>

              <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">
                Overall canopy health remains favorable. Localized alert issued for Plot A flag leaf inspection.
              </p>
            </div>

            {/* Microclimate Weather Widget */}
            <div className="lg:col-span-8">
              <WeatherWidget weather={weather} />
            </div>
          </div>

          {/* Middle Row: Active Field Plots Tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-agri-orange/30 relative group hover:border-agri-orange transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-agri-orange font-bold">PLOT A (6.0 ACRES)</span>
                <Badge variant="orange" size="sm">INSPECTION DUE</Badge>
              </div>
              <h4 className="text-lg font-bold text-white">Wheat (HD-3086)</h4>
              <div className="text-xs text-neutral-400 space-y-1.5 mt-3">
                <p className="flex items-center justify-between">
                  <span>Growth Stage:</span>
                  <span className="text-white font-medium">Flowering / Grain Filling</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Sown:</span>
                  <span className="text-white font-medium">75 Days Ago</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Est. Harvest:</span>
                  <span className="text-white font-medium">In 45 Days</span>
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-400 font-bold">PLOT B (6.5 ACRES)</span>
                <Badge variant="emerald" size="sm">HEALTHY</Badge>
              </div>
              <h4 className="text-lg font-bold text-white">Wheat (PBW-550)</h4>
              <div className="text-xs text-neutral-400 space-y-1.5 mt-3">
                <p className="flex items-center justify-between">
                  <span>Growth Stage:</span>
                  <span className="text-white font-medium">Vegetative Heading</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Sown:</span>
                  <span className="text-white font-medium">60 Days Ago</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Est. Harvest:</span>
                  <span className="text-white font-medium">In 60 Days</span>
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-neutral-400 font-bold">SURVEILLANCE RADAR</span>
                  <Badge variant="neutral" size="sm">25 KM MESH</Badge>
                </div>
                <h4 className="text-lg font-bold text-white">Spatial Risk Index</h4>
                <p className="text-xs text-neutral-400 mt-2">
                  C++ Native Engine actively cross-referencing surrounding outbreak reports with local wind vectors.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-agri-orange">4 Nearby Cases Logged</span>
                <Link href="/map" className="text-xs text-white hover:text-agri-orange font-semibold flex items-center gap-1">
                  <span>Open Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Outbreak Feed + Recent Scans History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <OutbreakAlertFeed alerts={alerts} />
            </div>
            <div className="lg:col-span-7">
              <RecentScansTimeline scans={recentScans} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
