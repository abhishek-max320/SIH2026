'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, CheckCircle2, AlertCircle, Scan } from 'lucide-react';
import Badge from '../ui/Badge';

export default function RecentScansTimeline({ scans = [] }) {
  const defaultScans = scans.length > 0 ? scans : [
    {
      id: 1,
      crop: 'Wheat (Plot A)',
      disease_name: 'Leaf Rust',
      confidence: 94.7,
      severity_grade: 'Moderate',
      affected_area_percent: 18.2,
      crop_health_score: 82.5,
      date: 'Today, 10:45 AM',
      image_url: '/wheat_sample.jpg',
      status: 'UNDER_MANAGEMENT'
    },
    {
      id: 2,
      crop: 'Wheat (Plot B)',
      disease_name: 'Healthy Foliage',
      confidence: 98.2,
      severity_grade: 'Healthy',
      affected_area_percent: 0.0,
      crop_health_score: 95.0,
      date: 'Yesterday, 04:20 PM',
      image_url: '/wheat_sample.jpg',
      status: 'HEALTHY'
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Recent Specimen Scans & Diagnostics</h3>
          <p className="text-xs text-neutral-400">Chronological telemetry of farm observations</p>
        </div>
        <Link href="/scan" className="text-xs text-agri-orange hover:text-agri-orange-glow font-medium flex items-center gap-1">
          <Scan className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </Link>
      </div>

      <div className="space-y-3">
        {defaultScans.map((scan) => {
          const isHealthy = scan.severity_grade === 'Healthy';
          return (
            <div
              key={scan.id}
              className="p-4 rounded-xl glass-panel-subtle border border-white/5 hover:border-agri-orange/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-agri-orange shrink-0">
                  {isHealthy ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-agri-orange" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{scan.disease_name}</h4>
                    <Badge variant={isHealthy ? 'emerald' : 'orange'} size="sm">
                      {scan.confidence}% Conf.
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {scan.crop || 'Wheat'} • Affected Area: {scan.affected_area_percent}% • {scan.date || 'Recent'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono text-white block">
                    {scan.crop_health_score} / 100
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">HEALTH SCORE</span>
                </div>

                <Link
                  href={`/result/${scan.id}`}
                  className="p-2 rounded-xl bg-white/5 hover:bg-agri-orange hover:text-black transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
