'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Sparkles,
  Search,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { outbreakService } from '../../services/outbreakService';

export default function ExpertReviewPage() {
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('CONFIRMED');
  const [confirmedDisease, setConfirmedDisease] = useState('');
  const [expertNotes, setExpertNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await outbreakService.getPendingReviews();
        setPendingReviews(data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleOpenReview = (scan) => {
    setSelectedScan(scan);
    setConfirmedDisease(scan.ai_predicted_disease);
    setReviewStatus('CONFIRMED');
    setExpertNotes('Verified distinctive lesion pattern and pustule density.');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedScan) return;

    try {
      await outbreakService.submitExpertReview(selectedScan.scan_id, {
        confirmed_disease: confirmedDisease,
        status: reviewStatus,
        confidence_override: 98.5,
        expert_notes: expertNotes,
      });

      toast.success('Review Submitted', `Diagnosis for Scan #${selectedScan.scan_id} marked as ${reviewStatus}.`);
      setReviewModalOpen(false);

      // Update local state
      setPendingReviews((prev) =>
        prev.map((s) =>
          s.scan_id === selectedScan.scan_id
            ? { ...s, is_reviewed: true, review: { status: reviewStatus, confirmed_disease: confirmedDisease } }
            : s
        )
      );
    } catch (err) {
      toast.error('Submission Failed', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col justify-between selection:bg-agri-orange selection:text-black">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Expert Verification — Scan #${selectedScan?.scan_id}`}
        subtitle="Review AI prediction, inspect leaf specimen, and validate treatment protocol."
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Verification Verdict</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewStatus('CONFIRMED')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  reviewStatus === 'CONFIRMED'
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-white/5 text-neutral-300 border border-white/10'
                }`}
              >
                ✓ Confirm Diagnosis
              </button>
              <button
                type="button"
                onClick={() => setReviewStatus('CORRECTED')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  reviewStatus === 'CORRECTED'
                    ? 'bg-agri-orange text-black shadow-[0_0_12px_rgba(255,107,0,0.5)]'
                    : 'bg-white/5 text-neutral-300 border border-white/10'
                }`}
              >
                ✎ Correct / Override
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Confirmed Pathogen / Disease Name</label>
            <input
              type="text"
              value={confirmedDisease}
              onChange={(e) => setConfirmedDisease(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-agri-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Agronomist Clinical Notes</label>
            <textarea
              rows={3}
              value={expertNotes}
              onChange={(e) => setExpertNotes(e.target.value)}
              placeholder="Add microscopic evaluation or specific spray timing recommendations..."
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-agri-orange"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="md" variant="primary" className="w-full">
              Submit & Push to Continuous Learning Dataset
            </Button>
          </div>
        </form>
      </Modal>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="flex-1 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-agri-orange mb-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>HUMAN-IN-THE-LOOP (HITL) VERIFICATION</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Agronomist Expert Review Portal
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Inspect AI diagnostic predictions, confirm pathogen species, and train the continuous learning model registry.
              </p>
            </div>
          </div>

          {/* Pending Reviews Queue */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReviews.map((scan) => (
              <div
                key={scan.scan_id}
                className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  scan.is_reviewed ? 'border-emerald-500/30' : 'border-agri-orange/40 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400">Specimen #{scan.scan_id}</span>
                    <Badge variant={scan.is_reviewed ? 'emerald' : 'orange'} size="sm">
                      {scan.is_reviewed ? 'VERIFIED' : 'PENDING REVIEW'}
                    </Badge>
                  </div>

                  <h4 className="text-base font-bold text-white">{scan.ai_predicted_disease}</h4>

                  <div className="space-y-1 text-xs text-neutral-300">
                    <p className="flex items-center justify-between">
                      <span className="text-neutral-400">AI Confidence:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{scan.ai_confidence}%</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-neutral-400">Area Severity:</span>
                      <span className="font-mono text-amber-400 font-semibold">{scan.affected_area_percent}%</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-neutral-400">Health Score:</span>
                      <span className="font-mono text-white font-semibold">{scan.health_score} / 100</span>
                    </p>
                  </div>

                  {scan.is_reviewed && scan.review && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                      <p className="font-semibold">Verdict: {scan.review.status}</p>
                      <p className="text-[11px] text-neutral-300 mt-0.5">{scan.review.expert_notes}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    onClick={() => handleOpenReview(scan)}
                    size="sm"
                    variant={scan.is_reviewed ? 'secondary' : 'primary'}
                    className="w-full"
                  >
                    {scan.is_reviewed ? 'Edit Verification' : 'Review & Validate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
