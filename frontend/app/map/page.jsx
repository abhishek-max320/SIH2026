'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Radio, Filter, MapPin, AlertTriangle, ShieldCheck, Compass, Layers, RefreshCw } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { outbreakService } from '../../services/outbreakService';

// Dynamic import for Leaflet map component (SSR safe)
const OutbreakMap = dynamic(() => import('../../components/maps/OutbreakMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-agri-orange border-t-transparent animate-spin mb-3" />
      <p className="text-xs font-mono text-agri-orange">LOADING GEOSPATIAL TILES & POSTGIS RADAR...</p>
    </div>
  ),
});

export default function OutbreakMapPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [outbreaks, setOutbreaks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedRadius, setSelectedRadius] = useState(25);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeatmapData() {
      try {
        const data = await outbreakService.getHeatmapData();
        setOutbreaks(data || []);
      } catch (err) {
        console.error('Error loading heatmap:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHeatmapData();
  }, []);

  const filteredOutbreaks = outbreaks.filter((o) => {
    if (selectedCrop !== 'ALL' && o.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>GEOSPATIAL EPIDEMIOLOGY RADAR</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Regional Outbreak Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Live PostGIS & C++ high-performance surveillance tracking pathogen transmission clusters across agricultural districts.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Crop Filter */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-agri-orange"
              >
                <option value="ALL">All Crops</option>
                <option value="Wheat">Wheat</option>
                <option value="Potato">Potato</option>
                <option value="Tomato">Tomato</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
              </select>

              {/* Radius Filter */}
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-agri-orange"
              >
                <option value={5}>5 km Alert Radius</option>
                <option value={10}>10 km Alert Radius</option>
                <option value={25}>25 km Alert Radius</option>
                <option value={50}>50 km Regional Mesh</option>
              </select>
            </div>
          </div>

          {/* Map Viewport Card */}
          <div className="glass-panel-glow rounded-3xl p-4 sm:p-6 border border-agri-orange/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-agri-orange" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Northern India Agro-Climatic Zone (Punjab / Haryana / UP)
                </span>
              </div>
              <span className="text-xs font-mono text-agri-orange font-semibold">
                {filteredOutbreaks.length} Active Incident Clusters
              </span>
            </div>

            <OutbreakMap
              outbreaks={filteredOutbreaks}
              center={[30.9010, 75.8573]}
              zoom={8}
              selectedRadiusKm={selectedRadius}
            />
          </div>

          {/* Cluster Incidents Summary Table */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Geo-Tagged Outbreak Reports
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono">
                    <th className="pb-3 font-semibold">CROP & DISEASE</th>
                    <th className="pb-3 font-semibold">DISTRICT & STATE</th>
                    <th className="pb-3 font-semibold">SEVERITY</th>
                    <th className="pb-3 font-semibold">AI CONFIDENCE</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOutbreaks.slice(0, 8).map((ob) => (
                    <tr key={ob.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        {ob.crop} • {ob.disease}
                      </td>
                      <td className="py-3 text-neutral-300">
                        {ob.district}, {ob.state}
                      </td>
                      <td className="py-3 font-mono">
                        <span className={ob.severity_percent > 60 ? 'text-rose-400 font-bold' : 'text-agri-orange'}>
                          {ob.severity_percent}%
                        </span>
                      </td>
                      <td className="py-3 font-mono text-emerald-400">
                        {ob.confidence}%
                      </td>
                      <td className="py-3">
                        <Badge variant={ob.status === 'Active' ? 'orange' : 'emerald'} size="sm">
                          {ob.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
