'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, Volume2, MessageSquare, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sampleVoiceQueries = [
    {
      query: 'मेरी गेहूं की फसल में पीले और भूरे धब्बे आ रहे हैं, क्या करूँ?',
      response: 'यह गेहूं के पत्तों का रतुआ (Wheat Leaf Rust / Puccinia) हो सकता है। यदि आर्द्रता अधिक है, तो तुरंत 1.0 मिली/लीटर प्रोपिकोनाज़ोल (Propiconazole 25% EC) का छिड़काव करें।',
      disease: 'Wheat Leaf Rust',
    },
    {
      query: 'Tamatar ke patte par kaale gole dhabbe dikh rahe hain',
      response: 'Yeh Tomato Early Blight (Alternaria solani) ke lakshan hain. Neeche ke sankramit patte kaat dein aur Azoxystrobin 1 ml/L ka chhidkaav karein.',
      disease: 'Tomato Early Blight',
    },
    {
      query: 'What are the current disease risks in Ludhiana district?',
      response: 'High risk alert active for Wheat Leaf Rust within 3.8 km radius due to 84% relative humidity. Inspect flag leaves immediately.',
      disease: 'Regional Alert',
    },
  ];

  const handleSimulateVoiceInput = (sample) => {
    setIsListening(true);
    setQueryText('');
    setResponseText('');

    setTimeout(() => {
      setIsListening(false);
      setQueryText(sample.query);
      setResponseText(sample.response);

      // Web Speech synthesis if available
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sample.response);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎙️ AgriSentinel Voice Intelligence"
      subtitle="Ask agronomic questions in Hindi or English (स्पीच इनपुट)"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-center">
        {/* Animated Mic Sphere */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-agri-orange/20 animate-ping" />
          )}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-2xl ${
              isListening
                ? 'bg-agri-orange text-black scale-110 shadow-[0_0_30px_rgba(255,107,0,0.8)]'
                : 'bg-neutral-900 border border-agri-orange/40 text-agri-orange hover:border-agri-orange'
            }`}
            onClick={() => handleSimulateVoiceInput(sampleVoiceQueries[0])}
          >
            {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-agri-orange font-bold uppercase tracking-wider">
            {isListening ? 'LISTENING & TRANSCRIBING...' : 'TAP MIC OR SELECT SAMPLE QUERY BELOW'}
          </p>
        </div>

        {/* Display Query & Response */}
        {queryText && (
          <div className="text-left space-y-3 p-4 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-start gap-2">
              <span className="text-xs font-mono text-neutral-400">YOU:</span>
              <p className="text-xs text-white font-medium">{queryText}</p>
            </div>

            {responseText && (
              <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-agri-orange">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono block">AGRISENTINEL AI:</span>
                  <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">{responseText}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sample Hindi/English Prompts */}
        <div className="text-left space-y-2 pt-2">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            QUICK VOICE SAMPLES:
          </span>
          {sampleVoiceQueries.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimulateVoiceInput(s)}
              className="w-full text-left p-2.5 rounded-xl glass-panel border border-white/10 hover:border-agri-orange text-xs text-neutral-300 hover:text-white transition-all flex items-center justify-between"
            >
              <span className="truncate max-w-xs">{s.query}</span>
              <Volume2 className="w-3.5 h-3.5 text-agri-orange shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
