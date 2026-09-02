import React, { useState, useEffect } from 'react';
import { 
  Brain, Cpu, CheckCircle2, Play, RefreshCw, Terminal, Layers, 
  Sparkles, Box, Satellite, HardDrive, AlertCircle, FileCode, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PipelineStage {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: 'Completed' | 'Running' | 'Queued';
  metrics: string;
}

const STAGES: PipelineStage[] = [
  { id: 1, name: 'Sensor Ingestion & Georeferencing', description: 'Aligning 444 drone images with 18 GCPs and GNSS RTK logs.', progress: 100, status: 'Completed', metrics: '444 images • 0.8cm RMSE' },
  { id: 2, name: 'LiDAR Ground & Vegetation Filtering', description: 'Progressive TIN densification and CSF classification filter.', progress: 100, status: 'Completed', metrics: '148M points • 99.4% ground match' },
  { id: 3, name: 'LOD2 Building Footprint Extraction', description: 'Extracting 3D bounding geometry, roof eave lines, and height profiles.', progress: 100, status: 'Completed', metrics: '8 buildings • Mean height 18.5m' },
  { id: 4, name: 'Vertical Floor Plane Slicing', description: 'Detecting slab levels, floor heights, and window openings via RANSAC.', progress: 100, status: 'Completed', metrics: '52 floors sliced • 3.0m mean' },
  { id: 5, name: 'Volumetric Unit Partitioning', description: 'Matching municipal architectural floor plans to 3D spatial slices.', progress: 92, status: 'Running', metrics: '178 units • 14 pending verify' },
  { id: 6, name: '18-Digit 3D ULPIN Encoding', description: 'Synthesizing State-City-Ward-Parcel-Bldg-Floor-Unit hierarchical identifiers.', progress: 85, status: 'Running', metrics: '164 codes generated' },
  { id: 7, name: 'AI Spatial Discrepancy & Encroachment Flags', description: 'Comparing physical 3D mesh volume against approved building plans.', progress: 75, status: 'Running', metrics: '4 violations identified' },
];

const MOCK_LOGS = [
  '[00:01:12] Initializing CUDA photogrammetry worker cluster (4x NVIDIA RTX A6000)...',
  '[00:01:25] Ingested Agisoft Metashape Building Sample (50 terrestrial images).',
  '[00:02:04] Bundle adjustment complete: Reprojection error = 0.42 px.',
  '[00:02:45] Point cloud densified: 148,294,102 points with RGB & Intensity.',
  '[00:03:18] Extracting Building B03 footprint (Jaydev Tower)... Height detected: 24.1m.',
  '[00:03:55] RANSAC floor slicing active: Ground, F01, F02, F03, F04, F05, F06, F07 detected.',
  '[00:04:12] Unit boundaries mapped for Floor 04 (Units 401, 402, 403, 404).',
  '[00:04:30] Generated 3D ULPIN: OD-BBSR-W12-P001-B03-F04-U02.',
  '[00:04:55] Discrepancy check: Building B04 height = 19.1m (Sanctioned = 18.2m) -> FLAG_RAISED.',
  '[00:05:10] Updating PostgreSQL PostGIS spatial registry tables...',
];

export default function AIProcessingPage() {
  const [stages, setStages] = useState<PipelineStage[]>(STAGES);
  const [logs, setLogs] = useState<string[]>(MOCK_LOGS);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const navigate = useNavigate();

  // Simulated live log append
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const randomLogs = [
        `[${timestamp}] Processing tile (Zone 45N / UTM): Raycasting floor partitions...`,
        `[${timestamp}] Validated volumetric polygon envelope against Master Cadastral Deed #99214.`,
        `[${timestamp}] Calculating normal vectors for facade texture mapping LOD3...`,
        `[${timestamp}] 3D ULPIN hash verified with cryptographic municipal ledger.`,
      ];
      const newLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleTriggerPipeline = () => {
    setIsRunning(true);
    setStages(prev => prev.map(s => ({ ...s, status: 'Running', progress: 10 })));
    let prog = 10;
    const intv = setInterval(() => {
      prog += 15;
      if (prog >= 100) {
        clearInterval(intv);
        setStages(prev => prev.map(s => ({ ...s, status: 'Completed', progress: 100 })));
      } else {
        setStages(prev => prev.map(s => ({ ...s, progress: Math.min(100, s.progress + 15) })));
      }
    }, 600);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Brain className="w-4 h-4" /> Autonomous Cadastral Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Spatial Reconstruction Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">
            End-to-end multi-sensor point cloud processing, building extraction, floor slicing, and 3D ULPIN synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleTriggerPipeline}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            <Play className="w-3.5 h-3.5" /> Run Full 3D AI Pipeline
          </button>
          <button 
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors"
          >
            View Live 3D Map
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Points Processed</div>
          <div className="text-2xl font-black text-white mt-1">148,294,102</div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Agisoft Aerial & Terrestrial LiDAR</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">LOD2/LOD3 Buildings</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">8 Multi-Storey</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Bhubaneswar Ward 12 Zone</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Vertical Floors Extracted</div>
          <div className="text-2xl font-black text-indigo-300 mt-1">52 Slices</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Ground to Level 10</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">3D ULPINs Synthesized</div>
          <div className="text-2xl font-black text-purple-400 mt-1">178 Units</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">100% PostGIS Geocoded</div>
        </div>
      </div>

      {/* 7-Stage Pipeline Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" /> Active AI Processing Stages
          </h3>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Pipeline Engine: Online
          </span>
        </div>

        <div className="space-y-4">
          {stages.map(st => (
            <div key={st.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    st.status === 'Completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {st.status === 'Completed' ? <Check className="w-3.5 h-3.5" /> : st.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{st.name}</h4>
                    <p className="text-xs text-slate-400">{st.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] font-mono text-slate-400">{st.metrics}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    st.status === 'Completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {st.status} ({st.progress}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    st.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${st.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live AI Processing Stream Terminal */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Reconstruction Worker Console</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Host: gpu-cluster-bbsr-01</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400/90 space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar border border-slate-800/80">
          {logs.map((log, index) => (
            <div key={index} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
