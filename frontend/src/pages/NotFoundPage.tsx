import { Link } from 'react-router-dom';

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
