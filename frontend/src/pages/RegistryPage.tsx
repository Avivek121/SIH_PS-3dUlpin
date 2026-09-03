import React, { useState, useEffect } from 'react';
import { 
  Database, Filter, Download, Search, Eye, FileText, 
  CheckCircle2, AlertTriangle, Building, MapPin, QrCode, Sparkles,
  Plus, X, ShieldCheck, Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CertificateModal from '../components/certificate/CertificateModal';
import { ulpinApi } from '../api/ulpin';
import { useThemeStore } from '../store/themeStore';

interface RegistryItem {
  ulpin: string;
  building: string;
  buildingId: string;
  floor: number;
  unit: string;
  type: string;
  owner: string;
  area: number;
  status: 'Registered' | 'Pending' | 'Flagged';
  date: string;
}

const DEFAULT_REGISTRY_ENTRIES: RegistryItem[] = [
  { ulpin: 'OD-BBSR-W12-P001-B01-F01-U01', building: 'Saheed Residency', buildingId: 'B01', floor: 1, unit: '101', type: 'Apartment 3BHK', owner: 'Sunita Sharma', area: 135, status: 'Registered', date: '2026-01-15' },
  { ulpin: 'OD-BBSR-W12-P001-B01-F02-U02', building: 'Saheed Residency', buildingId: 'B01', floor: 2, unit: '202', type: 'Apartment 2BHK', owner: 'Priya Mohanty', area: 105, status: 'Registered', date: '2026-01-18' },
  { ulpin: 'OD-BBSR-W12-P001-B02-F06-U03', building: 'Nagar Heights', buildingId: 'B02', floor: 6, unit: '603', type: 'Terrace Penthouse', owner: 'Nagar Heights HOA', area: 180, status: 'Flagged', date: '2026-02-10' },
  { ulpin: 'OD-BBSR-W12-P002-B03-F04-U02', building: 'Jaydev Tower', buildingId: 'B03', floor: 4, unit: '402', type: 'Apartment 2BHK (Premium)', owner: 'Rajesh Kumar Patel', area: 125, status: 'Registered', date: '2026-01-20' },
  { ulpin: 'OD-BBSR-W12-P002-B03-F05-U01', building: 'Jaydev Tower', buildingId: 'B03', floor: 5, unit: '501', type: 'Apartment 3BHK', owner: 'Debasis Rout', area: 135, status: 'Registered', date: '2026-01-22' },
  { ulpin: 'OD-BBSR-W12-P002-B04-F05-U01', building: 'Vihar Commercial', buildingId: 'B04', floor: 5, unit: '501', type: 'Commercial Office Suite', owner: 'Vihar Commercial Ltd', area: 220, status: 'Flagged', date: '2026-02-28' },
  { ulpin: 'OD-BBSR-W12-P003-B05-F01-U01', building: 'Nayapalli Villa', buildingId: 'B05', floor: 1, unit: '101', type: 'Duplex Villa Space', owner: 'Meera Nayak', area: 160, status: 'Registered', date: '2026-01-12' },
  { ulpin: 'OD-BBSR-W12-P004-B06-F08-U04', building: 'CSP Business', buildingId: 'B06', floor: 8, unit: '804', type: 'Tech Suite Office', owner: 'CSP Tech Innovations', area: 340, status: 'Registered', date: '2026-02-05' },
];

const BUILDING_NAMES: Record<string, string> = {
  B01: 'Saheed Residency',
  B02: 'Nagar Heights',
  B03: 'Jaydev Tower',
  B04: 'Vihar Commercial',
  B05: 'Nayapalli Villa',
  B06: 'CSP Business Center',
  B07: 'Patia Towers',
  B08: 'Khandagiri Enclave',
};

export default function RegistryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, t } = useThemeStore();

  const querySearch = searchParams.get('search') || '';
  const isNewAction = searchParams.get('action') === 'new';

  const [filter, setFilter] = useState<'All' | 'Registered' | 'Flagged' | 'Pending'>('All');
  const [search, setSearch] = useState(querySearch);
  const [entries, setEntries] = useState<RegistryItem[]>(DEFAULT_REGISTRY_ENTRIES);
  const [selectedCertItem, setSelectedCertItem] = useState<RegistryItem | null>(null);

  // New Register Modal State
  const [showAddModal, setShowAddModal] = useState(isNewAction);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+91 94370 28419');
  const [parcelId, setParcelId] = useState('P001');
  const [buildingId, setBuildingId] = useState('B01');
  const [floorNum, setFloorNum] = useState<number>(3);
  const [unitNum, setUnitNum] = useState('302');
  const [propType, setPropType] = useState('Residential Apartment 2BHK');
  const [area, setArea] = useState<number>(115);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const computedUlpin = `OD-BBSR-W12-${parcelId}-${buildingId}-F${String(floorNum).padStart(2, '0')}-U${String(unitNum).padStart(2, '0')}`;

  useEffect(() => {
    if (querySearch) {
      setSearch(querySearch);
      handleSearchChange(querySearch);
    } else {
      loadLiveRegistry('OD');
    }
  }, [querySearch]);

  const loadLiveRegistry = async (query = 'OD') => {
    try {
      const res = await ulpinApi.searchULPIN(query);
      if (res && res.length > 0) {
        const liveItems: RegistryItem[] = res.map((r, idx) => ({
          ulpin: r.ulpin_code,
          building: r.building_id ? (BUILDING_NAMES[r.building_id] || `Building ${r.building_id}`) : (DEFAULT_REGISTRY_ENTRIES[idx % DEFAULT_REGISTRY_ENTRIES.length].building),
          buildingId: r.building_id || `B0${(idx % 8) + 1}`,
          floor: r.floor_number || ((idx % 6) + 1),
          unit: r.unit_number || `${((idx % 6) + 1)}0${(idx % 4) + 1}`,
          type: r.property_type || 'Apartment Unit',
          owner: r.owner_name || 'Registered Citizen',
          area: typeof r.area === 'number' ? r.area : (100 + (idx * 15)),
          status: (r.registration_status === 'registered' ? 'Registered' : r.registration_status === 'flagged' ? 'Flagged' : 'Pending') as any,
          date: '2026-02-28'
        }));
        setEntries(liveItems);
      }
    } catch {
      // Use rich fallback
    }
  };

  const handleSearchChange = async (val: string) => {
    setSearch(val);
    const query = val.trim();
    if (!query) {
      loadLiveRegistry('OD');
      return;
    }
    try {
      const res = await ulpinApi.searchULPIN(query);
      if (res && res.length > 0) {
        const liveItems: RegistryItem[] = res.map((r, idx) => ({
          ulpin: r.ulpin_code,
          building: r.building_id ? (BUILDING_NAMES[r.building_id] || `Building ${r.building_id}`) : (DEFAULT_REGISTRY_ENTRIES[idx % DEFAULT_REGISTRY_ENTRIES.length].building),
          buildingId: r.building_id || `B0${(idx % 8) + 1}`,
          floor: r.floor_number || ((idx % 6) + 1),
          unit: r.unit_number || `${((idx % 6) + 1)}0${(idx % 4) + 1}`,
          type: r.property_type || 'Apartment Unit',
          owner: r.owner_name || 'Registered Citizen',
          area: typeof r.area === 'number' ? r.area : (100 + (idx * 15)),
          status: (r.registration_status === 'registered' ? 'Registered' : r.registration_status === 'flagged' ? 'Flagged' : 'Pending') as any,
          date: '2026-02-28'
        }));
        setEntries(liveItems);
      }
    } catch {
      // Fallback
    }
  };

  const handleCreateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim()) return;

    setIsSubmitting(true);
    try {
      await ulpinApi.generateULPIN({
        state_code: 'OD',
        city_code: 'BBSR',
        ward_code: 'W12',
        parcel_number: parcelId,
        building_number: buildingId,
        floor_number: floorNum,
        unit_number: unitNum,
      }).catch(() => null);

      const newItem: RegistryItem = {
        ulpin: computedUlpin,
        building: BUILDING_NAMES[buildingId] || `Building ${buildingId}`,
        buildingId: buildingId,
        floor: floorNum,
        unit: unitNum,
        type: propType,
        owner: ownerName.trim(),
        area: Number(area) || 120,
        status: 'Registered',
        date: new Date().toISOString().split('T')[0],
      };

      setEntries(prev => [newItem, ...prev]);
      setRegSuccess(`Successfully registered! 18-digit ULPIN: ${computedUlpin}`);
      setTimeout(() => {
        setShowAddModal(false);
        setRegSuccess(null);
        setOwnerName('');
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = entries.filter(item => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.ulpin.toLowerCase().includes(search.toLowerCase()) || 
                          item.owner.toLowerCase().includes(search.toLowerCase()) ||
                          item.building.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cardBase = theme === 'light'
    ? 'bg-white/90 border-slate-200/90 text-slate-800 shadow-md backdrop-blur-xl'
    : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl backdrop-blur-xl';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-300">
      {/* Header with "Add New Register" Option */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
            <Database className="w-4 h-4" /> {t('officialCadastralLedger')}
          </div>
          <h1 className={`text-3xl font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {t('propertyRegistryTitle')}
          </h1>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('propertyRegistryDesc')}
          </p>
        </div>

        {/* Action Buttons: Add New Register & Generate ULPIN */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t('addNewRegister')}
          </button>
          <button 
            onClick={() => navigate('/generate-ulpin')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" /> {t('generate3DUlpin')}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl border ${cardBase}`}>
        <div className="flex gap-2 w-full sm:w-auto">
          {(['All', 'Registered', 'Flagged', 'Pending'] as const).map(tab => {
            const label = tab === 'All' ? t('allTab') : tab === 'Registered' ? t('registeredTab') : tab === 'Flagged' ? t('flaggedTab') : t('pendingTab');
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === tab 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : (theme === 'light' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white')
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={t('searchRegistryPlaceholder')}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none font-mono border transition-all ${
              theme === 'light' 
                ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500' 
                : 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className={`rounded-2xl border shadow-xl overflow-hidden ${cardBase}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              theme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950/60 text-slate-400 border-slate-800'
            }`}>
              <tr>
                <th className="p-4">{t('thUlpin')}</th>
                <th className="p-4">{t('thOwner')}</th>
                <th className="p-4">{t('thBuildingUnit')}</th>
                <th className="p-4">{t('thType')}</th>
                <th className="p-4">{t('thArea')}</th>
                <th className="p-4">{t('thStatus')}</th>
                <th className="p-4 text-right">{t('thActions')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${
              theme === 'light' ? 'divide-slate-200' : 'divide-slate-800/80'
            }`}>
              {filtered.map((item, idx) => (
                <tr key={idx} className={`transition-colors ${
                  theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                }`}>
                  <td className="p-4 font-bold text-blue-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{item.ulpin}</span>
                  </td>
                  <td className="p-4 text-slate-800 dark:text-slate-200 font-sans font-medium">{item.owner}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-sans">
                    {item.building} • Floor {item.floor}, Unit {item.unit}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-sans">{item.type}</td>
                  <td className="p-4 text-slate-800 dark:text-slate-300">{item.area} m²</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      item.status === 'Registered' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : item.status === 'Flagged'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {item.status === 'Registered' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedCertItem(item)}
                        className="p-1.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="View & Download Official Title Certificate"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/map?ulpin=${encodeURIComponent(item.ulpin)}`)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          theme === 'light' ? 'text-slate-500 hover:bg-slate-200 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        title="Locate on 3D GIS Map"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add New Register Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 ${cardBase}`}>
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {t('registerNewPropertyModal')}
                </h2>
                <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t('registerNewPropertyDesc')}
                </p>
              </div>
            </div>

            {/* Live ULPIN Preview Badge */}
            <div className="mb-5 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Synthesized 18-Digit ULPIN</div>
                <div className="text-xs sm:text-sm font-mono font-black text-white mt-0.5">{computedUlpin}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Auto-Key
              </span>
            </div>

            {regSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateRegistration} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Citizen / Owner Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Suresh Chandra Mohapatra"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Contact Phone</label>
                  <input 
                    type="text" 
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Carpet Area (m²)</label>
                  <input 
                    type="number" 
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Cadastral Parcel</label>
                  <select 
                    value={parcelId}
                    onChange={e => setParcelId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="P001">P001 - Saheed Nagar</option>
                    <option value="P002">P002 - Jaydev Vihar</option>
                    <option value="P003">P003 - Nayapalli</option>
                    <option value="P004">P004 - Chandrasekharpur</option>
                    <option value="P005">P005 - Patia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Building Model</label>
                  <select 
                    value={buildingId}
                    onChange={e => setBuildingId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="B01">B01 - Saheed Residency</option>
                    <option value="B02">B02 - Nagar Heights</option>
                    <option value="B03">B03 - Jaydev Tower</option>
                    <option value="B04">B04 - Vihar Commercial</option>
                    <option value="B05">B05 - Nayapalli Villa</option>
                    <option value="B06">B06 - CSP Business Center</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Floor Level</label>
                  <select 
                    value={floorNum}
                    onChange={e => setFloorNum(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value={0}>Ground (F00)</option>
                    <option value={1}>Floor 1 (F01)</option>
                    <option value={2}>Floor 2 (F02)</option>
                    <option value={3}>Floor 3 (F03)</option>
                    <option value={4}>Floor 4 (F04)</option>
                    <option value={5}>Floor 5 (F05)</option>
                    <option value={6}>Floor 6 (F06)</option>
                    <option value={7}>Floor 7 (F07)</option>
                    <option value={8}>Floor 8 (F08)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Unit / Flat No.</label>
                  <input 
                    type="text" 
                    value={unitNum}
                    onChange={e => setUnitNum(e.target.value)}
                    placeholder="e.g. 302"
                    className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Type</label>
                  <select 
                    value={propType}
                    onChange={e => setPropType(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-sans cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Residential Apartment 2BHK">Apartment 2BHK</option>
                    <option value="Residential Apartment 3BHK">Apartment 3BHK</option>
                    <option value="Commercial Office Space">Office Space</option>
                    <option value="Retail Commercial Shop">Retail Shop</option>
                    <option value="Terrace Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? 'Registering...' : 'Confirm & Save Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title Certificate Modal */}
      {selectedCertItem && (
        <CertificateModal
          isOpen={!!selectedCertItem}
          onClose={() => setSelectedCertItem(null)}
          ulpin={selectedCertItem.ulpin}
          ownerName={selectedCertItem.owner}
          buildingName={selectedCertItem.building}
          floorNumber={selectedCertItem.floor}
          unitNumber={selectedCertItem.unit}
          propertyType={selectedCertItem.type}
          areaSqm={selectedCertItem.area}
        />
      )}
    </div>
  );
}
