import { 
  Home, Map, Database, LayoutDashboard, Search, 
  Layers, Upload, FileText, Settings, User, 
  ShieldAlert, Activity, GitCommit, FileWarning, HelpCircle, LogOut 
} from 'lucide-react';

export const ULPIN_FORMAT = 'XX-XX-XX-XX-XXXXXX';

export const DEMO_CREDENTIALS = {
  email: 'admin@3dulpin.gov.in',
  password: 'password123'
};

export const LAYER_TYPES = {
  SATELLITE: 'satellite',
  PARCEL: 'parcel',
  BUILDING: 'building',
  STREET: 'street',
  DRONE_MAP: 'drone_map'
};

export const PROPERTY_TYPES = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  GOVERNMENT: 'Government',
  AGRICULTURAL: 'Agricultural',
  MIXED: 'Mixed'
};

export const STATUS_COLORS = {
  VERIFIED: 'text-green-500 bg-green-100',
  PENDING: 'text-yellow-500 bg-yellow-100',
  FLAGGED: 'text-red-500 bg-red-100',
  PROCESSING: 'text-blue-500 bg-blue-100',
  COMPLETED: 'text-green-500 bg-green-100',
  FAILED: 'text-red-500 bg-red-100'
};

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: '3D GIS Map', path: '/map', icon: Map },
  { name: 'ULPIN Search', path: '/search', icon: Search },
  { name: 'Property Registry', path: '/registry', icon: Database },
  { name: 'Layers & Data', path: '/layers', icon: Layers },
  { name: 'Change Detection', path: '/changes', icon: Activity },
  { name: 'Validations', path: '/validations', icon: GitCommit },
  { name: 'Flagged Anomalies', path: '/flagged', icon: ShieldAlert },
  { name: 'Dispute Resolution', path: '/disputes', icon: FileWarning },
  { name: 'Document Vault', path: '/documents', icon: FileText },
  { name: 'Upload Datasets', path: '/upload', icon: Upload },
  { name: 'User Management', path: '/users', icon: User },
  { name: 'System Settings', path: '/settings', icon: Settings },
  { name: 'Help & Support', path: '/help', icon: HelpCircle },
  { name: 'Home Portal', path: '/', icon: Home },
  { name: 'Logout', path: '/logout', icon: LogOut },
];
