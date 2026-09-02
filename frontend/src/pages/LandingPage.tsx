import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgCityAerial from '../assets/bg-city-aerial.jpg';
import heroBg from '../assets/hero-bg.webp';
import bgGisCadastral from '../assets/bg-gis-cadastral.jpg';
import bgBlueprint from '../assets/bg-blueprint.png';

const backgrounds = [
  { url: bgCityAerial, name: 'Aerial Metropolis' },
  { url: heroBg, name: '3D Drone City' },
  { url: bgGisCadastral, name: '3D GIS Cadastral Grid' },
  { url: bgBlueprint, name: 'Architectural Blueprint' },
];

export default function LandingPage() {
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-cycle backgrounds every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-950 font-sans select-none">
      {/* ── Background Crossfade Slideshow ── */}
      {backgrounds.map((bg, idx) => (
        <div
          key={bg.name}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            bgIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url(${bg.url})`,
            transition: 'opacity 1s ease-in-out, transform 8s ease-out',
          }}
        />
      ))}

      {/* Atmospheric Dim overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] pointer-events-none" />

      {/* ── Animated 3D LiDAR Point Cloud Falling ── */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => (
          <span
            key={i}
            className="scan-dot"
            style={{
              left: `${(i * 2.2 + 1)}%`,
              animationDelay: `${(i % 7) * 0.6}s`,
              animationDuration: `${2.2 + (i % 5) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Intense Glowing Cadastral LiDAR Scan Line (as shown in user photo) ── */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="cinematic-scan-bar">
          <div className="scan-flare-center" />
          <div className="scan-laser-glow" />
        </div>
      </div>

      {/* ── Autonomous Survey Drone with Wide Volumetric LiDAR Laser Cone ── */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="drone-container">
          {/* Detailed Drone SVG */}
          <div className="relative flex flex-col items-center">
            <svg width="110" height="55" viewBox="0 0 110 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]">
              {/* Carbon Fiber Arms */}
              <line x1="22" y1="25" x2="55" y2="25" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <line x1="88" y1="25" x2="55" y2="25" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="31" x2="55" y2="31" stroke="#64748b" strokeWidth="2.5" />
              <line x1="76" y1="31" x2="55" y2="31" stroke="#64748b" strokeWidth="2.5" />

              {/* Central Fuselage Chassis */}
              <ellipse cx="55" cy="27" rx="18" ry="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
              <path d="M 42,23 Q 55,18 68,23 L 65,30 Q 55,33 45,30 Z" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />

              {/* Top GPS Antenna */}
              <circle cx="55" cy="21" r="3" fill="#38bdf8" className="drone-blink" />

              {/* 4 High-Speed Spinning Propellers */}
              <ellipse cx="18" cy="22" rx="16" ry="4.5" fill="rgba(56,189,248,0.5)" className="rotor origin-center" />
              <ellipse cx="92" cy="22" rx="16" ry="4.5" fill="rgba(56,189,248,0.5)" className="rotor origin-center" />
              <ellipse cx="30" cy="30" rx="12" ry="3.5" fill="rgba(14,165,233,0.4)" className="rotor rotor-rear origin-center" />
              <ellipse cx="80" cy="30" rx="12" ry="3.5" fill="rgba(14,165,233,0.4)" className="rotor rotor-rear origin-center" />

              {/* Strobe Navigation Beacons */}
              {/* Left Wingtip: RED */}
              <circle cx="18" cy="22" r="3.5" fill="#ef4444" className="drone-blink" />
              <circle cx="18" cy="22" r="1.5" fill="#ffffff" />

              {/* Right Wingtip: GREEN */}
              <circle cx="92" cy="22" r="3.5" fill="#22c55e" className="drone-blink" />
              <circle cx="92" cy="22" r="1.5" fill="#ffffff" />

              {/* Underbelly LiDAR Optical Gimbal */}
              <circle cx="55" cy="31" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="55" cy="31" r="3" fill="#e0f2fe" className="drone-blink" />

              {/* Landing Skids */}
              <line x1="42" y1="36" x2="38" y2="44" stroke="#94a3b8" strokeWidth="2" />
              <line x1="68" y1="36" x2="72" y2="44" stroke="#94a3b8" strokeWidth="2" />
              <line x1="32" y1="44" x2="46" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="64" y1="44" x2="78" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* ── Volumetric Conical LiDAR Laser Projection Beam ── */}
            <div className="drone-volumetric-lidar">
              <svg viewBox="0 0 300 400" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="volumetricBeam" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.9" />
                    <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="coreBeam" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Wide Expanding Conical Light Cone */}
                <polygon points="150,0 20,400 280,400" fill="url(#volumetricBeam)" />

                {/* Concentrated Intense Center Laser Beam */}
                <polygon points="150,0 120,400 180,400" fill="url(#coreBeam)" opacity="0.85" />

                {/* Angled Sweeping LiDAR Scan Line Rakes */}
                <line x1="150" y1="0" x2="70" y2="400" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.65" />
                <line x1="150" y1="0" x2="150" y2="400" stroke="#e0f2fe" strokeWidth="2" opacity="0.9" />
                <line x1="150" y1="0" x2="230" y2="400" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.65" />

                {/* Horizontal Depth Slices */}
                <ellipse cx="150" cy="120" rx="40" ry="8" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <ellipse cx="150" cy="240" rx="75" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.6" />
                <ellipse cx="150" cy="360" rx="110" ry="20" fill="none" stroke="#00f2fe" strokeWidth="1.8" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Centered Content ── */}
      <div className="relative z-30 flex h-full w-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="hero-title mb-4 text-5xl font-black tracking-tight md:text-7xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          3D-ULPIN
        </h1>
        <p className="hero-subtitle mb-8 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Unique Land Parcel Identification Number — Smart Urban Planning with 3D<br className="hidden sm:inline" /> Cadastral Visualization
        </p>

        {/* Continue Button */}
        <div className="hero-buttons">
          <button
            onClick={handleContinue}
            className="cursor-pointer rounded-2xl bg-blue-600 px-11 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/35 transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95 flex items-center gap-2 ring-1 ring-blue-400/40"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* ── Background Switcher Pills (Bottom-Right) ── */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3.5 py-2 backdrop-blur-md">
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mr-1 hidden sm:inline">
          Background:
        </span>
        {backgrounds.map((bg, idx) => (
          <button
            key={bg.name}
            onClick={() => setBgIndex(idx)}
            title={bg.name}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              bgIndex === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <style>{`
        /* ── 3D Scan Dots ── */
        .scan-dot {
          position: absolute;
          top: -10px;
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: #00f2fe;
          box-shadow: 0 0 8px 2px rgba(0,242,254,0.7);
          animation: fall linear infinite;
          opacity: 0;
        }

        @keyframes fall {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* ── Full-Screen Luminous LiDAR Laser Sweep Bar (Matches User Photo) ── */
        .cinematic-scan-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent 0%, #00f2fe 20%, #ffffff 50%, #00f2fe 80%, transparent 100%);
          box-shadow: 
            0 0 15px 3px #00f2fe,
            0 0 35px 8px rgba(56, 189, 248, 0.7),
            0 0 70px 16px rgba(59, 130, 246, 0.4);
          transform: rotate(-1.5deg) scaleX(1.05);
          animation: scanDownSweep 6s ease-in-out infinite;
        }

        .scan-flare-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 320px;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(0,242,254,0.6) 45%, transparent 80%);
          filter: blur(2px);
        }

        .scan-laser-glow {
          position: absolute;
          inset: -12px 0;
          background: linear-gradient(90deg, transparent 5%, rgba(0,242,254,0.3) 40%, rgba(0,242,254,0.3) 60%, transparent 95%);
          filter: blur(6px);
        }

        @keyframes scanDownSweep {
          0%   { top: -10%; opacity: 0; }
          10%  { opacity: 0.9; }
          50%  { opacity: 1; }
          90%  { opacity: 0.9; }
          100% { top: 110%; opacity: 0; }
        }

        /* ── Drone Container & Flight Patrol Across Screen ── */
        .drone-container {
          position: absolute;
          top: 10%;
          animation: droneFlyAcross 14s ease-in-out infinite;
        }

        @keyframes droneFlyAcross {
          0%   { left: -140px; top: 11%; transform: rotate(3deg); }
          25%  { left: 26%;    top: 7%;  transform: rotate(-2deg); }
          50%  { left: 52%;    top: 14%; transform: rotate(3.5deg); }
          75%  { left: 78%;    top: 8%;  transform: rotate(-2.5deg); }
          100% { left: 112%;   top: 11%; transform: rotate(3deg); }
        }

        /* ── High-Speed Rotor Spin ── */
        .rotor {
          animation: spinFast 0.12s linear infinite;
        }
        .rotor-rear {
          animation: spinFast 0.12s linear infinite reverse;
        }

        @keyframes spinFast {
          0%   { opacity: 0.25; transform: scaleX(1); }
          50%  { opacity: 0.7; transform: scaleX(0.7); }
          100% { opacity: 0.25; transform: scaleX(1); }
        }

        /* ── Drone Strobe Beacon Blink ── */
        .drone-blink {
          animation: strobeBlink 0.9s ease-in-out infinite;
        }

        @keyframes strobeBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }

        /* ── Volumetric LiDAR Laser Cone Emanating Down From Drone ── */
        .drone-volumetric-lidar {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 380px;
          pointer-events-none;
          animation: lidarBeamPulse 2s ease-in-out infinite;
        }

        @keyframes lidarBeamPulse {
          0%, 100% {
            opacity: 0.75;
            transform: translateX(-50%) scaleX(0.95);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1.15);
          }
        }

        /* ── Hero Fade-in ── */
        .hero-title {
          animation: fadeUp 1s ease-out both;
        }
        .hero-subtitle {
          animation: fadeUp 1s ease-out 0.3s both;
        }
        .hero-buttons {
          animation: fadeUp 1s ease-out 0.6s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
