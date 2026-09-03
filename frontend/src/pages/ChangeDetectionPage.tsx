import React, { useState, useEffect } from 'react';
import { 
  Eye, AlertTriangle, CheckCircle2, ArrowRight, Clock, 
  Sparkles, ShieldAlert, Layers, MapPin, Check, X, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useThemeStore } from '../store/themeStore';

interface ChangeItem {
  id: string;
  target: string;
  ulpin: string;
  buildingId: string;
  changeType: string;
  description: string;
  confidence: number;
  detectedDate: string;
  status: 'Pending Review' | 'Notice Issued' | 'Approved';
  beforeDate: string;
  afterDate: string;
  beforeStats: string;
  afterStats: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
}

const DEFAULT_CHANGES: ChangeItem[] = [
  {
    id: 'ch-01',
    target: 'Building B04 (Vihar Commercial)',
    ulpin: 'OD-BBSR-W12-P002-B04-F05-U01',
    buildingId: 'B04',
    changeType: 'Unauthorized Vertical Floor Construction',
    description: 'New 5th level concrete frame detected via temporal drone orthomosaic comparison. No municipal clearance found in registry.',
    confidence: 96,
    detectedDate: '2026-02-28',
    status: 'Pending Review',
    beforeDate: 'Drone Survey 2024-11',
    afterDate: 'LiDAR Survey 2026-02',
    beforeStats: '4 Floors • Height: 15.0m',
    afterStats: '5 Floors • Height: 19.1m (+4.1m)',
    severity: 'Critical'
  },
  {
    id: 'ch-02',
    target: 'Building B02 (Nagar Heights)',
    ulpin: 'OD-BBSR-W12-P001-B02-F06-U03',
    buildingId: 'B02',
    changeType: 'Rooftop Structural Modification',
    description: '45 sq.m steel truss and corrugated sheet covered rooftop installation detected above Floor 6.',
    confidence: 91,
    detectedDate: '2026-02-25',
    status: 'Notice Issued',
    beforeDate: 'Aerial Photogrammetry 2025-05',
    afterDate: 'Drone Survey 2026-02',
    beforeStats: 'Open Terrace • 0 sq.m shed',
    afterStats: 'Covered Shed • 45 sq.m',
    severity: 'Moderate'
  },
  {
    id: 'ch-03',
    target: 'Parcel P003 (Nayapalli Villa)',
    ulpin: 'OD-BBSR-W12-P003-B05-F03-U01',
    buildingId: 'B05',
    changeType: 'Front Setback Encroachment',
    description: 'Boundary wall and portico extension constructed beyond approved 3.0m road setback margin.',
    confidence: 94,
    detectedDate: '2026-02-22',
    status: 'Pending Review',
    beforeDate: 'Master Cadastre 2023-01',
    afterDate: 'LiDAR Survey 2026-02',
    beforeStats: 'Setback: 3.0m Clearance',
    afterStats: 'Setback: 2.1m (-0.9m encroached)',
    severity: 'Critical'
  },
  {
    id: 'ch-04',
    target: 'Building B06 (CSP Business)',
    ulpin: 'OD-BBSR-W12-P004-B06-F08-U04',
    buildingId: 'B06',
    changeType: 'Permitted Solar Canopy Installation',
    description: 'Rooftop photovoltaic solar panel array aligned with municipal green energy sanction permit #2025/OD/771.',
    confidence: 98,
    detectedDate: '2026-02-15',
    status: 'Approved',
    beforeDate: 'Aerial Survey 2025-08',
    afterDate: 'LiDAR Survey 2026-02',
    beforeStats: 'Bare Concrete Roof',
    afterStats: '24kW Solar Array (Approved)',
    severity: 'Minor'
  },
];

export default function ChangeDetectionPage() {
  const { t, theme } = useThemeStore();
  const [changes, setChanges] = useState<ChangeItem[]>(DEFAULT_CHANGES);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Pending' | 'Approved'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadChanges();
  }, []);

  const loadChanges = async () => {
    try {
      const res = await apiClient.get('/validation/changes');
      if (res.data && res.data.length > 0) {
        const formatted: ChangeItem[] = res.data.map((r: any, idx: number) => ({
          id: r.id || `ch-0${idx + 1}`,
          target: `Building B0${(idx % 8) + 1}`,
          ulpin: DEFAULT_CHANGES[idx % DEFAULT_CHANGES.length].ulpin,
          buildingId: `B0${(idx % 8) + 1}`,
          changeType: r.change_type || 'Temporal Spatial Change',
          description: r.description || 'Structural elevation diff detected via drone photogrammetry.',
          confidence: typeof r.confidence === 'number' ? Math.round(r.confidence * 100) : 94,
          detectedDate: r.detected_at ? r.detected_at.split('T')[0] : '2026-02-28',
          status: (r.status === 'approved' ? 'Approved' : r.status === 'notice_issued' ? 'Notice Issued' : 'Pending Review') as any,
          beforeDate: 'Baseline Cadastre',
          afterDate: 'LiDAR Survey 2026',
          beforeStats: 'Sanctioned Profile',
          afterStats: 'Detected Elevation',
          severity: idx % 2 === 0 ? 'Critical' : 'Moderate'
        }));
        setChanges(formatted);
      }
    } catch {
      // Fallback
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Approved' | 'Notice Issued') => {
    try {
      await apiClient.patch(`/validation/changes/${id}`, { status: newStatus.toLowerCase().replace(' ', '_') });
      setChanges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch {
      setChanges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const filtered = changes.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return c.severity === 'Critical';
    if (filter === 'Pending') return c.status === 'Pending Review';
    if (filter === 'Approved') return c.status === 'Approved';
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Eye className="w-4 h-4" /> {t('changeDetectionTitle')}
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('changeDetectionTitle')}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('changeDetectionDesc')}
          </p>
        </div>

        <div className="flex gap-2">
          {(['All', 'Critical', 'Pending', 'Approved'] as const).map(tab => {
            const label = tab === 'All' ? t('allTab') : tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === tab 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Change Cards Grid */}
      <div className="space-y-6">
        {filtered.map(change => (
          <div 
            key={change.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all space-y-6"
          >
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    change.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    change.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {change.severity.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-white">{change.changeType}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                  <span>{change.target}</span>
                  <span>•</span>
                  <span className="text-blue-400 font-semibold">{change.ulpin}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="text-right">
                  <div className="text-xs text-slate-400">AI Confidence</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">{change.confidence}%</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  change.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  change.status === 'Notice Issued' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {change.status}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {change.description}
            </p>

            {/* Before vs After comparison bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Before ({change.beforeDate})</div>
                <div className="text-xs font-mono font-bold text-slate-300">{change.beforeStats}</div>
              </div>
              <div className="bg-blue-950/30 p-4 rounded-2xl border border-blue-500/30 space-y-1">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">After ({change.afterDate})</div>
                <div className="text-xs font-mono font-bold text-white">{change.afterStats}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/map?ulpin=${change.ulpin}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold"
                >
                  3D Locate
                </button>
                <button 
                  onClick={() => navigate(`/explorer?building=${change.buildingId}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                >
                  Inspect Slices
                </button>
              </div>

              <div className="flex items-center gap-2">
                {change.status !== 'Approved' && (
                  <button 
                    onClick={() => handleUpdateStatus(change.id, 'Approved')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Regularization
                  </button>
                )}
                {change.status !== 'Notice Issued' && (
                  <button 
                    onClick={() => handleUpdateStatus(change.id, 'Notice Issued')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <FileText className="w-3.5 h-3.5" /> Issue Violation Notice
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
