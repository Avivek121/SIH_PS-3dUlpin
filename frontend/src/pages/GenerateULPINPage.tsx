import React, { useState } from 'react';
import { 
  FileDigit, ArrowRight, CheckCircle2, QrCode, Download, Eye, 
  ShieldCheck, Building, User, MapPin, Sparkles, Copy, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CertificateModal from '../components/certificate/CertificateModal';

export default function GenerateULPINPage() {
  const navigate = useNavigate();

  const [stateCode, setStateCode] = useState('OD');
  const [cityCode, setCityCode] = useState('BBSR');
  const [wardCode, setWardCode] = useState('W12');
  const [parcelNum, setParcelNum] = useState('P001');
  const [buildingNum, setBuildingNum] = useState('B03');
  const [floorNum, setFloorNum] = useState('F04');
  const [unitNum, setUnitNum] = useState('U02');
  const [ownerName, setOwnerName] = useState('Rajesh Kumar Patel');
  const [propertyType, setPropertyType] = useState('Residential Apartment');
  const [areaSqm, setAreaSqm] = useState('125.0');
  
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const fullULPIN = `${stateCode}-${cityCode}-${wardCode}-${parcelNum}-${buildingNum}-${floorNum}-${unitNum}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullULPIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
          <FileDigit className="w-4 h-4" /> Cadastral Encoding Standard
        </div>
        <h1 className="text-3xl font-extrabold text-white">3D ULPIN Generation Console</h1>
        <p className="text-slate-400 text-sm mt-1">
          Generate structured 18-digit unique vertical property identifiers mapped to volumetric spatial spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-7 space-y-6 bg-slate-900/90 p-7 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> Geographic Cadastral Foundation (2D)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">State Code</label>
              <select 
                value={stateCode} 
                onChange={e => setStateCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="OD">OD (Odisha)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="DL">DL (Delhi)</option>
                <option value="KA">KA (Karnataka)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">City / District</label>
              <input 
                type="text" 
                value={cityCode} 
                onChange={e => setCityCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ward Code</label>
              <input 
                type="text" 
                value={wardCode} 
                onChange={e => setWardCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="h-px bg-slate-800 my-2"></div>

          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" /> Vertical Spatial Space (3D Extensions)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1.5">Parcel Number</label>
              <input 
                type="text" 
                value={parcelNum} 
                onChange={e => setParcelNum(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-blue-300 font-mono outline-none focus:border-blue-400" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1.5">Building ID</label>
              <input 
                type="text" 
                value={buildingNum} 
                onChange={e => setBuildingNum(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-blue-300 font-mono outline-none focus:border-blue-400" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1.5">Floor Level</label>
              <input 
                type="text" 
                value={floorNum} 
                onChange={e => setFloorNum(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-blue-300 font-mono outline-none focus:border-blue-400" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1.5">Unit Space</label>
              <input 
                type="text" 
                value={unitNum} 
                onChange={e => setUnitNum(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-3 py-2 text-xs text-blue-300 font-mono outline-none focus:border-blue-400" 
              />
            </div>
          </div>

          <div className="h-px bg-slate-800 my-2"></div>

          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" /> Ownership & Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Owner Full Name</label>
              <input 
                type="text" 
                value={ownerName} 
                onChange={e => setOwnerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Carpet Area (m²)</label>
              <input 
                type="text" 
                value={areaSqm} 
                onChange={e => setAreaSqm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <button 
            onClick={() => setGenerated(true)}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> Synthesize & Register 3D ULPIN
          </button>
        </div>

        {/* Live Preview & Title Certificate Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-400" /> Digital 3D Title Certificate
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POSTGIS GEOLINKED
              </span>
            </div>

            {/* Generated Code Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Synthesized 3D ULPIN</div>
              <div className="text-base font-mono font-black text-white break-all select-all">
                {fullULPIN}
              </div>

              {/* Segment Chips */}
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">State: {stateCode}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-800">City: {cityCode}</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800">Ward: {wardCode}</span>
                <span className="px-2 py-0.5 rounded bg-pink-900/40 text-pink-300 border border-pink-800">Parcel: {parcelNum}</span>
                <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800">Bldg: {buildingNum}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800">Floor: {floorNum}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800">Unit: {unitNum}</span>
              </div>
            </div>

            {/* Certificate Specs */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Owner:</span>
                <span className="font-bold text-white">{ownerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Property Class:</span>
                <span className="font-semibold text-slate-200">{propertyType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Volumetric Area:</span>
                <span className="font-semibold text-white">{areaSqm} m² ({Math.round(parseFloat(areaSqm || '0') * 10.764)} sq.ft)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Spatial Tolerance:</span>
                <span className="font-bold text-emerald-400">±15mm LiDAR Verified</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                {copied ? 'Copied to Clipboard!' : 'Copy 3D ULPIN Code'}
              </button>
              <button 
                onClick={() => navigate(`/map?ulpin=${fullULPIN}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View on 3D GIS Map
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/explorer?building=${buildingNum}&floor=${parseInt(floorNum.replace('F',''),10)}&unit=${unitNum.replace('U','')}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs border border-purple-500/30 transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-purple-400" /> Explorer
                </button>
                <button 
                  onClick={() => setShowCertModal(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official 3D Certificate Modal */}
      <CertificateModal 
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        ulpin={fullULPIN}
        buildingName={`Building ${buildingNum}`}
        floorNumber={parseInt(floorNum.replace('F',''), 10) || 4}
        unitNumber={unitNum}
        ownerName={ownerName}
        areaSqm={areaSqm}
        propertyType={propertyType}
      />
    </div>
  );
}
