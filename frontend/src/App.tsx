import { Routes, Route, Navigate } from 'react-router-dom';
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
import ARVRViewerPage from './pages/ARVRViewerPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DatabasePage from './pages/DatabasePage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
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
        <Route path="ar-vr" element={<ARVRViewerPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="database" element={<DatabasePage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
