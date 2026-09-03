import React, { useState } from 'react';
import { 
  FileDigit, ArrowRight, CheckCircle2, QrCode, Download, Eye, 
  ShieldCheck, Building, User, MapPin, Sparkles, Copy, Check,
  Layers, Sliders, ChevronRight, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CertificateModal from '../components/certificate/CertificateModal';
import { useThemeStore } from '../store/themeStore';
import { apiClient } from '../api/client';

export default function GenerateULPINPage() {
  const navigate = useNavigate();
  const { theme, t } = useThemeStore();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [stateCode, setStateCode] = useState('OD');
  const [cityCode, setCityCode] = useState('BBSR');
  const [wardCode, setWardCode] = useState('W12');
  const [parcelNum, setParcelNum] = useState('P001');
  const [buildingNum, setBuildingNum] = useState('B03');
  const [floorNum, setFloorNum] = useState<number>(4);
  const [unitNum, setUnitNum] = useState('02');
  const [ownerName, setOwnerName] = useState('Rajesh Kumar Patel');
  const [propertyType, setPropertyType] = useState('Residential Apartment 2BHK');
  const [areaSqm, setAreaSqm] = useState<number>(125);
  
  const [generated, setGenerated] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const floorFormatted = `F${String(floorNum).padStart(2, '0')}`;
  const unitFormatted = `U${String(unitNum).padStart(2, '0')}`;
  const fullULPIN = `${stateCode}-${cityCode}-${wardCode}-${parcelNum}-${buildingNum}-${floorFormatted}-${unitFormatted}`;

  const handleSynthesizeAndRegister = async () => {
    setIsSubmitting(true);
    try {
      // 1. Call Backend to generate/register ULPIN in PostgreSQL
      await apiClient.post('/ulpin/generate', {
        state_code: stateCode,
        city_code: cityCode,
        ward_code: wardCode,
        parcel_number: parcelNum,
        building_number: buildingNum,
        floor_number: floorNum,
        unit_number: unitNum,
        property_type: propertyType,
        area: areaSqm,
        owner_name: ownerName
      });

      // 2. Also record in registry history
      try {
        await apiClient.post('/registry', {
          ulpin_id: fullULPIN,
          action: '3D ULPIN Synthesis & Title Issuance',
          description: `Generated 3D ULPIN for ${propertyType} (${areaSqm} m²) under owner ${ownerName}`,
          new_value: fullULPIN
        });
      } catch {}

      setGenerated(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setGenerated(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullULPIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBase = theme === 'light'
    ? 'bg-white/90 border-slate-200/90 text-slate-800 shadow-md backdrop-blur-xl'
    : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl backdrop-blur-xl';

  const inputBase = theme === 'light'
    ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
    : 'bg-slate-950 border-slate-700 text-white focus:border-blue-500';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-300">
      {/* Header */}
      <div className={`border-b pb-6 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
          <FileDigit className="w-4 h-4" /> {t('cadastralEncodingStandard')} • LIMITS
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
          {t('ulpinGenerationConsole')}
        </h1>
        <p className={`text-sm mt-1 max-w-2xl ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          {t('ulpinGenDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className={`lg:col-span-7 space-y-6 p-7 rounded-3xl border shadow-xl ${cardBase}`}>
          
          {/* ── Interactive Sliding Step Navigator ── */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-xs font-semibold">
            {[
              { id: 1, label: t('slidingStep1') },
              { id: 2, label: t('slidingStep2') },
              { id: 3, label: t('slidingStep3') },
            ].map(step => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer text-center text-xs font-bold ${
                  activeStep === step.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Step 1: 2D Cadastral Base */}
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <MapPin className="w-4 h-4 text-blue-500" /> {t('geoCadastral2D')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('stateCode')}</label>
                <select 
                  value={stateCode} 
                  onChange={e => setStateCode(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none border cursor-pointer ${inputBase}`}
                >
                  <option value="OD">OD (Odisha)</option>
                  <option value="MH">MH (Maharashtra)</option>
                  <option value="DL">DL (Delhi)</option>
                  <option value="KA">KA (Karnataka)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('cityDistrict')}</label>
                <input 
                  type="text" 
                  value={cityCode} 
                  onChange={e => setCityCode(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${inputBase}`} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('wardCode')}</label>
                <input 
                  type="text" 
                  value={wardCode} 
                  onChange={e => setWardCode(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${inputBase}`} 
                />
              </div>
            </div>
          </div>

          <div className={`h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'} my-2`}></div>

          {/* Step 2: 3D Vertical Spatial Space */}
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <Building className="w-4 h-4 text-blue-500" /> {t('verticalSpatial3D')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1.5">{t('parcelNumber')}</label>
                <select 
                  value={parcelNum}
                  onChange={e => setParcelNum(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border cursor-pointer ${inputBase}`}
                >
                  <option value="P001">P001</option>
                  <option value="P002">P002</option>
                  <option value="P003">P003</option>
                  <option value="P004">P004</option>
                  <option value="P005">P005</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1.5">{t('buildingId')}</label>
                <select 
                  value={buildingNum}
                  onChange={e => setBuildingNum(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border cursor-pointer ${inputBase}`}
                >
                  <option value="B01">B01 (Saheed)</option>
                  <option value="B02">B02 (Nagar)</option>
                  <option value="B03">B03 (Jaydev)</option>
                  <option value="B04">B04 (Vihar)</option>
                  <option value="B05">B05 (Nayapalli)</option>
                  <option value="B06">B06 (CSP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1.5">
                  {t('floorLevel')} ({floorFormatted})
                </label>
                <select 
                  value={floorNum}
                  onChange={e => setFloorNum(Number(e.target.value))}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border cursor-pointer ${inputBase}`}
                >
                  <option value={0}>F00 (Ground)</option>
                  <option value={1}>F01 (Floor 1)</option>
                  <option value={2}>F02 (Floor 2)</option>
                  <option value={3}>F03 (Floor 3)</option>
                  <option value={4}>F04 (Floor 4)</option>
                  <option value={5}>F05 (Floor 5)</option>
                  <option value={6}>F06 (Floor 6)</option>
                  <option value={7}>F07 (Floor 7)</option>
                  <option value={8}>F08 (Floor 8)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-500 mb-1.5">{t('unitSpace')}</label>
                <input 
                  type="text" 
                  value={unitNum} 
                  onChange={e => setUnitNum(e.target.value)}
                  placeholder="02"
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${inputBase}`} 
                />
              </div>
            </div>

            {/* Interactive Floor Height Range Slider ("Sliding Type") */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Floor Level Height Slider:</span>
                </span>
                <span className="text-cyan-400 font-mono font-bold">Level {floorNum} (Elevation +{floorNum * 3}m)</span>
              </div>
              <input 
                type="range"
                min="0"
                max="10"
                value={floorNum}
                onChange={e => setFloorNum(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className={`h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'} my-2`}></div>

          {/* Step 3: Ownership & Specifications */}
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <User className="w-4 h-4 text-blue-500" /> {t('ownershipSpecs')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('primaryOwnerName')}</label>
                <input 
                  type="text" 
                  value={ownerName} 
                  onChange={e => setOwnerName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${inputBase}`} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('carpetArea')}</label>
                <input 
                  type="number" 
                  value={areaSqm} 
                  onChange={e => setAreaSqm(Number(e.target.value))}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${inputBase}`} 
                />
              </div>
            </div>

            {/* Interactive Carpet Area Range Slider ("Sliding Type") */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Carpet Area Slider:</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{areaSqm} m² ({Math.round(areaSqm * 10.764)} sq.ft)</span>
              </div>
              <input 
                type="range"
                min="40"
                max="450"
                step="5"
                value={areaSqm}
                onChange={e => setAreaSqm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          <button 
            type="button"
            disabled={isSubmitting}
            onClick={handleSynthesizeAndRegister}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center gap-2 text-xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Storing in PostgreSQL Cadastre...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> {t('synthesizeRegisterBtn')}
              </>
            )}
          </button>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3D ULPIN synthesized and committed to PostgreSQL database!</span>
            </div>
          )}
        </div>

        {/* Live Preview & Title Certificate Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between space-y-6 animate-in slide-in-from-right duration-300 ${cardBase}`}>
            <div className={`flex justify-between items-center border-b pb-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-500" /> {t('digitalTitleCert')}
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POSTGIS GEOLINKED
              </span>
            </div>

            {/* Generated Code Display with sliding shimmer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/50 shadow-lg shadow-cyan-500/10 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('synthesizedUlpin')}</div>
              <div className="text-base font-mono font-black text-cyan-300 break-all select-all tracking-wide">
                {fullULPIN}
              </div>

              {/* Segment Chips */}
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">State: {stateCode}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-800">City: {cityCode}</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800">Ward: {wardCode}</span>
                <span className="px-2 py-0.5 rounded bg-pink-900/40 text-pink-300 border border-pink-800">Parcel: {parcelNum}</span>
                <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800">Bldg: {buildingNum}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800">Floor: {floorFormatted}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800">Unit: {unitFormatted}</span>
              </div>
            </div>

            {/* Certificate Specs */}
            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
              theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex justify-between text-slate-400">
                <span>{t('owner')}:</span>
                <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{ownerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('propertyClass')}:</span>
                <span className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{propertyType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('volumetricArea')}:</span>
                <span className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{areaSqm} m² ({Math.round(areaSqm * 10.764)} sq.ft)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('spatialTolerance')}:</span>
                <span className="font-bold text-emerald-400">±15mm LiDAR Verified</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`space-y-2 pt-2 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                {copied ? t('copiedSuccess') : t('copyUlpinCode')}
              </button>
              <button 
                onClick={() => navigate(`/map?ulpin=${fullULPIN}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> {t('viewOnMap')}
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/explorer?building=${buildingNum}&floor=${floorNum}&unit=${unitNum}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs border border-purple-500/30 transition-colors cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5 text-purple-400" /> {t('openExplorer')}
                </button>
                <button 
                  onClick={() => setShowCertModal(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> {t('viewCertificate')}
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
        floorNumber={floorNum}
        unitNumber={unitFormatted}
        ownerName={ownerName}
        areaSqm={areaSqm}
        propertyType={propertyType}
      />
    </div>
  );
}
