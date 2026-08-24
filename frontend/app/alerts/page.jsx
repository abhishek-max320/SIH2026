'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Radio, AlertTriangle, CheckCircle2, ShieldCheck, MapPin, Clock } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { outbreakService } from '../../services/outbreakService';

export default function AlertsPage() {
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await outbreakService.getAlerts(1);
        setAlerts(data || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await outbreakService.markAlertRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
      toast.success('Alert Acknowledged', 'Notification marked as read.');
    } catch (err) {
      toast.error('Error', err.message);
    }
  };

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
                <Bell className="w-3.5 h-3.5" />
                <span>ACTIVE EARLY WARNING NETWORK</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Alerts & Regional Warnings
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Real-time C++ radius-targeted notifications for susceptible crops in your district.
              </p>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-4 max-w-4xl">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  alert.is_read
                    ? 'border-white/5 opacity-70'
                    : alert.severity === 'HIGH'
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : 'border-amber-500/40 bg-amber-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === 'HIGH' ? 'rose' : 'amber'} size="sm">
                        {alert.severity} RISK
                      </Badge>
                      {alert.distance_km > 0 && (
                        <span className="text-xs font-mono text-agri-orange font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.distance_km} km away
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">{alert.message}</p>
                  </div>

                  {!alert.is_read && (
                    <Button
                      onClick={() => handleMarkRead(alert.id)}
                      size="sm"
                      variant="secondary"
                      className="shrink-0"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
