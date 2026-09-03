import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Settings, ShieldCheck, 
  MapPin, CheckCircle2, AlertTriangle, ExternalLink, ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ROUTE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentTitle = ROUTE_NAMES[location.pathname] || '3D ULPIN System';

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 font-sans text-slate-100">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Bhubaneswar Smart City</span>
        <span className="text-slate-600">/</span>
        <span className="text-blue-400 font-bold">{currentTitle}</span>
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* PostgreSQL Database Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-full text-xs text-emerald-300 font-bold shadow-inner" title="PostgreSQL 18.6 connected to ulpin3d database">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>🗄️ DB: POSTGRES (179 ULPINs)</span>
        </div>

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

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              {user?.full_name ? user.full_name.charAt(0) : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-none">{user?.full_name || 'Authority User'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-none font-mono">{user?.role || 'Admin'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 space-y-1 text-xs font-medium">
              <div className="p-2 border-b border-slate-800 text-[11px] text-slate-400">
                Signed in as <span className="font-bold text-white block truncate">{user?.email || 'officer.bbsr@ulpin3d.gov.in'}</span>
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
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-800/80 pt-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
