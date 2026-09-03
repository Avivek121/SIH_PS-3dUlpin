import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Settings, ShieldCheck, 
  MapPin, CheckCircle2, AlertTriangle, ExternalLink, ChevronDown,
  Sun, Moon, Globe
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore, Language } from '../../store/themeStore';
import { ulpinApi } from '../../api/ulpin';
import { ULPINSearchResult } from '../../types';

const ROUTE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/database': 'PostgreSQL Database Explorer',
  '/map': '3D GIS Digital Twin Map',
  '/explorer': 'Vertical Building Explorer',
  '/generate-ulpin': 'Generate 3D ULPIN',
  '/registry': 'Property Registry',
  '/registry-history': 'Registry History & Audit',
  '/validation': 'AI Spatial Validation',
  '/change-detection': 'AI Change Detection',
  '/flagged': 'Flagged Properties & Violations',
  '/datasets': 'Agisoft Dataset Manager',
  '/ai-processing': 'AI Processing Pipeline',
  '/authority': 'Authority Analytics',
  '/lidar': 'LiDAR Point Cloud Viewer',
  '/profile': 'Officer Profile',
  '/settings': 'System Settings'
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Global ULPIN Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ULPINSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const currentTitle = ROUTE_NAMES[location.pathname] || 'LIMITS System';

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await ulpinApi.searchULPIN(searchQuery.trim());
        setSearchResults(results || []);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectSearch = (item: ULPINSearchResult) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/map?ulpin=${encodeURIComponent(item.ulpin_code)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    navigate(`/map?ulpin=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className={`h-16 ${
      theme === 'light' 
        ? 'bg-white/95 text-slate-800 border-b border-slate-200/90 shadow-sm' 
        : 'bg-slate-900/90 text-slate-100 border-b border-slate-800'
    } backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30 font-sans gap-4 transition-colors duration-300`}>
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-xs shrink-0">
        <span className={theme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}>
          Bhubaneswar Smart City
        </span>
        <span className="text-slate-500">/</span>
        <span className="text-blue-500 font-bold">{currentTitle}</span>
      </div>

      {/* ── Global Central ULPIN Search Bar ── */}
      <div className="relative flex-1 max-w-lg" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search 18-digit ULPIN, Owner, Building, Parcel (e.g. OD-BBSR-W12... or B03)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
            className="w-full rounded-full border border-slate-700 bg-slate-950/80 px-10 py-2 text-xs text-white placeholder-slate-400 font-mono shadow-inner outline-none transition-all focus:border-cyan-500 focus:bg-slate-900 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchDropdown(false); }}
              className="absolute right-3 text-slate-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </form>

        {/* Live Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="p-2.5 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center bg-slate-950/80">
              <span className="text-cyan-400">PostgreSQL Search Results ({searchResults.length})</span>
              <span className="text-[10px] text-slate-500 font-mono">Press Enter to View Map</span>
            </div>

            {isSearching ? (
              <div className="p-6 text-center text-xs text-slate-400 font-mono">
                Searching PostgreSQL Database...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No properties matching &ldquo;{searchQuery}&rdquo;. Try searching <strong className="text-cyan-400 font-mono">OD</strong>, <strong className="text-cyan-400 font-mono">P001</strong>, or <strong className="text-cyan-400 font-mono">B01</strong>.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {searchResults.map((r) => (
                  <div
                    key={r.ulpin_code}
                    onClick={() => handleSelectSearch(r)}
                    className="p-3 hover:bg-cyan-950/30 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-cyan-300 group-hover:text-cyan-200">
                        {r.ulpin_code}
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <span>👤 {r.owner_name || 'Registered Owner'}</span>
                        <span>•</span>
                        <span>🏢 Building {r.building_id || 'B01'}</span>
                        {r.unit_number && <span>• Unit {r.unit_number}</span>}
                      </div>
                      {r.address && (
                        <div className="text-[10px] text-slate-400">
                          📍 {r.address}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      3D Map ↗
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* PostgreSQL Database Clickable Badge (Officers Only) */}
        {(() => {
          const isOfficer = user?.role === 'admin' || user?.role === 'officer' || user?.email === 'officer.bbsr@ulpin3d.gov.in' || user?.email === 'admin@ulpin3d.gov.in';
          if (!isOfficer) return null;
          return (
            <button
              onClick={() => navigate('/database')}
              className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-950/60 to-slate-900 hover:from-emerald-900/80 hover:to-slate-800 border border-emerald-500/40 rounded-full text-xs text-emerald-300 font-bold shadow-inner transition-all cursor-pointer"
              title="Click to open PostgreSQL Database Explorer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('postgresConnected')}</span>
            </button>
          );
        })()}

        {/* Backend Interactive Swagger API Docs Button */}
        <a 
          href="http://localhost:8000/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 rounded-full text-xs font-semibold transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
          title="Open interactive Swagger API documentation in FastAPI"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span>⚡ Swagger API (21 Endpoints)</span>
        </a>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
              <div className="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
                <span className="text-xs font-bold text-white">Cadastral Activity (3)</span>
                <span className="text-[10px] text-blue-400 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto custom-scrollbar text-xs">
                <div className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1">
                  <div className="font-semibold text-blue-400">New 3D ULPIN Synthesized</div>
                  <p className="text-slate-400 text-[11px]">OD-BBSR-W12-P002-B03-F04-U02 mapped to Rajesh Patel</p>
                  <span className="text-[10px] text-slate-500 font-mono">10m ago</span>
                </div>
                <div className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1">
                  <div className="font-semibold text-red-400">AI Spatial Encroachment Flagged</div>
                  <p className="text-slate-400 text-[11px]">Building B04 height exceeds approved sanction by +0.9m</p>
                  <span className="text-[10px] text-slate-500 font-mono">1h ago</span>
                </div>
                <div className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1">
                  <div className="font-semibold text-emerald-400">LiDAR Point Cloud Ingested</div>
                  <p className="text-slate-400 text-[11px]">148M points aligned with 18 GCPs</p>
                  <span className="text-[10px] text-slate-500 font-mono">2h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Dark / Light Theme Mode Toggle Button ── */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            theme === 'light'
              ? 'bg-slate-100 text-amber-600 border-slate-300 hover:bg-slate-200 shadow-sm'
              : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* ── Multilingual Language Selector (English / Hindi / Odia) ── */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Change System Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase font-mono font-bold text-[11px]">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in duration-200 text-xs space-y-0.5">
              <button
                onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-slate-500 font-mono">EN</span>
              </button>
              <button
                onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  language === 'hi' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[10px] text-slate-500 font-mono">HI</span>
              </button>
              <button
                onClick={() => { setLanguage('or'); setShowLangMenu(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  language === 'or' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>ଓଡ଼ିଆ</span>
                <span className="text-[10px] text-slate-500 font-mono">OR</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          {(() => {
            const rawName = user?.full_name || '';
            const isDemo = !rawName || rawName.toLowerCase().includes('demo');
            const displayName = isDemo ? 'Municipal GIS Officer' : rawName;
            const displayRole = user?.role === 'admin' ? 'Revenue Authority' : (isDemo ? 'Officer (Ward 12)' : (user?.role || 'Citizen'));
            const displayEmail = (isDemo || !user?.email) ? 'officer.bbsr@ulpin3d.gov.in' : user.email;

            return (
              <>
                <div 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
                    {displayName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-200 leading-none">{displayName}</div>
                    <div className="text-[10px] text-cyan-400 mt-0.5 leading-none font-mono">{displayRole}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Menu Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 space-y-1 text-xs font-medium">
                    <div className="p-2 border-b border-slate-800 text-[11px] text-slate-400">
                      Signed in as <span className="font-bold text-white block truncate">{displayEmail}</span>
                    </div>
                    <button 
                      onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-400" /> My Officer Profile
                    </button>
                    <button 
                      onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-purple-400" /> System Preferences
                    </button>
                    <button 
                      onClick={() => { logout(); navigate('/login'); }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-800/80 pt-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </header>
  );
}
