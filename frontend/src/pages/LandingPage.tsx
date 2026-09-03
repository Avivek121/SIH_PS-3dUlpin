import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import bgCityStadium from '../assets/bg-city-stadium.jpg';
import bgGoogleEarth from '../assets/bg-google-earth.jpg';
import bgCityNova from '../assets/bg-city-nova.jpg';
import bgCityAerial from '../assets/bg-city-aerial.jpg';
import heroBg from '../assets/hero-bg.webp';
import bgGisCadastral from '../assets/bg-gis-cadastral.jpg';

const backgrounds = [
  { url: bgCityStadium, name: '3D City & Stadium Complex' },
  { url: bgGoogleEarth, name: 'Google Earth 3D Photogrammetry' },
  { url: bgCityNova, name: 'Futuristic High-Rise Aerial' },
  { url: bgCityAerial, name: 'Aerial Metropolis' },
  { url: heroBg, name: '3D Drone Survey Grid' },
  { url: bgGisCadastral, name: '3D GIS Cadastral Map' },
];

export default function LandingPage() {
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide backgrounds every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setBgIndex((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
  };

  const handleNextSlide = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-950 font-sans select-none">
      {/* ── True Horizontal Sliding Background Carousel ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {backgrounds.map((bg, idx) => {
          const offset = idx - bgIndex;
          return (
            <div
              key={bg.name}
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${bg.url})`,
                transform: `translateX(${offset * 100}%)`,
                opacity: Math.abs(offset) > 1 ? 0 : 1,
              }}
            />
          );
        })}
      </div>

      {/* Atmospheric Dim Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px] pointer-events-none" />

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

      {/* ── Intense Glowing Cadastral LiDAR Scan Line ── */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="cinematic-scan-bar">
          <div className="scan-flare-center" />
          <div className="scan-laser-glow" />
        </div>
      </div>

      {/* ── High-Detail Animated Survey Quadcopter with Volumetric Conical LiDAR ── */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="drone-container">
          <div className="relative">
            {/* Detailed Drone SVG */}
            <svg
              width="140"
              height="70"
              viewBox="0 0 140 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]"
            >
              {/* Carbon Fiber Arms */}
              <line x1="28" y1="30" x2="70" y2="30" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="112" y1="30" x2="70" y2="30" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="45" y1="38" x2="70" y2="38" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="95" y1="38" x2="70" y2="38" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

              {/* Landing Skids */}
              <path d="M52 46 L46 58 L32 58" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M88 46 L94 58 L108 58" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Central Drone Chassis */}
              <ellipse cx="70" cy="33" rx="22" ry="11" fill="#0f172a" stroke="#00f2fe" strokeWidth="2" />
              <ellipse cx="70" cy="33" rx="14" ry="7" fill="#1e293b" />

              {/* Top GPS Antenna Dome */}
              <circle cx="70" cy="24" r="4.5" fill="#38bdf8" />
              <circle cx="70" cy="24" r="2" fill="#ffffff" />

              {/* Spinning Rotor Blur Disks */}
              <ellipse cx="22" cy="28" rx="20" ry="5.5" fill="rgba(56,189,248,0.4)" className="rotor origin-center" />
              <ellipse cx="118" cy="28" rx="20" ry="5.5" fill="rgba(56,189,248,0.4)" className="rotor origin-center" />
              <ellipse cx="40" cy="38" rx="15" ry="4.5" fill="rgba(14,165,233,0.35)" className="rotor-rear origin-center" />
              <ellipse cx="100" cy="38" rx="15" ry="4.5" fill="rgba(14,165,233,0.35)" className="rotor-rear origin-center" />

              {/* Motor Pods */}
              <circle cx="22" cy="28" r="3.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="118" cy="28" r="3.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="40" cy="38" r="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="100" cy="38" r="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

              {/* Aviation Navigation Strobes */}
              <circle cx="22" cy="28" r="3" fill="#ef4444" className="drone-blink" />
              <circle cx="118" cy="28" r="3" fill="#22c55e" className="drone-blink" />

              {/* High-Res LiDAR Gimbal Sensor */}
              <rect x="65" y="40" width="10" height="7" rx="2" fill="#0284c7" />
              <circle cx="70" cy="45" r="4" fill="#00f2fe" className="strobe-white" />
            </svg>

            {/* Downward Projecting Volumetric Conical LiDAR Laser Projection Beam */}
            <div className="drone-volumetric-lidar">
              <svg viewBox="0 0 320 450" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="lidarGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.95" />
                    <stop offset="15%" stopColor="#38bdf8" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.35" />
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="coreBeam" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="40%" stopColor="#00f2fe" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polygon points="160,0 10,450 310,450" fill="url(#lidarGrad)" />
                <polygon points="160,0 130,450 190,450" fill="url(#coreBeam)" opacity="0.85" />
                <line x1="160" y1="0" x2="60" y2="450" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
                <line x1="160" y1="0" x2="160" y2="450" stroke="#e0f2fe" strokeWidth="2" opacity="0.9" />
                <line x1="160" y1="0" x2="260" y2="450" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />

                <ellipse cx="160" cy="180" rx="45" ry="7" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <ellipse cx="160" cy="300" rx="75" ry="11" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
                <ellipse cx="160" cy="445" rx="145" ry="18" fill="none" stroke="#00f2fe" strokeWidth="2" opacity="0.8" />
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

      {/* ── Left / Right Sliding Controls ── */}
      <button
        onClick={handlePrevSlide}
        aria-label="Previous Background Slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer hidden sm:flex items-center justify-center shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNextSlide}
        aria-label="Next Background Slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer hidden sm:flex items-center justify-center shadow-2xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ── Active Background Name Badge & Sliding Dots (Bottom-Center) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] text-cyan-300 font-medium backdrop-blur-md shadow-lg">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{backgrounds[bgIndex].name}</span>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
          {backgrounds.map((bg, idx) => (
            <button
              key={bg.name}
              onClick={() => setBgIndex(idx)}
              title={bg.name}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                bgIndex === idx ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
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

        /* ── Full-Screen Luminous LiDAR Laser Sweep Bar ── */
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
          0%   { left: -140px; top: 12%; transform: rotate(3deg); }
          25%  { left: 25%;   top: 7%;  transform: rotate(-1.5deg); }
          50%  { left: 52%;   top: 14%; transform: rotate(3.5deg); }
          75%  { left: 80%;   top: 8%;  transform: rotate(-2deg); }
          100% { left: 110%;  top: 12%; transform: rotate(3deg); }
        }

        /* ── Spinning Rotors ── */
        .rotor {
          animation: spinFast 0.12s linear infinite;
        }
        .rotor-rear {
          animation: spinFast 0.12s linear infinite reverse;
        }

        @keyframes spinFast {
          0%   { opacity: 0.3; transform: scaleX(1); }
          50%  { opacity: 0.8; transform: scaleX(0.7); }
          100% { opacity: 0.3; transform: scaleX(1); }
        }

        /* ── Drone Strobe Beacons ── */
        .drone-blink {
          animation: strobeBlink 0.9s ease-in-out infinite;
        }
        .strobe-white {
          animation: strobeBlink 0.45s ease-in-out infinite;
        }

        @keyframes strobeBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.2; transform: scale(0.85); }
        }

        /* ── Volumetric LiDAR Projection Cone Pulsing ── */
        .drone-volumetric-lidar {
          position: absolute;
          top: 45px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 450px;
          pointer-events-none;
          animation: lidarBeamPulse 2.2s ease-in-out infinite;
        }

        @keyframes lidarBeamPulse {
          0%, 100% {
            opacity: 0.8;
            transform: translateX(-50%) scaleX(0.95);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1.18);
          }
        }
      `}</style>
    </div>
  );
}
