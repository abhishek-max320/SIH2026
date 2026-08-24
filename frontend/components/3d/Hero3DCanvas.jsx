'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2D Cyber-Sphere & Particle Radar Animation (100% stable across all browsers & mobile devices)
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const particles = [];
    const numParticles = 80;
    const width = (canvas.width = 460);
    const height = (canvas.height = 460);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 140;

    // Generate 3D spherical point cloud
    for (let i = 0; i < numParticles; i++) {
      const phi = Math.acos(-1 + (2 * i) / numParticles);
      const theta = Math.sqrt(numParticles * Math.PI) * phi;
      particles.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        color: i % 4 === 0 ? '#10B981' : i % 3 === 0 ? '#F59E0B' : '#FF6B00',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate particles around Y-axis & X-axis
      angle += 0.012;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Draw outer glowing halo rings
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw sweeping laser radar line
      const laserX = centerX + Math.cos(angle * 1.5) * (radius + 25);
      const laserY = centerY + Math.sin(angle * 1.5) * (radius + 25);
      const grad = ctx.createLinearGradient(centerX, centerY, laserX, laserY);
      grad.addColorStop(0, 'rgba(255, 107, 0, 0.0)');
      grad.addColorStop(1, 'rgba(255, 107, 0, 0.5)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(laserX, laserY);
      ctx.stroke();

      // Render 3D rotated nodes with depth sorting
      const projected = particles.map((p) => {
        // Rotate around Y
        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        // Project to 2D
        const scale = 250 / (250 + rz);
        return {
          x2d: centerX + rx * scale,
          y2d: centerY + p.y * scale,
          size: Math.max(1.8, 3.2 * scale),
          alpha: Math.max(0.2, (rz + radius) / (radius * 2)),
          color: p.color,
          z: rz,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      projected.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Node glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
      });

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // Draw Center Core Badge
      ctx.fillStyle = '#0D0D0D';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FF6B00';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-[420px] sm:h-[520px] flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
        <div className="w-12 h-12 rounded-full border-2 border-agri-orange border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-mono text-agri-orange">LOADING SPATIAL RADAR...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] sm:h-[520px] relative flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[460px] h-[460px] object-contain select-none"
      />

      {/* Center Icon in Sphere */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-agri-orange/20 border border-agri-orange/50 flex items-center justify-center text-agri-orange shadow-[0_0_20px_rgba(255,107,0,0.6)]">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Overlay HUD Telemetry */}
      <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-xl border border-agri-orange/30 text-[10px] font-mono text-agri-orange flex items-center gap-2 pointer-events-none shadow-[0_0_15px_rgba(255,107,0,0.2)]">
        <span className="w-2 h-2 rounded-full bg-agri-orange animate-pulse"></span>
        <span>C++ SPATIAL RADAR ONLINE</span>
      </div>

      <div className="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-neutral-400 pointer-events-none">
        25 KM MULTI-RING SENSOR MESH
      </div>
    </div>
  );
}
