import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Box, Map, Layers, FileDigit, Database, History, CheckCircle, 
  Eye, AlertTriangle, HardDrive, Brain, LayoutDashboard, 
  Settings, LogOut, Search, User, Glasses, X, ChevronRight,
  ShieldAlert, Sparkles, Building, Home
} from 'lucide-react';
import { ulpinApi } from '../../api/ulpin';
import { ULPINSearchResult } from '../../types';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Database Explorer', path: '/database', icon: Database },
  { name: '3D GIS Map', path: '/map', icon: Map },
  { name: 'Vertical Explorer', path: '/explorer', icon: Layers },
  { name: 'Generate ULPIN', path: '/generate-ulpin', icon: FileDigit },
  { name: 'Property Registry', path: '/registry', icon: Database },
  { name: 'Registry History', path: '/registry-history', icon: History },
  { name: 'Validation', path: '/validation', icon: CheckCircle },
  { name: 'Change Detection', path: '/change-detection', icon: Eye },
  { name: 'Flagged Properties', path: '/flagged', icon: AlertTriangle },
  { name: 'Dataset Manager', path: '/datasets', icon: HardDrive },
  { name: 'AI Processing', path: '/ai-processing', icon: Brain },
  { name: 'Authority Dashboard', path: '/authority', icon: LayoutDashboard },
  { name: 'LiDAR Viewer', path: '/lidar', icon: Glasses },
  { name: 'AR / VR Mode', path: '/ar-vr', icon: Sparkles },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ULPINSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await ulpinApi.searchULPIN(searchQuery.trim());
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: ULPINSearchResult) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/map?ulpin=${encodeURIComponent(result.ulpin_code)}`);
  };

  return (
    <div className={`bg-slate-900 text-white h-full transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} border-r border-slate-800 relative z-40`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Box className="w-6 h-6 flex-shrink-0" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                3D ULPIN
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">Vertical GIS System</span>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Left-Side ULPIN Search Bar */}
      <div className="p-3 border-b border-slate-800 relative" ref={searchRef}>
        <div className="relative flex items-center bg-slate-800/90 rounded-xl border border-slate-700/70 focus-within:border-blue-500 transition-colors">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input 
            type="text" 
            placeholder={collapsed ? "" : "Search ULPIN, Owner, ID..."}
            className="bg-transparent border-none outline-none text-xs py-2.5 pl-9 pr-8 w-full text-white placeholder-slate-400 font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && !collapsed && (
          <div className="absolute top-full left-3 right-3 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto custom-scrollbar">
            <div className="p-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center bg-slate-950/60">
              <span>Matching Properties ({searchResults.length})</span>
              <span className="text-blue-400 font-mono">3D Ready</span>
            </div>
            
            <div className="divide-y divide-slate-800/60">
              {searchResults.map((r) => (
                <div
                  key={r.ulpin_code}
                  onClick={() => handleSelectResult(r)}
                  className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 group-hover:text-blue-300 truncate max-w-[170px]">
                      {r.ulpin_code}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{r.owner_name || 'Registered Owner'} • Unit {r.unit_number || '402'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={collapsed ? item.name : ''}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-xs">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer / System Online Badge */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-emerald-950/40 to-slate-900 rounded-xl border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {!collapsed && <span className="font-bold text-emerald-300 text-[11px]">SYSTEM ACTIVE</span>}
          </div>
          {!collapsed && <span className="text-[10px] text-slate-400 font-mono">EPSG:32645</span>}
        </div>

        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors text-xs"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
