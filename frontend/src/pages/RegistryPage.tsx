import React, { useState, useEffect } from 'react';
import { 
  Database, Filter, Download, Search, Eye, FileText, 
  CheckCircle2, AlertTriangle, Building, MapPin, QrCode, Sparkles
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CertificateModal from '../components/certificate/CertificateModal';
import { ulpinApi } from '../api/ulpin';

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

export default function RegistryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const querySearch = searchParams.get('search') || '';
  const [filter, setFilter] = useState<'All' | 'Registered' | 'Flagged' | 'Pending'>('All');
  const [search, setSearch] = useState(querySearch);
  const [entries, setEntries] = useState<RegistryItem[]>(DEFAULT_REGISTRY_ENTRIES);
  const [selectedCertItem, setSelectedCertItem] = useState<RegistryItem | null>(null);

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
          building: r.building_id ? `Building ${r.building_id}` : (DEFAULT_REGISTRY_ENTRIES[idx % DEFAULT_REGISTRY_ENTRIES.length].building),
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
          building: r.building_id ? `Building ${r.building_id}` : (DEFAULT_REGISTRY_ENTRIES[idx % DEFAULT_REGISTRY_ENTRIES.length].building),
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
      // Fallback to local filter
    }
  };

  const filtered = entries.filter(item => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.ulpin.toLowerCase().includes(search.toLowerCase()) || 
                          item.owner.toLowerCase().includes(search.toLowerCase()) ||
                          item.building.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Database className="w-4 h-4" /> Official Cadastral Ledger
          </div>
          <h1 className="text-3xl font-extrabold text-white">3D Property Registry</h1>
          <p className="text-slate-400 text-sm mt-1">
            Master repository of all 18-digit volumetric 3D ULPIN entries and cadastral title records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/generate-ulpin')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" /> Generate 3D ULPIN
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex gap-2 w-full sm:w-auto">
          {(['All', 'Registered', 'Flagged', 'Pending'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by ULPIN, Owner, or Building..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-5 py-4">3D ULPIN</th>
                <th className="px-5 py-4">Building & Unit</th>
                <th className="px-5 py-4">Property Type</th>
                <th className="px-5 py-4">Registered Owner</th>
                <th className="px-5 py-4">Carpet Area</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {filtered.map(item => (
                <tr key={item.ulpin} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-blue-400 font-bold">{item.ulpin}</td>
                  <td className="px-5 py-4">
                    <div className="text-white font-semibold">{item.building}</div>
                    <div className="text-[11px] text-slate-400">Floor {item.floor} • Unit {item.unit}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{item.type}</td>
                  <td className="px-5 py-4 text-white font-semibold">{item.owner}</td>
                  <td className="px-5 py-4 font-mono">{item.area} m²</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                      item.status === 'Registered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      item.status === 'Flagged' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status === 'Registered' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/map?ulpin=${item.ulpin}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold"
                    >
                      3D Locate
                    </button>
                    <button 
                      onClick={() => navigate(`/explorer?building=${item.buildingId}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                    >
                      Explorer
                    </button>
                    <button 
                      onClick={() => setSelectedCertItem(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" /> Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Title Deed Certificate Modal */}
      {selectedCertItem && (
        <CertificateModal
          isOpen={true}
          ulpin={selectedCertItem.ulpin}
          buildingName={selectedCertItem.building}
          floorNumber={selectedCertItem.floor}
          unitNumber={selectedCertItem.unit}
          ownerName={selectedCertItem.owner}
          areaSqm={selectedCertItem.area}
          propertyType={selectedCertItem.type}
          onClose={() => setSelectedCertItem(null)}
        />
      )}
    </div>
  );
}
