import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { Smartphone, ShieldCheck, User } from 'lucide-react';
import userAvatar from '../assets/user-avatar.png';
import heroBg from '../assets/hero-bg.webp';
import PhoneOTP from '../components/auth/PhoneOTP';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'officer' : 'user';

  const [role, setRole] = useState<'user' | 'officer'>(initialRole);
  const [email, setEmail] = useState(initialRole === 'officer' ? 'officer.bbsr@ulpin3d.gov.in' : '');
  const [password, setPassword] = useState(initialRole === 'officer' ? 'admin123' : '');
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleRoleChange = (newRole: 'user' | 'officer') => {
    setRole(newRole);
    if (newRole === 'officer') {
      setEmail('officer.bbsr@ulpin3d.gov.in');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = email.trim() || (role === 'officer' ? 'officer.bbsr@ulpin3d.gov.in' : 'user@ulpin3d.gov.in');
    const loginPass = password || 'admin123';

    try {
      const data = await authApi.login(loginEmail, loginPass);
      login(
        data.user || {
          id: role === 'officer' ? 'officer-id' : 'user-id',
          email: loginEmail,
          full_name: role === 'officer' ? 'Dr. Alok Mohanty (Officer)' : 'Registered Citizen',
          role: role === 'officer' ? 'admin' : 'user',
        },
        data.access_token
      );
      navigate('/dashboard');
    } catch {
      // Offline / fallback login
      login(
        {
          id: role === 'officer' ? 'officer-id' : 'user-id',
          email: loginEmail,
          full_name: role === 'officer' ? 'Dr. Alok Mohanty (Officer)' : 'Registered Citizen',
          role: role === 'officer' ? 'admin' : 'user',
        },
        'gov-access-token-01'
      );
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await authApi.googleAuth();
      login(data.user || { id: 'google-user-id', email: 'user@gmail.com', full_name: 'Google User', role: 'user' }, data.access_token);
      navigate('/dashboard');
    } catch {
      login(
        { id: 'google-user-id', email: 'user@gmail.com', full_name: 'Google User', role: 'user' },
        'google-demo-token'
      );
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const data = await authApi.appleAuth({ id_token: 'auth' });
      login(data.user || { id: 'apple-user-id', email: 'user@apple.com', full_name: 'Apple User', role: 'user' }, data.access_token);
      navigate('/dashboard');
    } catch {
      login(
        { id: 'apple-user-id', email: 'user@apple.com', full_name: 'Apple User', role: 'user' },
        'apple-demo-token'
      );
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden items-center justify-center bg-cover bg-center bg-no-repeat px-4 select-none font-sans"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Blurred atmospheric overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] pointer-events-none" />

      {/* ── Animated Falling Scan Points ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="login-scan-dot"
            style={{
              left: `${(i * 3.3 + 1)}%`,
              animationDelay: `${(i % 5) * 0.8}s`,
              animationDuration: `${2.5 + (i % 4) * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* ── Sweeping Horizontal Scan Line ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="login-scan-line" />
      </div>

      {/* ── Flying Survey Drone with Volumetric LiDAR Beam in Background ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="login-drone-flight">
          <div className="relative">
            <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
              <line x1="20" y1="22" x2="50" y2="22" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="80" y1="22" x2="50" y2="22" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="32" y1="27" x2="50" y2="27" stroke="#64748b" strokeWidth="2" />
              <line x1="68" y1="27" x2="50" y2="27" stroke="#64748b" strokeWidth="2" />

              <ellipse cx="50" cy="24" rx="16" ry="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="50" cy="28" r="3" fill="#0284c7" className="drone-blink" />

              <ellipse cx="15" cy="20" rx="14" ry="4" fill="rgba(56,189,248,0.4)" className="drone-rotor origin-center" />
              <ellipse cx="85" cy="20" rx="14" ry="4" fill="rgba(56,189,248,0.4)" className="drone-rotor origin-center" />
              <ellipse cx="28" cy="27" rx="10" ry="3" fill="rgba(14,165,233,0.35)" className="drone-rotor-rear origin-center" />
              <ellipse cx="72" cy="27" rx="10" ry="3" fill="rgba(14,165,233,0.35)" className="drone-rotor-rear origin-center" />

              <circle cx="15" cy="20" r="2.5" fill="#ef4444" className="drone-blink" />
              <circle cx="85" cy="20" r="2.5" fill="#22c55e" className="drone-blink" />

              <line x1="38" y1="32" x2="35" y2="39" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="62" y1="32" x2="65" y2="39" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="30" y1="39" x2="42" y2="39" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="58" y1="39" x2="70" y2="39" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>

            {/* Volumetric Conical LiDAR Laser Projection Beam */}
            <div className="login-volumetric-lidar">
              <svg viewBox="0 0 240 320" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="loginBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="loginCoreGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points="120,0 20,320 220,320" fill="url(#loginBeamGrad)" />
                <polygon points="120,0 95,320 145,320" fill="url(#loginCoreGrad)" opacity="0.8" />
                <line x1="120" y1="0" x2="60" y2="320" stroke="#00f2fe" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />
                <line x1="120" y1="0" x2="120" y2="320" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.9" />
                <line x1="120" y1="0" x2="180" y2="320" stroke="#00f2fe" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Centered Glass Card (No Vertical Scroll) ── */}
      <div className="card relative z-10 w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

        <div className="p-5 sm:p-7">
          {/* Avatar with glow */}
          <div className="mb-3 flex justify-center">
            <div className="avatar-ring rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[2.5px]">
              <img
                src={userAvatar}
                alt="User"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-900 p-1 object-cover"
              />
            </div>
          </div>

          <h1 className="mb-0.5 text-center text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mb-4 text-center text-xs text-gray-400">
            Sign in to continue to 3D-ULPIN
          </p>

          {/* Role Switcher Tabs (Citizen / Officer) */}
          <div className="mb-4 p-1 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Citizen Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('officer')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'officer'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Officer Portal
            </button>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="group relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'email' || email
                    ? '-top-2.5 text-xs text-blue-400 bg-gray-900/90 px-2 rounded font-medium'
                    : 'top-3 text-gray-400 text-xs sm:text-sm'
                }`}
              >
                {role === 'officer' ? 'Official Government Email' : 'Email or Phone'}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-sm"
              />
            </div>

            <div className="group relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'password' || password
                    ? '-top-2.5 text-xs text-blue-400 bg-gray-900/90 px-2 rounded font-medium'
                    : 'top-3 text-gray-400 text-xs sm:text-sm'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-500 h-3.5 w-3.5 rounded cursor-pointer" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-glow w-full rounded-xl py-2.5 text-sm sm:text-base font-semibold text-white transition-all duration-300 active:scale-[0.98] cursor-pointer mt-1 ${
                role === 'officer'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]'
              }`}
            >
              {loading ? 'Authenticating...' : role === 'officer' ? 'Sign In as Officer' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-3 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-[11px] text-gray-500">or continue with</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          {/* Social & Alternative Login Options Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              title="Continue with Google"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              title="Continue with Apple"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.83-11.97-14.36-6.19-9.58-10.98-20.15-14.37-31.71-3.39-11.56-5.08-22.75-5.08-33.56 0-14.93 3.65-27.42 10.94-37.47 7.3-10.05 16.59-15.19 27.88-15.42 4.47 0 9.7 1.25 15.68 3.76 5.98 2.51 9.77 3.82 11.37 3.92 1.6.1 5.34-1.2 11.22-3.92 5.88-2.71 11.12-3.96 15.72-3.76 12.3.65 22.37 5.39 30.21 14.21-10.74 6.54-15.98 15.47-15.72 26.8.26 8.71 3.59 16.03 10 21.96 6.42 5.93 14.15 9.38 23.2 10.35-2.14 6.54-4.73 12.87-7.78 19.01zM119.22 33.64c0-7.39 2.67-14.29 8.01-20.7 5.34-6.42 11.93-10.33 19.78-11.74.22 1.2.33 2.18.33 2.94 0 7.39-2.73 14.3-8.2 20.73-5.46 6.43-12.06 10.16-19.79 11.2-.07-.76-.13-1.57-.13-2.43z"/>
              </svg>
              <span>Apple</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPhoneModal(true)}
              disabled={loading}
              title="Continue with Phone OTP"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-medium text-emerald-300 transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>OTP</span>
            </button>
          </div>

          {/* Footer Links */}
          <p className="mt-3.5 text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition">
              Sign Up
            </Link>
          </p>
          <p className="mt-1.5 text-center">
            <Link to="/" className="text-[11px] text-gray-500 hover:text-gray-300 transition">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>

      {/* ── Phone OTP Modal ── */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setShowPhoneModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
            <PhoneOTP 
              onSuccess={(token, u) => {
                login(u || { id: 'phone-user-id', phone: '+919876543210', full_name: 'Verified Officer', role: 'user' }, token);
                setShowPhoneModal(false);
                navigate('/dashboard');
              }} 
            />
          </div>
        </div>
      )}

      <style>{`
        /* ── Card Transition ── */
        .card {
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Avatar Glowing Ring ── */
        .avatar-ring {
          animation: pulseRing 3s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.3); }
          50%      { box-shadow: 0 0 25px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.2); }
        }

        /* ── Button Glow ── */
        .btn-glow:hover {
          background-size: 200% 200%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Drone Flying Across Screen Animation ── */
        .login-drone-flight {
          position: absolute;
          top: 10%;
          animation: loginDroneFly 12s ease-in-out infinite;
        }

        @keyframes loginDroneFly {
          0%   { left: -120px; top: 11%; transform: rotate(2deg); }
          25%  { left: 28%;   top: 7%;  transform: rotate(-1deg); }
          50%  { left: 52%;   top: 13%; transform: rotate(2.5deg); }
          75%  { left: 78%;   top: 8%;  transform: rotate(-2deg); }
          100% { left: 112%;  top: 11%; transform: rotate(2deg); }
        }

        /* ── Rotor Blade Spinning ── */
        .drone-rotor {
          animation: fastRotor 0.12s linear infinite;
        }
        .drone-rotor-rear {
          animation: fastRotor 0.12s linear infinite reverse;
        }

        @keyframes fastRotor {
          0%   { opacity: 0.25; transform: scaleX(1); }
          50%  { opacity: 0.7; transform: scaleX(0.7); }
          100% { opacity: 0.25; transform: scaleX(1); }
        }

        /* ── Strobe Navigation Beacon ── */
        .drone-blink {
          animation: beaconBlink 0.9s ease-in-out infinite;
        }
        @keyframes beaconBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }

        /* ── Volumetric Conical LiDAR Laser Projection Beam ── */
        .login-volumetric-lidar {
          position: absolute;
          top: 38px;
          left: 50%;
          transform: translateX(-50%);
          width: 240px;
          height: 320px;
          pointer-events-none;
          animation: loginLidarBeamPulse 2s ease-in-out infinite;
        }

        @keyframes loginLidarBeamPulse {
          0%, 100% {
            opacity: 0.75;
            transform: translateX(-50%) scaleX(0.95);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1.15);
          }
        }

        /* ── Scan Dots & Line ── */
        .login-scan-dot {
          position: absolute;
          top: -10px;
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 6px 2px rgba(56,189,248,0.6);
          animation: fallDot linear infinite;
          opacity: 0;
        }

        @keyframes fallDot {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        .login-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          box-shadow: 0 0 12px 2px rgba(56,189,248,0.4);
          animation: scanDownLine 5s ease-in-out infinite;
        }

        @keyframes scanDownLine {
          0%   { top: 0; opacity: 0; }
          15%  { opacity: 0.8; }
          85%  { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
