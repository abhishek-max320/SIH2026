'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle2,
  Cpu,
  Scan,
  ShieldCheck,
  Radio,
  Building2,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function SIHDemoFlowPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps = [
    { id: 1, title: 'Farmer Login', desc: 'Rajesh Kumar authenticates into Punjab agro-telemetry node', link: '/login' },
    { id: 2, title: 'Open Crop Scanner', desc: 'High-resolution dropzone with OpenCV quality control (QC)', link: '/scan' },
    { id: 3, title: 'Upload Specimen', desc: 'Infected Wheat leaf specimen loaded into camera buffer', link: '/scan' },
    { id: 4, title: 'Dual CNN/YOLO AI', desc: 'Neural vision identifies Wheat Leaf Rust with 94.7% confidence', link: '/result/1' },
    { id: 5, title: 'Severity Estimation', desc: 'Colorimetric mask computes 22.4% leaf area necrosis', link: '/result/1' },
    { id: 6, title: 'Weather Retrieval', desc: 'Open-Meteo fetches 24.5°C & 84% RH (Critical Spore Vector)', link: '/dashboard' },
    { id: 7, title: 'C++ Spatial Risk Engine', desc: 'Sub-millisecond Haversine proximity calculates 82/100 HIGH RISK', link: '/map' },
    { id: 8, title: 'Verified ICAR Protocol', desc: 'Curated curative Triazole spray schedule synthesized', link: '/result/1' },
    { id: 9, title: 'Geospatial Heatmap Pin', desc: 'Anonymized case plotted on regional PostGIS epidemiology map', link: '/map' },
    { id: 10, title: 'Early Warning Broadcast', desc: 'Susceptible wheat farms within 25 km receive SMS & in-app alerts', link: '/alerts' },
    { id: 11, title: 'Government Surveillance', desc: 'State agricultural dashboard registers Ludhiana critical cluster', link: '/government' },
    { id: 12, title: 'Agronomist Verification', desc: 'Human-in-the-loop expert confirms diagnosis for continuous learning', link: '/expert' },
  ];

  const runFullDemo = () => {
    setIsRunning(true);
    setActiveStep(1);

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= demoSteps.length) {
          clearInterval(interval);
          setIsRunning(false);
          return demoSteps.length;
        }
        return prev + 1;
      });
    }, 800);
  };

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
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH 2026 GRAND FINALE DEMONSTRATION</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                1-Click End-to-End Judging Flow
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Simulate the entire surveillance lifecycle from single-leaf field scanning to nationwide outbreak containment in real time.
              </p>
            </div>

            <Button
              onClick={runFullDemo}
              disabled={isRunning}
              size="lg"
              variant="primary"
              icon={Play}
              className="shadow-agri-orange/40"
            >
              {isRunning ? 'Executing Judging Pipeline...' : 'Run 1-Click SIH Flow'}
            </Button>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoSteps.map((step) => {
              const isCompleted = step.id <= activeStep;
              const isCurrent = step.id === activeStep;

              return (
                <motion.div
                  key={step.id}
                  animate={{
                    scale: isCurrent ? 1.02 : 1,
                  }}
                  className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'border-agri-orange bg-agri-orange/15 shadow-[0_0_20px_rgba(255,107,0,0.25)]'
                      : isCompleted
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-white/10 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-neutral-400 font-bold">
                        PHASE {step.id < 10 ? `0${step.id}` : step.id}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600" />
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm">{step.title}</h4>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={step.link}
                      className="text-xs text-agri-orange hover:text-agri-orange-glow font-medium flex items-center gap-1"
                    >
                      <span>Inspect Screen</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
