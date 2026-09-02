import os

base_dir = "/Users/vivekkumar/Desktop/3dulpin/frontend/src"
directories = [
    "",
    "components",
    "components/layout",
    "components/auth",
    "pages",
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

files["main.tsx"] = """import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
"""

files["App.tsx"] = """import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import VerticalExplorerPage from './pages/VerticalExplorerPage';
import GenerateULPINPage from './pages/GenerateULPINPage';
import RegistryPage from './pages/RegistryPage';
import RegistryHistoryPage from './pages/RegistryHistoryPage';
import ValidationPage from './pages/ValidationPage';
import ChangeDetectionPage from './pages/ChangeDetectionPage';
import FlaggedPropertiesPage from './pages/FlaggedPropertiesPage';
import DatasetManagerPage from './pages/DatasetManagerPage';
import AIProcessingPage from './pages/AIProcessingPage';
import AuthorityDashboardPage from './pages/AuthorityDashboardPage';
import LiDARViewerPage from './pages/LiDARViewerPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Simple auth check mock
const isAuthenticated = true;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="explorer" element={<VerticalExplorerPage />} />
        <Route path="generate-ulpin" element={<GenerateULPINPage />} />
        <Route path="registry" element={<RegistryPage />} />
        <Route path="registry-history" element={<RegistryHistoryPage />} />
        <Route path="validation" element={<ValidationPage />} />
        <Route path="change-detection" element={<ChangeDetectionPage />} />
        <Route path="flagged" element={<FlaggedPropertiesPage />} />
        <Route path="datasets" element={<DatasetManagerPage />} />
        <Route path="ai-processing" element={<AIProcessingPage />} />
        <Route path="authority" element={<AuthorityDashboardPage />} />
        <Route path="lidar" element={<LiDARViewerPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
"""

files["components/layout/Sidebar.tsx"] = """import { NavLink } from 'react-router-dom';
import { 
  Box, Map, Layers, FileDigit, Database, History, CheckCircle, 
  Eye, AlertTriangle, HardDrive, Brain, LayoutDashboard, 
  Settings, LogOut, Search, User, Glasses
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
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
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`bg-slate-900 text-white h-full transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 h-16">
        <Box className="w-8 h-8 text-blue-500 flex-shrink-0 cursor-pointer" onClick={() => setCollapsed(!collapsed)} />
        {!collapsed && <span className="font-bold text-xl tracking-tight">3D ULPIN</span>}
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="relative flex items-center bg-slate-800 rounded-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder={collapsed ? "" : "Search ULPIN..."}
            className="bg-transparent border-none outline-none text-sm py-2 pl-9 pr-3 w-full text-white placeholder-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={collapsed ? item.name : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-center p-1 bg-blue-900/50 text-blue-400 rounded text-xs font-bold border border-blue-800">
          {collapsed ? 'DEMO' : 'DEMO MODE'}
        </div>
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white w-full transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
"""

files["components/layout/TopBar.tsx"] = """import { Bell, Search, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500 font-medium">
          Dashboard <span className="mx-2 text-slate-300">/</span> Overview
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search resources..."
            className="w-full bg-slate-100 border-none outline-none text-sm py-2 pl-9 pr-4 rounded-full text-slate-700"
          />
        </div>

        <div className="flex items-center justify-center px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold border border-amber-200">
          DEMO MODE
        </div>

        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer border-l pl-6 border-slate-200 group">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Authority User</div>
            <div className="text-xs text-slate-500">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
"""

files["components/layout/DashboardLayout.tsx"] = """import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
"""

files["pages/LandingPage.tsx"] = """import { Link } from 'react-router-dom';
import { Box, QrCode, Satellite, CheckCircle, Eye, Building2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          3D ULPIN
        </h1>
        <h2 className="text-3xl font-semibold mb-6 text-slate-200">
          From Land Parcel to 3D Property Space
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mb-10">
          Building the Digital Foundation for Vertical Property Records. Transforming 2D cadastral records into rich, multi-dimensional, intelligent data models for smart cities and automated property governance.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/map" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Explore 3D Map
          </Link>
          <Link to="/dashboard" className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
            Search ULPIN
          </Link>
          <Link to="/register" className="px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
            Create Account
          </Link>
          <Link to="/login" className="px-6 py-3 bg-transparent hover:text-blue-400 text-slate-300 rounded-lg font-medium transition-colors">
            Login
          </Link>
        </div>
        
        <div className="mt-20 py-6 px-10 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex flex-wrap gap-12 justify-center">
          <div className="text-center"><div className="text-3xl font-bold text-white mb-1">10,000+</div><div className="text-sm text-slate-400 uppercase tracking-wider">Properties</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-white mb-1">5,000+</div><div className="text-sm text-slate-400 uppercase tracking-wider">ULPINs</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-white mb-1">50+</div><div className="text-sm text-slate-400 uppercase tracking-wider">Wards</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-blue-400 mb-1">Live</div><div className="text-sm text-slate-400 uppercase tracking-wider">Monitoring</div></div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="py-24 bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16">Platform Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Box, title: "3D Property Mapping", desc: "True volumetric representation of properties down to individual units and common areas." },
              { icon: QrCode, title: "3D ULPIN", desc: "Unique 18-digit identifier extending standard ULPIN with building, floor, and unit levels." },
              { icon: Satellite, title: "Spatial Intelligence", desc: "Integrate LiDAR, Drone imagery, and GNSS data for centimeter-level accuracy." },
              { icon: CheckCircle, title: "Property Validation", desc: "Automated verification of physical structures against municipal records." },
              { icon: Eye, title: "Change Detection", desc: "AI-powered detection of new constructions, modifications, or demolitions." },
              { icon: Building2, title: "Digital Twin", desc: "Live synchronization between the physical property and its digital registry." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group hover:-translate-y-1">
                <f.icon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold mb-3 text-slate-200">{f.title}</h4>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-4">3D ULPIN</div>
            <p className="text-slate-400 mb-6">Vertical property records for modern smart cities.</p>
            <div className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-semibold border border-blue-800/50">Built for SIH 2026</div>
          </div>
          <div>
            <h5 className="text-slate-200 font-semibold mb-4">Product</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/map" className="hover:text-blue-400">3D Map</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-200 font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400">API</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-200 font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
          © 2026 3D ULPIN Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
"""

files["pages/LoginPage.tsx"] = """import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900 z-0"></div>
        <div className="relative z-10 text-white font-bold text-3xl flex items-center gap-2">
          3D ULPIN
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Securing the Future of Property Records.</h2>
          <p className="text-slate-400 text-lg max-w-md">Login to access vertical property models, spatial intelligence, and automated validation tools.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex flex-col gap-1">
            <strong>DEMO MODE</strong>
            <span>Email: demo@ulpin3d.dev</span>
            <span>Pass: demo123</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue="demo@ulpin3d.dev" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              </div>
              <input type="password" defaultValue="demo123" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              Login
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 text-slate-500">or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors">
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors">
              Continue with Apple
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors">
              Continue with Phone
            </button>
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/RegisterPage.tsx"] = """import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-slate-50 items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create your ULPIN Account</h1>
          <p className="text-slate-500 mt-2">Join the 3D property revolution</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="terms" className="rounded text-blue-600 focus:ring-blue-500" />
            <label htmlFor="terms" className="text-sm text-slate-600">I agree to Terms & Privacy Policy</label>
          </div>
          
          <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
            Create Account
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
"""

files["components/auth/PhoneOTP.tsx"] = """import { useState } from 'react';

export default function PhoneOTP() {
  const [sent, setSent] = useState(false);
  
  return (
    <div className="space-y-4">
      {!sent ? (
        <div className="space-y-4">
          <div className="flex border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-4 py-2 bg-slate-50 border-r border-slate-300 text-slate-600 font-medium">+91</span>
            <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2 outline-none" />
          </div>
          <button onClick={() => setSent(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-center text-slate-600 mb-2">Enter 6-digit OTP sent to your phone</div>
          <div className="flex justify-between gap-2">
            {[1,2,3,4,5,6].map(i => (
              <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-xl font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">Use OTP: 123456</span>
          </div>
          <div className="flex gap-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">Verify</button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg">Resend OTP</button>
          </div>
        </div>
      )}
    </div>
  );
}
"""

files["pages/DashboardPage.tsx"] = """import { Link } from 'react-router-dom';
import { Search, FileDigit, HardDrive, Map } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total ULPINs', value: '5,243', color: 'text-blue-600' },
          { label: 'Registered', value: '4,102', color: 'text-green-600' },
          { label: 'Unregistered', value: '1,141', color: 'text-slate-600' },
          { label: 'Flagged', value: '87', color: 'text-red-600' },
          { label: 'Pending Val', value: '234', color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/dashboard" className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 text-blue-600">
                <Search />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Search ULPIN</div>
                <div className="text-sm text-slate-500">Find properties</div>
              </div>
            </Link>
            <Link to="/generate-ulpin" className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 text-indigo-600">
                <FileDigit />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Generate ULPIN</div>
                <div className="text-sm text-slate-500">Create new IDs</div>
              </div>
            </Link>
            <Link to="/datasets" className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 text-green-600">
                <HardDrive />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Upload Dataset</div>
                <div className="text-sm text-slate-500">Drone/LiDAR data</div>
              </div>
            </Link>
            <Link to="/map" className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 text-amber-600">
                <Map />
              </div>
              <div>
                <div className="font-semibold text-slate-900">View Map</div>
                <div className="text-sm text-slate-500">3D GIS Explorer</div>
              </div>
            </Link>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { text: 'New ULPIN generated for Building A, Floor 2', time: '10 mins ago', type: 'create' },
                { text: 'Validation completed for 45 properties in Ward 12', time: '1 hour ago', type: 'validate' },
                { text: 'Anomaly detected in parcel ID #49281', time: '3 hours ago', type: 'alert' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${act.type === 'create' ? 'bg-green-500' : act.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <div className="text-sm text-slate-800">{act.text}</div>
                    <div className="text-xs text-slate-500">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 px-2">Map Preview</h2>
          <div className="flex-1 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 bg-blue-50 opacity-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 font-medium">Map Preview Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/MapPage.tsx"] = """import { useState } from 'react';
import { Layers, X, Download, Eye, FileText, ChevronRight } from 'lucide-react';

export default function MapPage() {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* 3D Map Area */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden" id="cesium-container">
        {/* CSS Demo Map Background */}
        <div className="absolute inset-0 bg-slate-800 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Simulated 3D buildings */}
          <div className="absolute top-1/4 left-1/4 w-32 h-40 bg-blue-500/20 border-t-2 border-l-2 border-blue-400/50 transform -skew-x-12 rotate-12 cursor-pointer hover:bg-blue-400/40 transition-colors flex items-end justify-center pb-2">
            <span className="text-xs text-blue-200 font-bold bg-slate-900/50 px-1 rounded">B-101</span>
          </div>
          <div className="absolute top-1/2 left-1/2 w-48 h-32 bg-indigo-500/20 border-t-2 border-l-2 border-indigo-400/50 transform -skew-x-12 rotate-12 cursor-pointer hover:bg-indigo-400/40 transition-colors flex items-end justify-center pb-2">
            <span className="text-xs text-indigo-200 font-bold bg-slate-900/50 px-1 rounded">C-204</span>
          </div>
        </div>
        
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-lg border border-slate-700 z-10 font-mono text-sm">
          Loading 3D Map... (Demo Active)
        </div>

        {/* Layer Controls - Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 flex gap-6 shadow-2xl z-10">
          {['Parcels', 'Buildings', 'Floors', 'Units', 'LiDAR', 'Roads'].map((layer, i) => (
            <label key={layer} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <input type="checkbox" defaultChecked={i < 4} className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
              {layer}
            </label>
          ))}
        </div>

        {/* Right Info Panel */}
        {panelOpen && (
          <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-20 flex flex-col transform transition-transform border-l border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" /> Property Details
              </h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="mb-6">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">3D ULPIN</div>
                <div className="text-2xl font-mono font-bold text-slate-900 tracking-tight bg-blue-50 p-2 rounded border border-blue-100">
                  27-042-1-008-01-04-12
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><span className="text-slate-500 block">Property Type</span><span className="font-medium">Residential Appt</span></div>
                  <div><span className="text-slate-500 block">Area</span><span className="font-medium">1,240 sq.ft</span></div>
                  <div><span className="text-slate-500 block">Floor</span><span className="font-medium">4th Floor</span></div>
                  <div><span className="text-slate-500 block">Building</span><span className="font-medium">Tower A</span></div>
                  <div><span className="text-slate-500 block">Owner</span><span className="font-medium">Rahul Sharma</span></div>
                  <div><span className="text-slate-500 block">Status</span><span className="text-green-600 font-semibold">Registered</span></div>
                </div>

                <div className="h-px bg-slate-200 my-4"></div>

                <h3 className="font-semibold text-slate-800 mb-3">Validation Status</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                  <div>
                    <div className="text-sm font-semibold text-green-900">Verified Match</div>
                    <div className="text-xs text-green-700 mt-1">3D scan matches municipal records within 2% tolerance.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-sm">
                <Eye className="w-4 h-4" /> Open Vertical Explorer
              </button>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg transition-colors text-sm">
                  <FileText className="w-4 h-4" /> Registry
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4" /> Cert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""

files["pages/VerticalExplorerPage.tsx"] = """import { useState } from 'react';
import { Layers, Building, ChevronsUpDown, RotateCcw } from 'lucide-react';

export default function VerticalExplorerPage() {
  const [exploded, setExploded] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const floors = [5, 4, 3, 2, 1, 0]; // 0 is ground

  return (
    <div className="absolute inset-0 flex">
      {/* Left Panel */}
      <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col z-10">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" /> Buildings
        </h2>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {['Tower A', 'Tower B', 'Commercial Plaza', 'Block C'].map((b, i) => (
            <div key={b} className={`p-3 rounded-lg cursor-pointer border text-sm font-medium transition-colors ${i === 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Center 3D Area */}
      <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
        {/* Controls */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button onClick={() => setExploded(!exploded)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors">
            <ChevronsUpDown className="w-4 h-4" /> {exploded ? 'Collapse' : 'Explode'} View
          </button>
          <button onClick={() => setSelectedFloor(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* CSS 3D Building Representation */}
        <div className="relative perspective-1000 w-full max-w-md h-[600px] flex flex-col items-center justify-end pb-20">
          {floors.map((floor) => {
            const isSelected = selectedFloor === floor;
            const yOffset = exploded ? (floors.length - floor) * 40 : 0;
            return (
              <div 
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`relative w-64 h-16 border-2 transition-all duration-500 cursor-pointer transform preserve-3d
                  ${isSelected ? 'bg-blue-500/40 border-blue-400 scale-110 z-20' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/60 z-10'}
                `}
                style={{
                  transform: `rotateX(60deg) rotateZ(45deg) translateZ(${yOffset}px)`,
                  marginBottom: exploded ? '-20px' : '-45px'
                }}
              >
                {/* Floor Label inside */}
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-bold transform -rotate-45 rotate-x-[-60deg]">
                  {floor === 0 ? 'GF' : `F${floor}`}
                </div>

                {/* Sub-units if selected */}
                {isSelected && (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                    {[1,2,3,4].map(u => (
                      <div key={u} className="bg-blue-400/50 border border-blue-300/50 hover:bg-blue-300/70 transition-colors"></div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {/* Ground Base */}
          <div className="absolute bottom-10 w-80 h-80 bg-slate-800/80 border border-slate-700 transform rotateX(60deg) rotateZ(45deg) -z-10 blur-[2px]"></div>
        </div>
      </div>

      {/* Right Panel */}
      {selectedFloor !== null && (
        <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col z-10 shadow-xl">
          <h2 className="font-bold text-xl text-slate-900 mb-6">Floor {selectedFloor === 0 ? 'Ground' : selectedFloor}</h2>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="text-sm text-slate-500 mb-1">Selected Unit</div>
              <div className="font-bold text-lg text-blue-900">{selectedFloor}01</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">ULPIN</span>
                <span className="font-mono font-medium text-slate-900">27042...04</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Owner</span>
                <span className="font-medium text-slate-900">Priya Singh</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Area</span>
                <span className="font-medium text-slate-900">950 sq.ft</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-900">Residential</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
            View Full Registry
          </button>
        </div>
      )}
    </div>
  );
}
"""

files["pages/GenerateULPINPage.tsx"] = """import { useState } from 'react';
import { FileDigit, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GenerateULPINPage() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Generate 3D ULPIN</h1>
        <p className="text-slate-500 mt-1">Create unique identifiers for vertical property units</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State Code (2 digits)</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option>27 (Maharashtra)</option>
                <option>07 (Delhi)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">District Code (3 digits)</label>
              <input type="text" defaultValue="042" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-District (1 digit)</label>
              <input type="text" defaultValue="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Village/Ward (3 digits)</label>
              <input type="text" defaultValue="008" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
          </div>

          <div className="h-px bg-slate-200 my-2"></div>
          <h3 className="font-semibold text-slate-800">Vertical Extension (3D Attributes)</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Parcel ID</label>
              <input type="text" defaultValue="01" className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Floor No.</label>
              <input type="text" defaultValue="04" className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Unit No.</label>
              <input type="text" defaultValue="12" className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
          </div>

          <button onClick={() => setGenerated(true)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
            Generate 3D ULPIN <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="bg-slate-900 rounded-2xl p-6 text-white h-full flex flex-col">
            <h3 className="font-semibold text-slate-300 flex items-center gap-2 mb-6">
              <FileDigit className="w-5 h-5" /> Live Preview
            </h3>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              {generated ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                  <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Generated ULPIN</div>
                  <div className="text-3xl font-mono font-bold text-blue-400 bg-blue-900/30 p-4 rounded-xl border border-blue-800">
                    270421008010412
                  </div>
                  <p className="text-sm text-slate-400 mt-4">Successfully mapped to 3D spatial registry.</p>
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  Fill details to generate ID
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/RegistryPage.tsx"] = """import { Database, Filter, Download } from 'lucide-react';

export default function RegistryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property Registry</h1>
          <p className="text-slate-500 mt-1">Master database of all 3D ULPIN entries</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">3D ULPIN</th>
                <th className="px-6 py-4 font-semibold">Property Type</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Area/Vol</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { id: '27-042-1-008-01-04-12', type: 'Residential', owner: 'Rahul Sharma', area: '1,240 sq.ft', status: 'Active' },
                { id: '27-042-1-008-01-04-13', type: 'Residential', owner: 'Amit Patel', area: '980 sq.ft', status: 'Active' },
                { id: '27-042-1-008-02-01-01', type: 'Commercial', owner: 'TechCorp Ltd', area: '5,000 sq.ft', status: 'Pending' },
                { id: '27-042-1-008-03-02-04', type: 'Residential', owner: 'Neha Gupta', area: '1,100 sq.ft', status: 'Flagged' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{row.id}</td>
                  <td className="px-6 py-4 text-slate-700">{row.type}</td>
                  <td className="px-6 py-4 text-slate-700">{row.owner}</td>
                  <td className="px-6 py-4 text-slate-700">{row.area}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/RegistryHistoryPage.tsx"] = """import { History } from 'lucide-react';

export default function RegistryHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Registry History</h1>
        <p className="text-slate-500 mt-1">Audit trail of modifications to property records</p>
      </div>

      <div className="max-w-3xl bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {[
            { date: 'Today, 10:30 AM', title: 'Ownership Transfer', user: 'Admin System', desc: 'Ownership transferred from Builder to Rahul Sharma.' },
            { date: 'Yesterday, 14:15 PM', title: '3D Validation Passed', user: 'Auto-Validator', desc: 'AI successfully matched LiDAR scan with submitted floor plan.' },
            { date: 'Oct 12, 2025, 09:00 AM', title: 'ULPIN Generated', user: 'Authority User', desc: 'Base ID 27-042-1-008-01-04-12 created for new property.' },
          ].map((item, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
              <div className="text-xs text-slate-400 font-medium mb-1">{item.date}</div>
              <div className="text-sm font-semibold text-slate-900 mb-1">{item.title}</div>
              <div className="text-sm text-slate-600 mb-2">{item.desc}</div>
              <div className="text-xs text-slate-500">By: {item.user}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"""

files["pages/ValidationPage.tsx"] = """import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function ValidationPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Property Validation</h1>
        <p className="text-slate-500 mt-1">Compare physical 3D scans against official municipal records</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="font-mono text-lg font-bold text-slate-800">Target: 27-042-1-008-01</div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Parameter</th>
              <th className="px-6 py-4 font-semibold">Official Record</th>
              <th className="px-6 py-4 font-semibold">3D Extracted Data</th>
              <th className="px-6 py-4 font-semibold">Difference</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-800">Building Height</td>
              <td className="px-6 py-4 text-slate-600">18.2m</td>
              <td className="px-6 py-4 text-slate-600">19.1m</td>
              <td className="px-6 py-4 text-red-600 font-medium">+0.9m</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold w-fit">
                  <AlertTriangle className="w-3 h-3" /> FLAGGED
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-800">Total Floors</td>
              <td className="px-6 py-4 text-slate-600">5</td>
              <td className="px-6 py-4 text-slate-600">5</td>
              <td className="px-6 py-4 text-green-600 font-medium">0</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold w-fit">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-800">Footprint Area</td>
              <td className="px-6 py-4 text-slate-600">450 sq.m</td>
              <td className="px-6 py-4 text-slate-600">455 sq.m</td>
              <td className="px-6 py-4 text-slate-600 font-medium">+5 sq.m (within tolerance)</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold w-fit">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""

files["pages/ChangeDetectionPage.tsx"] = """import { Eye } from 'lucide-react';

export default function ChangeDetectionPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Change Detection</h1>
        <p className="text-slate-500 mt-1">AI-powered detection of unregistered modifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-300 transition-colors">
            <div className="h-40 bg-slate-100 relative flex border-b border-slate-200">
              <div className="w-1/2 bg-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium border-r border-slate-300">
                2024 Scan
              </div>
              <div className="w-1/2 bg-slate-300 flex items-center justify-center text-xs text-slate-600 font-medium relative">
                2026 Scan
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900">Unauthorized Extension</h3>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">98% Conf.</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">New structure detected on roof level. Not present in municipal registry.</p>
              <div className="text-xs font-mono text-slate-500 mb-4">Ref ID: 27-042-1-008-05</div>
              <button className="w-full text-center text-sm text-blue-600 font-medium hover:bg-blue-50 py-2 rounded-lg transition-colors">
                Investigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

files["pages/FlaggedPropertiesPage.tsx"] = """import { AlertTriangle } from 'lucide-react';

export default function FlaggedPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Flagged Properties</h1>
        <p className="text-slate-500 mt-1">Properties requiring authority review</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 text-center text-slate-500">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">Demo Data Loading</h3>
        <p className="text-sm">List of flagged properties will appear here.</p>
      </div>
    </div>
  );
}
"""

files["pages/DatasetManagerPage.tsx"] = """import { HardDrive, UploadCloud } from 'lucide-react';

export default function DatasetManagerPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dataset Manager</h1>
        <p className="text-slate-500 mt-1">Upload and manage Drone/LiDAR source data</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl border-dashed p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
        <UploadCloud className="w-16 h-16 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Drag & Drop Dataset Here</h3>
        <p className="text-sm text-slate-500 mb-4">Supports .las, .laz, .obj, and drone imagery folders.</p>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          Browse Files
        </button>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Uploads (Demo)</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-sm font-medium text-slate-800">Ward_08_LiDAR_Scan.laz</div>
                <div className="text-xs text-slate-500">1.2 GB • Uploaded 2 hrs ago</div>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Processed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/AIProcessingPage.tsx"] = """import { Brain } from 'lucide-react';

export default function AIProcessingPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Processing Pipeline</h1>
        <p className="text-slate-500 mt-1">Monitor the status of automated 3D extraction</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 space-y-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-blue-400">Current Job: Ward_08_Reconstruction</h2>
          
          <div className="space-y-6">
            {[
              { step: 'Point Cloud Denoising', status: 'done' },
              { step: 'Building Segmentation', status: 'done' },
              { step: 'Floor Extraction', status: 'active' },
              { step: '3D Mesh Generation', status: 'pending' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${s.status === 'done' ? 'bg-green-500 text-white' : 
                    s.status === 'active' ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}
                `}>
                  {i + 1}
                </div>
                <div className={`font-medium ${s.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                  {s.step}
                </div>
                {s.status === 'active' && <div className="text-xs text-blue-400 ml-auto">Processing (45%)</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/AuthorityDashboardPage.tsx"] = """import { LayoutDashboard } from 'lucide-react';

export default function AuthorityDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Authority Dashboard</h1>
        <p className="text-slate-500 mt-1">High-level analytics for municipal authorities</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-12 text-center">
        <LayoutDashboard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">Analytics View</h3>
        <p className="text-slate-500 mt-2">Charts and reports will be rendered here via Recharts.</p>
      </div>
    </div>
  );
}
"""

files["pages/LiDARViewerPage.tsx"] = """import { Glasses } from 'lucide-react';

export default function LiDARViewerPage() {
  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-white shrink-0">
        <h1 className="font-bold flex items-center gap-2"><Glasses className="w-5 h-5 text-blue-400"/> Raw LiDAR Viewer</h1>
        <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded">1.2M Points Rendered</div>
      </div>
      
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Fake point cloud using CSS particles */}
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl mix-blend-screen"></div>
        <div className="absolute w-96 h-32 rounded-full bg-green-500/10 blur-2xl mix-blend-screen transform rotate-45"></div>
        <div className="text-slate-600 font-mono text-sm z-10 border border-slate-700 px-4 py-2 rounded bg-slate-900/50 backdrop-blur">
          Interactive Point Cloud visualization active
        </div>
      </div>
    </div>
  );
}
"""

files["pages/ProfilePage.tsx"] = """import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Authority User</h2>
            <p className="text-slate-500">Municipal Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

files["pages/SettingsPage.tsx"] = """import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-slate-500" /> Settings
      </h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="text-slate-500 text-center py-12">
          Configuration options for mapping engine, AI thresholds, and notifications.
        </div>
      </div>
    </div>
  );
}
"""

files["pages/NotFoundPage.tsx"] = """import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-6">The 3D coordinate you are looking for does not exist in this spatial registry.</p>
      <Link to="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
        Return Home
      </Link>
    </div>
  );
}
"""

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    with open(full_path, "w") as f:
        f.write(content)

print("Files generated successfully!")
