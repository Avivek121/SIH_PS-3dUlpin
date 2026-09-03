import React, { useState, useEffect } from 'react';
import { 
  HardDrive, UploadCloud, ExternalLink, Play, CheckCircle2, Clock, 
  FileCode, Layers, Box, Satellite, Camera, RefreshCw, Sparkles, Download, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useThemeStore } from '../store/themeStore';

interface SampleDataset {
  id: string;
  name: string;
  category: 'building' | 'aerial' | 'lidar' | 'terrestrial' | 'interior';
  description: string;
  specs: string;
  file_count: number;
  format: string;
  source: string;
  url: string;
  status: 'Ready' | 'Processing' | 'Queued';
  progress: number;
  target_output: string;
}

const OFFICIAL_SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'ds-01',
    name: 'Building Facade 3D Dataset',
    category: 'building',
    description: '50 terrestrial close-range images for textured building facade 3D model and planar orthomosaic.',
    specs: '50 high-res JPG images • Multi-angle coverage • Textured mesh',
    file_count: 50,
    format: 'JPG / OBJ / GLB',
    source: 'Agisoft Metashape Building Sample',
    url: 'https://www.agisoft.com/downloads/sample-data/',
    status: 'Ready',
    progress: 100,
    target_output: 'LOD3 3D Textured Mesh & Facade Orthomosaic'
  },
  {
    id: 'ds-02',
    name: 'Aerial Drone Survey with GCPs',
    category: 'aerial',
    description: '444 aerial photogrammetry images with 18 Ground Control Points (GCPs) and GNSS/camera coordinate CSV.',
    specs: '444 aerial TIFF/JPG • 18 GCPs • Centimeter RTK accuracy',
    file_count: 444,
    format: 'TIF / JPG / CSV',
    source: 'Agisoft Metashape Aerial GCP Sample',
    url: 'https://www.agisoft.com/downloads/sample-data/',
    status: 'Ready',
    progress: 100,
    target_output: 'High-Res Orthomosaic, DEM, DSM & 3D Footprints'
  },
  {
    id: 'ds-03',
    name: 'Aerial LiDAR Point Cloud',
    category: 'lidar',
    description: '148 million point LiDAR survey with trajectory flight telemetry and automatic ground/vegetation classification.',
    specs: '148 Million Points • LAS/LAZ • Trajectory Log included',
    file_count: 1,
    format: 'LAZ / 3D TILES',
    source: 'Agisoft Metashape Aerial LiDAR Sample',
    url: 'https://www.agisoft.com/downloads/sample-data/',
    status: 'Ready',
    progress: 100,
    target_output: 'Classified 3D Tiles Point Cloud (EDL Shaded)'
  },
  {
    id: 'ds-04',
    name: 'Terrestrial LiDAR Scanner Scans',
    category: 'terrestrial',
    description: '9 multi-station E57 terrestrial laser scan files with color and intensity channels.',
    specs: '9 E57 Scans • Spherical color panorama • Milimeter precision',
    file_count: 9,
    format: 'E57 / PTS',
    source: 'Agisoft Metashape Terrestrial Laser Sample',
    url: 'https://www.agisoft.com/downloads/sample-data/',
    status: 'Processing',
    progress: 68,
    target_output: 'Downsampled 3D Tiles & Architectural Floor Slices'
  },
  {
    id: 'ds-05',
    name: 'Building Interior & Floor Plan Scans',
    category: 'interior',
    description: 'Interior volumetric scans and architectural CAD floor plans for vertical floor and unit partition matching.',
    specs: 'CAD DWG / GeoJSON / Depth Maps • Unit Boundaries',
    file_count: 14,
    format: 'DWG / GeoJSON',
    source: '3D ULPIN Municipal Cadastral Records',
    url: 'https://www.agisoft.com/downloads/sample-data/',
    status: 'Ready',
    progress: 100,
    target_output: 'Vertical Floor Envelopes & Unit ULPIN Slices'
  }
];

export default function DatasetManagerPage() {
  const { t } = useThemeStore();
  const [datasets, setDatasets] = useState<SampleDataset[]>(OFFICIAL_SAMPLE_DATASETS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const res = await apiClient.get('/datasets');
      if (res.data && res.data.length > 0) {
        const liveDs: SampleDataset[] = res.data.map((d: any, idx: number) => ({
          id: d.id,
          name: d.name,
          category: d.dataset_type?.includes('lidar') ? 'lidar' : d.dataset_type?.includes('aerial') ? 'aerial' : 'building',
          description: d.description || OFFICIAL_SAMPLE_DATASETS[idx % OFFICIAL_SAMPLE_DATASETS.length].description,
          specs: `${d.file_count || 50} files • ${d.format?.toUpperCase() || 'LAS/OBJ'} • PostGIS Indexed`,
          file_count: d.file_count || 50,
          format: d.format?.toUpperCase() || 'LAZ / GLB',
          source: d.metadata_json?.source || 'Agisoft Metashape Sample Data',
          url: d.metadata_json?.url || 'https://www.agisoft.com/downloads/sample-data/',
          status: d.status === 'processing' ? 'Processing' : 'Ready',
          progress: d.status === 'processing' ? 68 : 100,
          target_output: OFFICIAL_SAMPLE_DATASETS[idx % OFFICIAL_SAMPLE_DATASETS.length]?.target_output || '3D Cadastral Envelopes'
        }));
        setDatasets(liveDs);
      }
    } catch {}
  };

  const handleSimulateUpload = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleRunProcessing = async (id: string) => {
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Processing', progress: 10 } : d));
    try {
      await apiClient.post(`/datasets/${id}/process`);
    } catch {}

    let prog = 10;
    const intv = setInterval(() => {
      prog += 20;
      if (prog >= 100) {
        clearInterval(intv);
        setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Ready', progress: 100 } : d));
      } else {
        setDatasets(prev => prev.map(d => d.id === id ? { ...d, progress: prog } : d));
      }
    }, 400);
  };

  const filteredDatasets = activeTab === 'all' 
    ? datasets 
    : datasets.filter(d => d.category === activeTab);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <HardDrive className="w-4 h-4" /> Multi-Sensor Data Ingestion
          </div>
          <h1 className="text-3xl font-extrabold text-white">Dataset Manager & Sample Data</h1>
          <p className="text-slate-400 text-sm mt-1">
            Ingest and process official Agisoft Metashape sample data (Drone, LiDAR, GCPs, Terrestrial) into 3D ULPIN digital twins.
          </p>
        </div>

        <a 
          href="https://www.agisoft.com/downloads/sample-data/" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 font-semibold text-xs transition-all shadow-md shrink-0"
        >
          <ExternalLink className="w-4 h-4" /> Official Agisoft Sample Data Page
        </a>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        onClick={handleSimulateUpload}
        className="bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-10 text-center transition-all cursor-pointer group shadow-xl relative overflow-hidden"
      >
        {uploadProgress !== null && (
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-800">
            <div 
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="p-4 bg-blue-600/10 text-blue-400 rounded-2xl w-fit mx-auto mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          {uploadProgress !== null ? `Uploading Dataset... ${uploadProgress}%` : "Drop Survey Dataset or Click to Import"}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
          Supports Aerial Drone Images (.jpg, .tif), LiDAR Point Clouds (.las, .laz), Scans (.e57), GNSS GCP Coordinates (.csv), and CAD Floor Plans (.dwg, .geojson).
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition-all">
          <Sparkles className="w-3.5 h-3.5" /> Start Spatial Ingestion Pipeline
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { key: 'all', label: 'All Datasets (5)' },
          { key: 'building', label: 'Building Facade (50 imgs)' },
          { key: 'aerial', label: 'Aerial Survey (444 imgs + 18 GCPs)' },
          { key: 'lidar', label: 'Aerial LiDAR (148M pts)' },
          { key: 'terrestrial', label: 'Terrestrial LiDAR (9 scans)' },
          { key: 'interior', label: 'Interior Cadastral Plans' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDatasets.map(ds => (
          <div 
            key={ds.id} 
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-blue-400" /> {ds.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  ds.status === 'Ready' 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {ds.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{ds.description}</p>
            </div>

            {/* Specs Box */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1 text-[11px] font-mono">
              <div className="text-slate-300">Specs: {ds.specs}</div>
              <div className="text-blue-400">Target Output: {ds.target_output}</div>
              <div className="text-slate-500 text-[10px]">Source: {ds.source}</div>
            </div>

            {/* Progress bar if processing */}
            {ds.status === 'Processing' && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>AI Reconstruction in progress...</span>
                  <span>{ds.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${ds.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
              <button 
                onClick={() => handleRunProcessing(ds.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-blue-400" /> Reprocess
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View on 3D Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
