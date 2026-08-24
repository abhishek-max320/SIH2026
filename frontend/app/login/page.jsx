'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, User, MapPin, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('farmer');
  const [farmName, setFarmName] = useState('');
  const [district, setDistrict] = useState('Ludhiana');
  const [isLoading, setIsLoading] = useState(false);

  const demoPersonas = [
    {
      role: 'farmer',
      title: '🌾 Farmer Persona',
      name: 'Rajesh Kumar',
      email: 'farmer@agrisentinel.ai',
      password: 'farmer123',
      dest: '/dashboard',
      desc: '12-acre wheat farm in Ludhiana, Punjab',
    },
    {
      role: 'expert',
      title: '🔬 Agronomist Expert',
      name: 'Dr. Ananya Sharma',
      email: 'expert@agrisentinel.ai',
      password: 'expert123',
      dest: '/expert',
      desc: 'Plant pathology review & AI verification',
    },
    {
      role: 'officer',
      title: '🏛️ Agriculture Officer',
      name: 'Vikram Singh',
      email: 'officer@agrisentinel.ai',
      password: 'officer123',
      dest: '/government',
      desc: 'State outbreak surveillance & heatmap',
    },
    {
      role: 'admin',
      title: '⚡ System Admin',
      name: 'Admin',
      email: 'admin@agrisentinel.ai',
      password: 'admin123',
      dest: '/admin',
      desc: 'Model registry & platform telemetry',
    },
  ];

  const handleQuickLogin = async (persona) => {
    setIsLoading(true);
    const result = await login(persona.email, persona.password, persona.role);
    setIsLoading(false);

    if (result.success) {
      toast.success('Authentication Successful', `Logged in as ${persona.name} (${persona.role.toUpperCase()})`);
      router.push(persona.dest);
    } else {
      toast.error('Login Failed', result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, role);
    setIsLoading(false);

    if (result.success) {
      toast.success('Welcome back!', `Logged in as ${result.user.name}`);
      if (role === 'officer') router.push('/government');
      else if (role === 'expert') router.push('/expert');
      else router.push('/dashboard');
    } else {
      toast.error('Authentication Error', result.error);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-grid flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-orange to-agri-amber flex items-center justify-center text-black font-bold shadow-lg glow-border-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-wider">
                AGRISENTINEL <span className="text-agri-orange text-xs font-mono">AI</span>
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">Smart India Hackathon 2026</span>
            </div>
          </Link>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Crop Intelligence Portal
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Sign in with your role to access customized telemetry, AI disease scanning, outbreak warnings, and epidemiological surveillance tools.
            </p>
          </div>

          {/* Quick 1-Click Judge Demo Selector */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 1-CLICK DEMO PERSONAS</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {demoPersonas.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleQuickLogin(p)}
                  className="w-full text-left p-3 rounded-xl glass-panel border border-white/10 hover:border-agri-orange/40 hover:bg-white/5 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-agri-orange transition-colors">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">{p.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-agri-orange group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-agri-orange/30 shadow-2xl"
          >
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-neutral-900/80 p-1 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-agri-orange text-black font-bold shadow-[0_0_12px_rgba(255,107,0,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-agri-orange text-black font-bold shadow-[0_0_12px_rgba(255,107,0,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Register New User
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rajesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-agri-orange transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-agri-orange transition-colors"
                    >
                      <option value="farmer">🌾 Farmer (Crop Scanning & Alerts)</option>
                      <option value="expert">🔬 Agronomist Expert (Review Diagnostics)</option>
                      <option value="officer">🏛️ Agriculture Officer (Surveillance Heatmap)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Farm / Organization</label>
                      <input
                        type="text"
                        placeholder="Green Valley Farm"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-agri-orange transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">District</label>
                      <input
                        type="text"
                        placeholder="Ludhiana"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-agri-orange transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="farmer@agrisentinel.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-agri-orange transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-agri-orange transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full shadow-agri-orange/30"
                >
                  {mode === 'login' ? 'Authenticate & Enter Platform' : 'Create Verified Account'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
