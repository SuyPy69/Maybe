import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

// IMPORT YOUR NEW REALISTIC SCENE
import BloodCellScene from './BloodCellScene';

export default function Login({ onLogin }) {
  const [passkey, setPasskey] = useState('');

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden font-mono">

      {/* INTEGRATE YOUR NEW REALISTIC SCENE */}
      <BloodCellScene />

      {/* Your existing Login Terminal UI (Themed for Red/Black Stability) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        <div className="bg-red-950/10 backdrop-blur-md border border-red-900/50 p-8 shadow-[0_0_50px_rgba(153,0,0,0.2)]">

          <div className="flex flex-col items-center mb-8">
            <ShieldCheck className="text-red-600 w-16 h-16 mb-4 animate-pulse-slow" />
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Blood-Link</h1>
            <p className="text-[10px] text-red-900 tracking-[0.3em] font-bold mt-1">GLOBAL_GRID // STABILITY_v4.0</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-red-950" size={16} />
              <input
                type="password"
                placeholder="ACCESS_ENCRYPTION_KEY"
                className="w-full bg-black/60 border border-red-900/50 p-4 pl-12 text-sm text-red-500 outline-none focus:border-red-500 transition-all placeholder:text-red-950"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
              />
            </div>

            <button
              onClick={() => onLogin()}
              className="w-full relative group overflow-hidden bg-red-600 hover:bg-red-500 text-black font-black py-4 text-xs uppercase tracking-widest transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Initialize_Grid <Activity size={14} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-red-900/30 flex justify-between items-center text-[8px] text-red-900 uppercase font-bold">
            <span>SECURE_TERMINAL_v4.0</span>
            <AlertTriangle className="text-red-700 animate-pulse" size={12} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}