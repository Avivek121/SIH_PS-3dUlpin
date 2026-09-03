import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, MapPin, 
  ArrowUpRight, Download, Filter, Search, FileText, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useThemeStore } from '../store/themeStore';

interface FlaggedItem {
  id: string;
  ulpin: string;
  property: string;
  owner: string;
  issue: string;
  severity: 'Critical' | 'High' | 'Moderate';
  reportedDate: string;
  status: 'Open' | 'Notice Issued' | 'Resolved';
  actionNeeded: string;
}

const DEFAULT_FLAGGED_ITEMS: FlaggedItem[] = [
  { id: 'f-01', ulpin: 'OD-BBSR-W12-P002-B04-F05-U01', property: 'Vihar Commercial Complex', owner: 'Vihar Commercial Ltd', issue: 'Vertical Height Exceeded (+0.9m above 18.2m sanction)', severity: 'Critical', reportedDate: '2026-02-28', status: 'Notice Issued', actionNeeded: 'Demolition / Regularization hearing' },
  { id: 'f-02', ulpin: 'OD-BBSR-W12-P001-B02-F06-U03', property: 'Nagar Heights Tower B', owner: 'Nagar Heights HOA', issue: 'Unauthorized Rooftop Metal Shed (45 sq.m)', severity: 'High', reportedDate: '2026-02-25', status: 'Open', actionNeeded: 'Terrace clearance notice' },
  { id: 'f-03', ulpin: 'OD-BBSR-W12-P003-B05-F03-U01', property: 'Nayapalli Villa Complex', owner: 'Ranjan Barik', issue: 'Front Setback Encroachment (-0.9m boundary offset)', severity: 'Critical', reportedDate: '2026-02-22', status: 'Notice Issued', actionNeeded: 'Boundary realignment' },
  { id: 'f-04', ulpin: 'OD-BBSR-W12-P004-B07-F07-U01', property: 'CSP Mixed Use Building', owner: 'CSP Mixed Holdings', issue: 'Commercial Activity in Residential Zone', severity: 'Moderate', reportedDate: '2026-02-18', status: 'Open', actionNeeded: 'Zone conversion fee assessment' },
];

export default function FlaggedPropertiesPage() {
  const { t, theme } = useThemeStore();
  const [items, setItems] = useState<FlaggedItem[]>(DEFAULT_FLAGGED_ITEMS);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Open'>('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFlagged();
  }, []);

  const loadFlagged = async () => {
    try {
      const res = await apiClient.get('/validation/records?status=flagged');
      if (res.data && res.data.length > 0) {
        const formatted: FlaggedItem[] = res.data.map((r: any, idx: number) => ({
          id: r.id || `f-0${idx + 1}`,
          ulpin: r.ulpin_id || DEFAULT_FLAGGED_ITEMS[idx % DEFAULT_FLAGGED_ITEMS.length].ulpin,
          property: `Building B0${(idx % 8) + 1}`,
          owner: r.owner_name || 'Owner Under Notice',
          issue: r.violation_type || 'Setback Encroachment Detected',
          severity: r.severity === 'critical' ? 'Critical' : r.severity === 'high' ? 'High' : 'Moderate',
          reportedDate: r.created_at ? r.created_at.split('T')[0] : '2026-02-28',
          status: (r.status === 'resolved' ? 'Resolved' : r.status === 'notice_issued' ? 'Notice Issued' : 'Open') as any,
          actionNeeded: r.action_required || 'Regularization fee / Demolition notice'
        }));
        setItems(formatted);
      }
    } catch {
      // Fallback
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await apiClient.patch(`/validation/records/${id}`, { status: 'resolved' });
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Resolved' } : item));
    } catch {
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Resolved' } : item));
    }
  };

  const filtered = items.filter(item => {
    const matchesFilter = filter === 'All' || 
                          (filter === 'Critical' && item.severity === 'Critical') ||
                          (filter === 'High' && item.severity === 'High') ||
                          (filter === 'Open' && item.status === 'Open');
    const matchesSearch = item.ulpin.toLowerCase().includes(search.toLowerCase()) ||
                          item.property.toLowerCase().includes(search.toLowerCase()) ||
                          item.owner.toLowerCase().includes(search.toLowerCase()) ||
                          item.issue.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
            <AlertTriangle className="w-4 h-4" /> {t('flaggedPropertiesTitle')}
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('flaggedPropertiesTitle')}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('flaggedPropertiesDesc')}
          </p>
        </div>

        <button 
          onClick={() => navigate('/validation')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all self-start md:self-auto cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> {t('revalidateAll')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex gap-2 w-full sm:w-auto">
          {(['All', 'Critical', 'High', 'Open'] as const).map(tab => {
            const label = tab === 'All' ? t('allTab') : tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === tab 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search flagged records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Flagged Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  item.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  item.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {item.severity.toUpperCase()} SEVERITY
                </span>
                <span className="text-[11px] text-slate-400">{item.reportedDate}</span>
              </div>

              <div>
                <div className="text-base font-bold text-white mb-1">{item.property}</div>
                <div className="font-mono text-xs text-blue-400 font-semibold">{item.ulpin}</div>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-300">
                <span className="font-bold text-white block mb-0.5">Flagged Issue:</span>
                {item.issue}
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Owner: <span className="text-slate-200 font-semibold">{item.owner}</span></div>
                <div>Action Needed: <span className="text-amber-300 font-medium">{item.actionNeeded}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className={`text-xs font-bold ${item.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                Status: {item.status}
              </span>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/map?ulpin=${item.ulpin}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold"
                >
                  3D Locate
                </button>
                <button 
                  onClick={() => {
                    const bMatch = item.ulpin.match(/B\d+/);
                    navigate(`/explorer?building=${bMatch ? bMatch[0] : 'B03'}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                >
                  Inspect
                </button>
                {item.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleResolve(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Resolve
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
