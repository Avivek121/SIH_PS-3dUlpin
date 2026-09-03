import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useThemeStore } from '../../store/themeStore';
import { ChevronLeft, ChevronRight, MapPin, Eye } from 'lucide-react';
import bgModernFacade from '../../assets/bg-modern-facade.jpg';
import bgGoogleEarth from '../../assets/bg-google-earth.jpg';
import bgCityStadium from '../../assets/bg-city-stadium.jpg';
import bgCityNova from '../../assets/bg-city-nova.jpg';
import bgCityAerial from '../../assets/bg-city-aerial.jpg';
import bgGisCadastral from '../../assets/bg-gis-cadastral.jpg';
import heroBg from '../../assets/hero-bg.webp';

const DASHBOARD_BACKGROUNDS = [
  { url: bgModernFacade, name: 'Modern Architectural High-Rise Facade' },
  { url: bgGoogleEarth, name: 'Google Earth 3D Photogrammetry' },
  { url: bgCityStadium, name: '3D City & Stadium Complex' },
  { url: bgCityNova, name: 'Futuristic High-Rise Aerial (NOVA)' },
  { url: bgGisCadastral, name: 'Bhubaneswar 3D GIS Cadastral' },
  { url: bgCityAerial, name: 'Aerial Metropolis' },
  { url: heroBg, name: 'LiDAR Drone Survey Grid' },
];

export default function DashboardLayout() {
  const [bgIndex, setBgIndex] = useState(0);
  const location = useLocation();
  const { theme } = useThemeStore();

  // Don't show the background image on 3D Map or LiDAR pages where WebGL canvas needs pure black
  const isDedicated3DPage = location.pathname === '/map' || location.pathname === '/lidar';

  // Auto-slide backgrounds every 8 seconds
  useEffect(() => {
    if (isDedicated3DPage) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % DASHBOARD_BACKGROUNDS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isDedicated3DPage]);

  const handlePrevBg = () => {
    setBgIndex((prev) => (prev - 1 + DASHBOARD_BACKGROUNDS.length) % DASHBOARD_BACKGROUNDS.length);
  };

  const handleNextBg = () => {
    setBgIndex((prev) => (prev + 1) % DASHBOARD_BACKGROUNDS.length);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-slate-100'
    } font-sans relative transition-colors duration-300`}>
      {/* ── Dynamic Sliding 3D City & Google Earth Background Carousel ── */}
      {!isDedicated3DPage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {DASHBOARD_BACKGROUNDS.map((bg, idx) => {
            const offset = idx - bgIndex;
            return (
              <div
                key={bg.name}
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${bg.url})`,
                  transform: `translateX(${offset * 100}%)`,
                  opacity: Math.abs(offset) > 1 ? 0 : (theme === 'light' ? 0.55 : 0.65),
                }}
              />
            );
          })}
          {/* Lighter, Airier Contrast Overlay so image & cards look clean */}
          <div className={`absolute inset-0 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-slate-100/60 via-slate-100/75 to-slate-200/85 backdrop-blur-[1px]'
              : 'bg-gradient-to-b from-slate-900/40 via-slate-900/55 to-slate-950/70 backdrop-blur-[1px]'
          }`} />
        </div>
      )}

      {/* Sidebar */}
      <div className="relative z-20 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <Outlet />

          {/* ── Floating Background Switcher Pill Controls (Bottom Right) ── */}
          {!isDedicated3DPage && (
            <div className={`fixed bottom-4 right-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl text-xs font-mono transition-all ${
              theme === 'light'
                ? 'bg-white/90 border-slate-300 text-slate-800 shadow-slate-300/50'
                : 'bg-slate-900/90 border-slate-700/80 text-cyan-300 shadow-black/60'
            }`}>
              <button
                onClick={handlePrevBg}
                title="Previous 3D Background"
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  theme === 'light' ? 'text-slate-600 hover:text-black hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-1 ${
                theme === 'light' ? 'text-blue-600' : 'text-cyan-300'
              }`}>
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span className="max-w-[160px] truncate">{DASHBOARD_BACKGROUNDS[bgIndex].name}</span>
              </div>

              <button
                onClick={handleNextBg}
                title="Next 3D Background"
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  theme === 'light' ? 'text-slate-600 hover:text-black hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Dot Indicators */}
              <div className={`flex items-center gap-1 pl-1 border-l ${
                theme === 'light' ? 'border-slate-300' : 'border-slate-700/80'
              }`}>
                {DASHBOARD_BACKGROUNDS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBgIndex(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      bgIndex === i 
                        ? (theme === 'light' ? 'w-4 bg-blue-600' : 'w-4 bg-cyan-400')
                        : (theme === 'light' ? 'w-1.5 bg-slate-400 hover:bg-slate-600' : 'w-1.5 bg-slate-600 hover:bg-slate-400')
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
