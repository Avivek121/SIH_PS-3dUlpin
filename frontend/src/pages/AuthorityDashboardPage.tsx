import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { 
  LayoutDashboard, ShieldAlert, CheckCircle2, AlertTriangle, Building2, 
  Layers, QrCode, TrendingUp, Download, Eye, FileText, ArrowUpRight,
  Filter, Calendar, MapPin, Sparkles, RefreshCw
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { DashboardStats } from '../types';

const WARD_DATA = [
  { name: 'Ward 12 (Saheed Nagar)', properties: 48, verified: 42, flagged: 6 },
  { name: 'Ward 14 (Jaydev Vihar)', properties: 38, verified: 34, flagged: 4 },
  { name: 'Ward 08 (Nayapalli)', properties: 32, verified: 30, flagged: 2 },
  { name: 'Ward 22 (Patia Tech)', properties: 42, verified: 39, flagged: 3 },
  { name: 'Ward 05 (Old Town)', properties: 28, verified: 23, flagged: 5 },
];

const STATUS_DISTRIBUTION = [
  { name: 'Registered & Verified', value: 142, color: '#10b981' },
  { name: 'Pending Validation', value: 22, color: '#f59e0b' },
  { name: 'Flagged Encroachments', value: 14, color: '#ef4444' },
  { name: 'In AI Reconstruction', value: 8, color: '#3b82f6' },
];

const MONTHLY_TREND = [
  { month: 'Oct 2025', registered: 45, validated: 40, violations: 3 },
  { month: 'Nov 2025', registered: 78, validated: 72, violations: 5 },
  { month: 'Dec 2025', registered: 110, validated: 98, violations: 8 },
  { month: 'Jan 2026', registered: 142, validated: 130, violations: 11 },
  { month: 'Feb 2026', registered: 178, validated: 165, violations: 14 },
];

const RECENT_VIOLATIONS = [
  { id: 'v1', ulpin: 'OD-BBSR-W12-P002-B04-F05-U01', type: 'Vertical Height Violation', severity: 'Critical', deviation: '+1.2m above sanction', owner: 'Vihar Commercial Ltd', date: '2026-02-28' },
  { id: 'v2', ulpin: 'OD-BBSR-W12-P001-B02-F06-U03', type: 'Unauthorized Rooftop Addition', severity: 'High', deviation: '+45 sq.m covered shed', owner: 'Nagar Heights HOA', date: '2026-02-25' },
  { id: 'v3', ulpin: 'OD-BBSR-W12-P003-B05-F03-U02', type: 'Front Setback Encroachment', severity: 'Moderate', deviation: '-0.8m margin reduction', owner: 'Ranjan Barik', date: '2026-02-20' },
  { id: 'v4', ulpin: 'OD-BBSR-W12-P004-B07-F07-U01', type: 'Commercial Use in Residential', severity: 'High', deviation: 'Zone mismatch', owner: 'CSP Mixed Holdings', date: '2026-02-18' },
];

export default function AuthorityDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getStatistics();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <LayoutDashboard className="w-4 h-4" /> Smart Governance & Municipal Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-white">Municipal Authority Command Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time cadastral intelligence, 3D ULPIN registry coverage, and AI spatial violation monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadStats}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Metrics
          </button>
          <button 
            onClick={() => navigate('/validation')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
          >
            <ShieldAlert className="w-4 h-4" /> Spatial Audit Console
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total 3D ULPINs</div>
              <div className="text-3xl font-black text-white mt-1">{stats?.total_ulpins || 178}</div>
            </div>
            <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +24% from last month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified & Clean</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{stats?.registered || 142}</div>
            </div>
            <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-medium">
            79.8% compliance rate across 5 wards
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Flagged Violations</div>
              <div className="text-3xl font-black text-red-400 mt-1">{stats?.flagged || 14}</div>
            </div>
            <div className="p-2.5 bg-red-600/10 text-red-400 rounded-xl border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-red-400 font-medium">
            4 critical notices issued
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">3D Buildings & Floors</div>
              <div className="text-3xl font-black text-indigo-300 mt-1">
                {stats?.total_buildings || 8} <span className="text-lg font-normal text-slate-400">/ 52 Flrs</span>
              </div>
            </div>
            <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-400 font-medium">
            100% LOD2 mesh generation
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Distribution Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">3D Properties Mapped per Smart Ward</h3>
              <p className="text-xs text-slate-400 mt-0.5">Physical properties surveyed vs AI validated</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">Bhubaneswar Ward 12</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="properties" name="Total Properties" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="verified" name="Verified 3D ULPINs" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="flagged" name="Encroachment Flags" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white">Registry Status Ratio</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DISTRIBUTION}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {STATUS_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {STATUS_DISTRIBUTION.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-300">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Area Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white">Monthly 3D ULPIN Issuance & AI Spatial Validations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cumulative progress since project onboarding</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            +395% Growth Rate
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="registered" name="Registered Properties" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReg)" strokeWidth={2} />
              <Area type="monotone" dataKey="validated" name="AI Validated" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Spatial Violations Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Recent Spatial Discrepancies & Encroachments
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Properties flagged by LiDAR and drone diff comparison</p>
          </div>
          <button 
            onClick={() => navigate('/flagged')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Flagged ({stats?.flagged || 14}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">3D ULPIN</th>
                <th className="px-4 py-3">Violation Type</th>
                <th className="px-4 py-3">Deviation</th>
                <th className="px-4 py-3">Owner Name</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {RECENT_VIOLATIONS.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-blue-400 font-bold">{v.ulpin}</td>
                  <td className="px-4 py-3.5 text-white">{v.type}</td>
                  <td className="px-4 py-3.5 font-mono text-red-400">{v.deviation}</td>
                  <td className="px-4 py-3.5">{v.owner}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      v.severity === 'Critical' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : v.severity === 'High' 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/map?ulpin=${v.ulpin}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold"
                    >
                      Locate 3D
                    </button>
                    <button 
                      onClick={() => navigate('/validation')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
