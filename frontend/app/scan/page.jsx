'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Scan,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ScannerBeam from '../../components/ui/ScannerBeam';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { useToast } from '../../context/ToastContext';
import { scanService } from '../../services/scanService';
import { CROPS } from '../../utils/constants';

export default function CropScannerPage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedField, setSelectedField] = useState('Plot A (North Block)');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [qcError, setQcError] = useState(null);

  // SIH 2026 Instant Demo Specimens (Generates realistic data without manual file upload)
  const demoSamples = [
    {
      label: '🌾 Infected Wheat Leaf (Leaf Rust)',
      crop: 'Wheat',
      desc: 'Typical rust pustules & chlorotic halo',
      color: '#A06020',
    },
    {
      label: '🥔 Infected Potato Leaf (Late Blight)',
      crop: 'Potato',
      desc: 'Water-soaked necrotic lesions',
      color: '#504020',
    },
    {
      label: '🍅 Infected Tomato Leaf (Early Blight)',
      crop: 'Tomato',
      desc: 'Concentric ring target spots',
      color: '#605020',
    },
    {
      label: '🌱 Healthy Rice Tiller',
      crop: 'Rice',
      desc: 'Uniform green photosynthetic tissue',
      color: '#207030',
    },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setQcError(null);
    }
  };

  const handleDemoSampleSelect = (sample) => {
    setSelectedCrop(sample.crop);
    // Create an in-memory textured canvas image for deterministic demo judging
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base leaf gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#2D5A27');
    grad.addColorStop(0.5, '#417A35');
    grad.addColorStop(1, '#1E401A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Add leaf veins
    ctx.strokeStyle = 'rgba(180, 230, 140, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    for (let y = 50; y < 480; y += 40) {
      ctx.beginPath();
      ctx.moveTo(256, y);
      ctx.lineTo(100, y + 50);
      ctx.moveTo(256, y);
      ctx.lineTo(412, y + 50);
      ctx.stroke();
    }

    // Add infected pustule lesions if not healthy
    if (sample.crop !== 'Rice') {
      ctx.fillStyle = 'rgba(215, 100, 20, 0.85)';
      for (let i = 0; i < 28; i++) {
        const lx = 140 + Math.random() * 230;
        const ly = 100 + Math.random() * 320;
        const r = 8 + Math.random() * 14;
        ctx.beginPath();
        ctx.arc(lx, ly, r, 0, 2 * Math.PI);
        ctx.fill();

        // Yellow halo
        ctx.strokeStyle = 'rgba(235, 200, 50, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      setImageFile(file);
      setImagePreview(canvas.toDataURL('image/jpeg'));
      setQcError(null);
      toast.info('Demo Specimen Loaded', `Selected: ${sample.label}`);
    }, 'image/jpeg');
  };

  const handleStartAnalysis = async () => {
    if (!imageFile) {
      toast.warning('No Specimen Selected', 'Please upload or pick a crop leaf specimen to analyze.');
      return;
    }

    setIsScanning(true);
    setScanStep(1);
    setScanProgress(10);
    setQcError(null);

    // Multi-stage visual step timer
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 12;
      });
      setScanStep((prev) => Math.min(8, prev + 1));
    }, 450);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('crop', selectedCrop);
      formData.append('latitude', 30.9010);
      formData.append('longitude', 75.8573);
      formData.append('user_id', 1);

      const result = await scanService.analyzeCrop(formData);
      clearInterval(interval);
      setScanProgress(100);
      setScanStep(9);

      if (result.success === false && result.status === 'QC_FAILED') {
        setIsScanning(false);
        setQcError(result);
        toast.error('Image QC Rejected', result.message);
        return;
      }

      toast.success('Diagnosis Complete', `Identified ${result.disease?.name} with ${result.disease?.confidence}% confidence.`);
      
      setTimeout(() => {
        router.push(`/result/${result.report_id}`);
      }, 600);
    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      toast.error('Scan Error', err.message || 'Backend inference failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      {/* Loading Overlay */}
      {isScanning && (
        <LoadingOverlay
          currentStep={scanStep}
          progress={scanProgress}
          stageTitle="Executing Neural Inference & C++ Spatial Risk Engine..."
        />
      )}

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange mb-1">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                <span>AI VISION & QC PIPELINE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                AI Crop Specimen Scanner
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Upload leaf imagery for OpenCV quality validation, CNN disease classification, YOLO pest count, and C++ outbreak risk evaluation.
              </p>
            </div>
          </div>

          {/* QC Error Banner if returned */}
          {qcError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-4 shadow-xl"
            >
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Image Quality Control Failed ({qcError.qc_metrics?.qc_status})</h4>
                <p className="text-xs text-neutral-300 mt-1">{qcError.message}</p>
                <ul className="text-xs text-rose-300 list-disc list-inside mt-2 space-y-0.5">
                  {qcError.recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Main Scanner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Upload Viewport */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel-glow rounded-3xl p-6 border border-agri-orange/30 relative">
                {/* Image Dropzone Viewport */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-[340px] sm:h-[420px] rounded-2xl bg-black/60 border-2 border-dashed border-white/20 hover:border-agri-orange/60 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Crop Specimen"
                        className="w-full h-full object-contain rounded-xl"
                      />
                      {/* Interactive Scanning Laser Line */}
                      <ScannerBeam active={true} color="#FF6B00" />

                      <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 rounded-xl border border-agri-orange/30 text-[10px] font-mono text-agri-orange flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-agri-orange animate-pulse" />
                        <span>SPECIMEN READY FOR INFERENCE</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-600 text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4 max-w-xs">
                      <div className="w-16 h-16 rounded-2xl bg-agri-orange/10 border border-agri-orange/30 flex items-center justify-center text-agri-orange mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">Drop Leaf Image Here</h3>
                        <p className="text-xs text-neutral-400 mt-1">or click to browse from device camera</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
                        <span>JPEG, PNG, WEBP</span>
                        <span>•</span>
                        <span>Min 256×256</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Button CTA */}
                <div className="mt-6">
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={!imageFile || isScanning}
                    size="lg"
                    variant="glow"
                    icon={Scan}
                    className="w-full text-base tracking-wider"
                  >
                    ANALYZE CROP SPECIMEN
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Meta Options & Quick Judge Presets */}
            <div className="lg:col-span-5 space-y-6">
              {/* Target Crop Config */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Specimen Metadata
                </h3>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Target Crop</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CROPS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCrop(c.name)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center space-x-2 transition-all ${
                          selectedCrop === c.name
                            ? 'bg-agri-orange text-black font-bold shadow-[0_0_12px_rgba(255,107,0,0.4)]'
                            : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="text-base">{c.icon}</span>
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Monitored Plot</label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-agri-orange"
                  >
                    <option value="Plot A (North Block)">Plot A - 6.0 Acres (Ludhiana)</option>
                    <option value="Plot B (South Block)">Plot B - 6.5 Acres (Ludhiana)</option>
                    <option value="Experimental Field">ICAR Experimental Plot (New Delhi)</option>
                  </select>
                </div>
              </div>

              {/* SIH Judge 1-Click Preset Samples */}
              <div className="glass-panel p-6 rounded-2xl border border-agri-orange/30 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange">
                  <Sparkles className="w-4 h-4" />
                  <span>SIH 1-CLICK TEST SPECIMENS</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Select any preset specimen to instantly test the dual CNN/YOLO model and C++ risk engine:
                </p>

                <div className="space-y-2">
                  {demoSamples.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDemoSampleSelect(s)}
                      className="w-full text-left p-3 rounded-xl glass-panel border border-white/10 hover:border-agri-orange hover:bg-white/5 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-agri-orange transition-colors">
                          {s.label}
                        </p>
                        <p className="text-[10px] text-neutral-400">{s.desc}</p>
                      </div>
                      <Badge variant="orange" size="sm">LOAD</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
