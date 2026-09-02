import React, { useState } from 'react';
import { Crosshair, Radio, BatteryMedium, Compass, Wifi, Eye } from 'lucide-react';

interface MovingDroneProps {
  className?: string;
  showTelemetry?: boolean;
}

export default function MovingDrone({ className = '', showTelemetry = true }: MovingDroneProps) {
  const [scanMode, setScanMode] = useState<'LiDAR' | 'Photogrammetry' | 'Thermal'>('LiDAR');

  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-auto ${className}`}>
      {/* Flight Telemetry HUD pill */}
      {showTelemetry && (
        <div className="mb-4 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/50 flex items-center gap-3 text-[11px] font-mono text-cyan-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-white tracking-wide">UAV-04 CADASTRAL PATROL</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>ALT 124.8m</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>RTK FIXED</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-amber-400">
            <BatteryMedium className="w-3.5 h-3.5" />
            <span>88%</span>
          </div>
        </div>
      )}

      {/* Main Animated Drone Assembly */}
      <div className="relative animate-drone flex flex-col items-center">
        {/* Drone Body SVG */}
        <div className="relative w-64 h-36 flex items-center justify-center drop-shadow-[0_15px_25px_rgba(6,182,212,0.35)]">
          <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="droneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="rotorBlur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.7)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
              </linearGradient>
              <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Left-Front to Right-Rear Arm */}
            <line x1="45" y1="35" x2="195" y2="105" stroke="url(#armGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* Right-Front to Left-Rear Arm */}
            <line x1="195" y1="35" x2="45" y2="105" stroke="url(#armGrad)" strokeWidth="6" strokeLinecap="round" />

            {/* Drone Carbon Truss Reinforcement */}
            <circle cx="120" cy="70" r="32" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="4 2" />

            {/* Central Fuselage Body */}
            <ellipse cx="120" cy="70" rx="34" ry="24" fill="url(#droneBodyGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 98,62 Q 120,52 142,62 L 138,78 Q 120,84 102,78 Z" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />

            {/* Top GPS / GNSS Puck Antenna */}
            <ellipse cx="120" cy="58" rx="14" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="120" cy="58" r="3" fill="#e0f2fe" className="animate-pulse" />

            {/* 4 Motor Mount Pods */}
            <circle cx="45" cy="35" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="195" cy="35" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="45" cy="105" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="195" cy="105" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

            {/* 4 Spinning Rotor Blades */}
            {/* Front-Left Rotor */}
            <g transform="translate(45, 35)">
              <ellipse cx="0" cy="0" rx="28" ry="8" fill="url(#rotorBlur)" className="animate-rotor origin-center opacity-80" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
            </g>

            {/* Front-Right Rotor */}
            <g transform="translate(195, 35)">
              <ellipse cx="0" cy="0" rx="28" ry="8" fill="url(#rotorBlur)" className="animate-rotor origin-center opacity-80" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
            </g>

            {/* Rear-Left Rotor */}
            <g transform="translate(45, 105)">
              <ellipse cx="0" cy="0" rx="28" ry="8" fill="url(#rotorBlur)" className="animate-rotor origin-center opacity-80" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
            </g>

            {/* Rear-Right Rotor */}
            <g transform="translate(195, 105)">
              <ellipse cx="0" cy="0" rx="28" ry="8" fill="url(#rotorBlur)" className="animate-rotor origin-center opacity-80" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
            </g>

            {/* Strobe Navigation Lights */}
            {/* Left: RED */}
            <circle cx="28" cy="35" r="4.5" fill="#ef4444" className="animate-ping" />
            <circle cx="28" cy="35" r="3" fill="#f87171" />

            {/* Right: GREEN */}
            <circle cx="212" cy="35" r="4.5" fill="#22c55e" className="animate-ping" />
            <circle cx="212" cy="35" r="3" fill="#4ade80" />

            {/* Tail: WHITE strobe */}
            <circle cx="120" cy="88" r="3.5" fill="#ffffff" className="animate-pulse" />

            {/* Underbelly 4K Gimbal Camera & LiDAR Pod */}
            <circle cx="120" cy="74" r="9" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="120" cy="74" r="5" fill="#06b6d4" className="animate-pulse" />
          </svg>
        </div>

        {/* Downward Conical Laser / LiDAR Scan Beam */}
        <div className="relative -mt-6 w-72 h-44 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 260 160" className="w-full h-full overflow-visible animate-laser">
            <defs>
              <linearGradient id="scanBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.85)" />
                <stop offset="35%" stopColor="rgba(14,165,233,0.35)" />
                <stop offset="85%" stopColor="rgba(16,185,129,0.2)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.6)" />
              </linearGradient>
            </defs>

            {/* Conical Polygon Beam */}
            <polygon 
              points="130,0 20,150 240,150" 
              fill="url(#scanBeamGrad)" 
            />

            {/* Laser Scan Grid Lines */}
            <line x1="40" y1="130" x2="220" y2="130" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 3" opacity="0.7" />
            <line x1="60" y1="100" x2="200" y2="100" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
            <line x1="80" y1="70" x2="180" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

            {/* Sweeping Center Laser Beam */}
            <line x1="130" y1="0" x2="130" y2="150" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.9" />
          </svg>
        </div>

        {/* Ground Radar Target Footprint */}
        <div className="relative -mt-10 flex flex-col items-center justify-center">
          <div className="relative w-44 h-16 flex items-center justify-center">
            {/* Expanding Pulsing Radar Rings */}
            <div className="absolute inset-0 rounded-[100%] border border-cyan-400/80 animate-radar"></div>
            <div className="absolute inset-2 rounded-[100%] border border-emerald-400/60 animate-radar [animation-delay:0.7s]"></div>
            
            {/* Ground Reticle Ellipse */}
            <div className="w-36 h-10 rounded-[100%] border border-cyan-400 bg-cyan-500/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
              <Crosshair className="w-5 h-5 text-emerald-300 animate-spin [animation-duration:12s]" />
            </div>
          </div>

          {/* Coordinates HUD readout */}
          <div className="mt-1 px-3 py-1 rounded-md bg-slate-950/80 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>TARGET: 20.2961°N, 85.8245°E • 3D CADASTRE SCAN</span>
          </div>
        </div>
      </div>

      {/* Sensor Mode Switcher Pills */}
      <div className="mt-6 flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
        {(['LiDAR', 'Photogrammetry', 'Thermal'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setScanMode(mode)}
            className={`px-3 py-1 rounded-lg transition-all ${
              scanMode === mode 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
