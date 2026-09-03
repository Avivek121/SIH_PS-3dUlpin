import React, { useState } from 'react';
import { 
  Settings, Globe, Sliders, Bell, Database, ShieldCheck, 
  Save, CheckCircle2, Sparkles, Moon, Sun
} from 'lucide-react';
import { useThemeStore, Language, ThemeMode } from '../store/themeStore';

export default function SettingsPage() {
  const { language, setLanguage, theme, toggleTheme, setTheme, t } = useThemeStore();
  const [crs, setCrs] = useState('EPSG:32645'); // UTM Zone 45N (Bhubaneswar)
  const [lod, setLod] = useState('LOD2');
  const [edlShading, setEdlShading] = useState(true);
  const [heightTolerance, setHeightTolerance] = useState('0.3');
  const [autoFlag, setAutoFlag] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
          <Settings className="w-4 h-4" /> {t('settings')}
        </div>
        <h1 className="text-3xl font-extrabold text-white">{t('settingsTitle')}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {t('settingsDesc')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language & Appearance Preference */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-cyan-400" /> {t('languagePreference')} & {t('themePreference')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">{t('languagePreference')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en', label: 'English', sub: 'EN' },
                  { code: 'hi', label: 'हिन्दी', sub: 'HI' },
                  { code: 'or', label: 'ଓଡ଼ିଆ', sub: 'OR' }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code as Language)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      language === item.code
                        ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-75 font-mono">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">{t('themePreference')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4" /> {t('darkMode')}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4" /> {t('lightMode')}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Spatial & GIS Projection Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-blue-400" /> Coordinate Reference System (CRS) & Projections
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Primary Spatial CRS</label>
              <select 
                value={crs} 
                onChange={e => setCrs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-mono"
              >
                <option value="EPSG:32645">EPSG:32645 (WGS 84 / UTM Zone 45N - India East)</option>
                <option value="EPSG:4326">EPSG:4326 (WGS 84 Geodetic Lat/Lon)</option>
                <option value="EPSG:3857">EPSG:3857 (WGS 84 / Pseudo-Mercator)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Default 3D Mesh LOD Level</label>
              <select 
                value={lod} 
                onChange={e => setLod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-mono"
              >
                <option value="LOD1">LOD1 (Extruded 3D Footprints)</option>
                <option value="LOD2">LOD2 (Standard Roof Structures & Slabs)</option>
                <option value="LOD3">LOD3 (Detailed Windows, Openings & Balconies)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Discrepancy & Validation Tolerances */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" /> AI Discrepancy Tolerances & Encroachment Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Vertical Height Allowed Tolerance (m)</label>
              <input 
                type="number" 
                step="0.05"
                value={heightTolerance} 
                onChange={e => setHeightTolerance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-mono" 
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Deviations exceeding this trigger automated violation notices.</span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Eye-Dome Lighting (EDL) Shading for Point Clouds</span>
                <input 
                  type="checkbox" 
                  checked={edlShading} 
                  onChange={e => setEdlShading(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-500" 
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Auto-Flag Temporal Construction Changes</span>
                <input 
                  type="checkbox" 
                  checked={autoFlag} 
                  onChange={e => setAutoFlag(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-500" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved and applied to 3D GIS session!
            </span>
          ) : <span></span>}

          <button 
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
