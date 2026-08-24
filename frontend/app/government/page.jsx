'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Users,
  ShieldCheck,
  Download,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { outbreakService } from '../../services/outbreakService';

export default function GovernmentSurveillancePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await outbreakService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const weeklyTrendData = analytics?.weekly_trend || [
    { week: 'Week 1', cases: 3, resolved: 1 },
    { week: 'Week 2', cases: 6, resolved: 2 },
    { week: 'Week 3', cases: 10, resolved: 4 },
    { week: 'Week 4', cases: 14, resolved: 5 },
  ];

  const topDiseasesData = analytics?.top_diseases || [
    { disease: 'Wheat Leaf Rust', count: 7, avg_severity: 58.4 },
    { disease: 'Potato Late Blight', count: 3, avg_severity: 81.5 },
    { disease: 'Wheat Yellow Rust', count: 2, avg_severity: 41.5 },
    { disease: 'Rice Leaf Blast', count: 1, avg_severity: 52.0 },
    { disease: 'Tomato Early Blight', count: 1, avg_severity: 40.0 },
  ];

  const districtsData = analytics?.districts_ranking || [
    { district: 'Ludhiana', state: 'Punjab', cases: 4, primary_disease: 'Wheat Leaf Rust', risk_index: 82, status: 'CRITICAL' },
    { district: 'Agra', state: 'Uttar Pradesh', cases: 2, primary_disease: 'Potato Late Blight', risk_index: 88, status: 'CRITICAL' },
    { district: 'Jalandhar', state: 'Punjab', cases: 2, primary_disease: 'Wheat Leaf Rust', risk_index: 74, status: 'HIGH' },
    { district: 'Karnal', state: 'Haryana', cases: 1, primary_disease: 'Wheat Leaf Rust', risk_index: 62, status: 'HIGH' },
    { district: 'Patiala', state: 'Punjab', cases: 1, primary_disease: 'Wheat Leaf Rust', risk_index: 60, status: 'MODERATE' },
  ];

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="flex-1 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>STATE & NATIONAL SURVEILLANCE DESK</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Government Epidemic Surveillance Hub
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                District-level epidemiological telemetry, early containment analytics, and outbreak forecasting.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-agri-orange text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export State Report</span>
              </button>
            </div>
          </div>

          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-agri-orange/30">
              <span className="text-[10px] font-mono text-agri-orange uppercase tracking-wider block">
                ACTIVE OUTBREAKS
              </span>
              <h3 className="text-3xl font-extrabold font-mono text-white mt-1">
                {analytics?.kpis?.active_cases || 14}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Across 6 Agricultural Districts</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                MONITORED FARMERS
              </span>
              <h3 className="text-3xl font-extrabold font-mono text-white mt-1">1,240+</h3>
              <p className="text-xs text-neutral-400 mt-1">Under 24×7 Early Warning Mesh</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                CONTAINMENT RATE
              </span>
              <h3 className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">78.5%</h3>
              <p className="text-xs text-neutral-400 mt-1">Within 72 Hours of Detection</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                AVG DETECTION SPEED
              </span>
              <h3 className="text-3xl font-extrabold font-mono text-sky-400 mt-1">1.4 hrs</h3>
              <p className="text-xs text-neutral-400 mt-1">From Field Scan to Alert</p>
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Outbreak Progression Area Chart */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-agri-orange" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Weekly Outbreak Progression vs Containment
                  </h3>
                </div>
                <Badge variant="orange" size="sm">C++ MODEL</Badge>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrendData}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} />
                    <YAxis stroke="#9CA3AF" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D0D0D',
                        borderColor: 'rgba(255,107,0,0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="cases" name="Active Outbreaks" stroke="#FF6B00" fillOpacity={1} fill="url(#colorCases)" strokeWidth={2} />
                    <Area type="monotone" dataKey="resolved" name="Contained" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Diseases Bar Chart */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Prevalence by Pathogen
                  </h3>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDiseasesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={11} />
                    <YAxis dataKey="disease" type="category" width={110} stroke="#9CA3AF" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D0D0D',
                        borderColor: 'rgba(255,107,0,0.3)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Case Count" fill="#FF7A00" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* High-Risk District Surveillance Table */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                District Vulnerability Ranking
              </h3>
              <span className="text-xs font-mono text-neutral-400">Ranked by C++ Epidemiological Index</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono">
                    <th className="pb-3 font-semibold">DISTRICT & STATE</th>
                    <th className="pb-3 font-semibold">CASES</th>
                    <th className="pb-3 font-semibold">PRIMARY PATHOGEN</th>
                    <th className="pb-3 font-semibold">RISK SCORE</th>
                    <th className="pb-3 font-semibold">ALERT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {districtsData.map((d, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-white">
                        {d.district}, <span className="text-neutral-400 font-normal">{d.state}</span>
                      </td>
                      <td className="py-3 font-mono text-white">{d.cases}</td>
                      <td className="py-3 text-agri-orange font-medium">{d.primary_disease}</td>
                      <td className="py-3 font-mono font-bold">
                        <span className={d.risk_index > 75 ? 'text-rose-400' : 'text-agri-orange'}>
                          {d.risk_index} / 100
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant={d.status === 'CRITICAL' ? 'rose' : d.status === 'HIGH' ? 'orange' : 'amber'} size="sm">
                          {d.status}
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
