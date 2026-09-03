import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, QrCode, CheckCircle2, AlertTriangle, Building2, 
  Map, HardDrive, Brain, FileDigit, ArrowRight, ShieldCheck, 
  Sparkles, Clock, Bell, RefreshCw, Eye, Plus
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { DashboardStats, Notification } from '../types';
import { useThemeStore } from '../store/themeStore';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, t } = useThemeStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, nData] = await Promise.all([
        dashboardApi.getStatistics().catch(() => null),
        dashboardApi.getNotifications().catch(() => [])
      ]);
      if (sData) setStats(sData);
      if (nData) setNotifications(nData);
    } finally {
      setLoading(false);
    }
  };

  const cardBase = theme === 'light'
    ? 'bg-white/85 border-slate-200/90 shadow-md backdrop-blur-xl text-slate-800'
    : 'bg-slate-900/75 border-slate-700/60 shadow-xl backdrop-blur-xl text-slate-100';

  const headingColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const subtextColor = theme === 'light' ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-300">
      {/* Welcome Banner */}
      <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl ${
        theme === 'light'
          ? 'bg-gradient-to-r from-blue-50/90 via-white/95 to-indigo-50/90 border-blue-200/80 text-slate-800'
          : 'bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 border-cyan-500/30 text-white'
      }`}>
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" /> LIMITS 3D Spatial Intelligence
          </div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>
            {t('welcomeTitle')}
          </h1>
          <p className={`text-sm max-w-xl leading-relaxed ${subtextColor}`}>
            {t('welcomeDesc')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button 
            onClick={() => navigate('/map')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Map className="w-4 h-4" /> {t('openMap')}
          </button>
          <button 
            onClick={() => navigate('/explorer?building=B03')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-500" /> {t('verticalExplorer')}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={`p-5 rounded-2xl border transition-all ${cardBase}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${subtextColor}`}>{t('totalUlpins')}</div>
              <div className={`text-3xl font-black mt-1 ${headingColor}`}>{stats?.total_ulpins || 179}</div>
            </div>
            <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className={`mt-3 text-xs font-medium ${subtextColor}`}>Bhubaneswar Ward 12 Zone</div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${cardBase}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${subtextColor}`}>{t('verifiedClean')}</div>
              <div className="text-3xl font-black text-emerald-500 mt-1">{stats?.registered || 142}</div>
            </div>
            <div className="p-2.5 bg-emerald-600/10 text-emerald-500 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-500 font-medium">LiDAR 3D Volume Matched</div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${cardBase}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${subtextColor}`}>{t('flaggedEncroachments')}</div>
              <div className="text-3xl font-black text-red-500 mt-1">{stats?.flagged || 14}</div>
            </div>
            <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-red-500 font-medium">Violations Detected</div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${cardBase}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${subtextColor}`}>{t('digitalTwinCoverage')}</div>
              <div className="text-3xl font-black text-indigo-500 mt-1">100%</div>
            </div>
            <div className="p-2.5 bg-indigo-600/10 text-indigo-500 rounded-xl border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-500 font-medium">8 Buildings • 52 Floors</div>
        </div>
      </div>

      {/* Quick Action Launchpad */}
      <div className="space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${subtextColor}`}>{t('quickNav')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: t('map3d'), desc: 'Interactive digital twin globe', icon: Map, path: '/map', color: 'text-blue-500' },
            { title: '+ Add New Register', desc: 'Register new property to cadastral ledger', icon: Plus, path: '/registry?action=new', color: 'text-emerald-500' },
            { title: t('verticalExplorer'), desc: 'Exploded multi-floor building view', icon: Building2, path: '/explorer', color: 'text-purple-500' },
            { title: t('generateUlpin'), desc: 'Synthesize 18-digit identifier', icon: FileDigit, path: '/generate-ulpin', color: 'text-cyan-500' },
          ].map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-0.5 flex items-center justify-between ${cardBase}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border group-hover:scale-110 transition-transform ${
                  theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div>
                  <h4 className={`text-xs font-bold transition-colors group-hover:text-blue-500 ${headingColor}`}>{action.title}</h4>
                  <p className={`text-[11px] ${subtextColor}`}>{action.desc}</p>
                </div>
              </div>
              <ArrowRight className={`w-4 h-4 transition-colors group-hover:translate-x-1 ${
                theme === 'light' ? 'text-slate-400 group-hover:text-slate-800' : 'text-slate-600 group-hover:text-white'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Mini 3D Map & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mini 3D Digital Twin Card */}
        <div className={`lg:col-span-7 rounded-2xl border p-6 space-y-4 flex flex-col justify-between ${cardBase}`}>
          <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${headingColor}`}>
                <Map className="w-4 h-4 text-blue-500" /> {t('activeTitle')}
              </h3>
              <p className={`text-xs ${subtextColor}`}>Centimeter-accurate 3D building models & cadastral parcels</p>
            </div>
            <button 
              onClick={() => navigate('/map')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              Launch Full Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/map')}
            className={`h-48 rounded-xl border relative overflow-hidden cursor-pointer group flex items-center justify-center ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800/80'
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            <div className="relative z-10 text-center space-y-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
              <div className={`text-xs font-bold ${headingColor}`}>Click to Orbit 3D Cadastral Globe</div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                theme === 'light' ? 'bg-white text-slate-600 border-slate-300' : 'bg-slate-900/80 text-slate-400 border-slate-700'
              }`}>
                8 Buildings Active
              </span>
            </div>
          </div>
        </div>

        {/* Live System Notifications */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-4 ${cardBase}`}>
          <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${headingColor}`}>
              <Bell className="w-4 h-4 text-blue-500" /> {t('cadastralFeed')}
            </h3>
            <span className="text-[10px] font-mono text-emerald-500">Real-time</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'New 3D ULPIN Issued', desc: 'OD-BBSR-W12-P002-B03-F04-U02 mapped to Rajesh Patel', time: '10m ago', color: 'text-blue-500' },
              { title: 'AI Encroachment Flagged', desc: 'Building B04 height exceeds approved sanction by +0.9m', time: '1h ago', color: 'text-red-500' },
              { title: 'LiDAR Survey Ingested', desc: 'Agisoft Metashape 148M point cloud processed successfully', time: '2h ago', color: 'text-emerald-500' },
            ].map((n, idx) => (
              <div key={idx} className={`p-3 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                theme === 'light' ? 'bg-slate-50 border-slate-200/80 hover:bg-slate-100' : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-xs ${n.color}`}>{n.title}</span>
                  <span className={`text-[10px] font-mono ${subtextColor}`}>{n.time}</span>
                </div>
                <p className={`text-[11px] ${subtextColor}`}>{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
