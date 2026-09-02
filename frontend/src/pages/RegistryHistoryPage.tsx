import React, { useState } from 'react';
import { 
  History, Clock, FileText, CheckCircle2, ShieldCheck, 
  ArrowRight, Filter, Search, User, FileDigit, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoryRecord {
  id: string;
  ulpin: string;
  action: string;
  description: string;
  performedBy: string;
  oldValue: string;
  newValue: string;
  docRef: string;
  docHash: string;
  timestamp: string;
  status: 'Verified' | 'Completed';
}

const AUDIT_TRAIL: HistoryRecord[] = [
  {
    id: 'h-01',
    ulpin: 'OD-BBSR-W12-P002-B03-F04-U02',
    action: 'Spatial LiDAR Validation',
    description: 'Terrestrial laser scanner survey verified volume tolerance (0.8% deviation).',
    performedBy: 'AI Spatial Verification Engine',
    oldValue: 'Validation Status: Pending',
    newValue: 'Validation Status: Verified Match (24.1m Height / 125.0m² Area)',
    docRef: 'MUNICIPAL_SURVEY_2026_BBSR_082.pdf',
    docHash: '0x8f4c2e91b0d77123aa',
    timestamp: '2026-02-27 14:32:10 UTC',
    status: 'Verified'
  },
  {
    id: 'h-02',
    ulpin: 'OD-BBSR-W12-P002-B03-F04-U02',
    action: 'Ownership Deed Registration',
    description: 'Sub-registrar title transfer execution deed finalized with biometric verification.',
    performedBy: 'Bhubaneswar Sub-Registrar Officer',
    oldValue: 'Owner: Jaydev Vihar Developers Pvt Ltd (100% share)',
    newValue: 'Owner: Rajesh Kumar Patel (100% Freehold title)',
    docRef: 'DEED_TRANSFER_BBSR_2026_9941.pdf',
    docHash: '0x71e34b99cd452093ea',
    timestamp: '2026-01-20 11:15:42 UTC',
    status: 'Completed'
  },
  {
    id: 'h-03',
    ulpin: 'OD-BBSR-W12-P002-B03-F04-U02',
    action: '3D Floor & Unit Slicing',
    description: 'Architectural DWG floor plan matched with RANSAC point cloud plane.',
    performedBy: 'Autonomous AI Processing Cluster',
    oldValue: 'Spatial Envelope: Unpartitioned Floor 04 Slab',
    newValue: 'Unit 402 Volumetric Bounding Box (X: [0, 6.2], Y: [0, 1.3], Z: [0, 5.2])',
    docRef: 'LOD3_PARTITION_B03_F04.geojson',
    docHash: '0x32a890df4431cc90bb',
    timestamp: '2026-01-15 09:40:18 UTC',
    status: 'Verified'
  },
  {
    id: 'h-04',
    ulpin: 'OD-BBSR-W12-P002-B03-F04-U02',
    action: '3D ULPIN Synthesized',
    description: 'Initial vertical cadastral identifier created on municipal GIS network.',
    performedBy: 'Odisha Land Records Directorate',
    oldValue: 'None (New Cadastral Parcel Subdivision)',
    newValue: 'OD-BBSR-W12-P002-B03-F04-U02',
    docRef: 'ULPIN_SANCTION_ORDER_W12_2026.pdf',
    docHash: '0x12b55f88aa33dd1190',
    timestamp: '2026-01-10 16:05:00 UTC',
    status: 'Completed'
  }
];

export default function RegistryHistoryPage() {
  const [historyList] = useState<HistoryRecord[]>(AUDIT_TRAIL);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = historyList.filter(item => 
    item.ulpin.toLowerCase().includes(search.toLowerCase()) ||
    item.action.toLowerCase().includes(search.toLowerCase()) ||
    item.performedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <History className="w-4 h-4" /> Cryptographic Audit Trail
          </div>
          <h1 className="text-3xl font-extrabold text-white">Registry Cadastral History</h1>
          <p className="text-slate-400 text-sm mt-1">
            Immutable timeline of title deeds, spatial validations, and volumetric subdivisions.
          </p>
        </div>

        <button 
          onClick={() => navigate('/registry')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors self-start md:self-auto"
        >
          View Property Registry
        </button>
      </div>

      {/* Target Property Summary Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Target Cadastral Space</div>
          <div className="text-lg font-mono font-black text-white mt-0.5">OD-BBSR-W12-P002-B03-F04-U02</div>
          <div className="text-xs text-slate-300 mt-1">Jaydev Tower • Floor 4 • Unit 402 (Rajesh Kumar Patel)</div>
        </div>

        <button 
          onClick={() => navigate('/map?ulpin=OD-BBSR-W12-P002-B03-F04-U02')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors shrink-0"
        >
          Locate in 3D Map
        </button>
      </div>

      {/* Timeline Section */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-emerald-500">
        {filtered.map(record => (
          <div 
            key={record.id} 
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> {record.action}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">By: <span className="text-slate-300 font-semibold">{record.performedBy}</span></div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {record.timestamp}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {record.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{record.description}</p>

            {/* Changes Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Previous State:</span>
                <span className="text-slate-400">{record.oldValue}</span>
              </div>
              <div>
                <span className="text-blue-400 block text-[10px]">Updated Record:</span>
                <span className="text-emerald-300 font-bold">{record.newValue}</span>
              </div>
            </div>

            {/* Document Hash Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 font-mono">
              <span>Doc Ref: <span className="text-blue-400">{record.docRef}</span></span>
              <span>Ledger Hash: <span className="text-slate-500">{record.docHash}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
