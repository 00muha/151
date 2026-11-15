import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import DiscoverPage from './components/DiscoverPage';

function Custom404() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f5f6f8] flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="w-full max-w-md bg-[#131519] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <span className="inline-block bg-[#1e2418] text-[#d2ff38] text-[11px] font-extrabold tracking-widest px-3.5 py-1.5 rounded-full border border-[#d2ff38]/30 mb-5">
          ERROR 404 • MODULE NOT MERGED
        </span>

        <h1 className="text-5xl font-black tracking-tight text-white mb-2">
          404<span className="text-[#d2ff38]">.</span>
        </h1>
        <h2 className="text-xl font-bold text-white mb-3">
          Wrong turn in the dark.
        </h2>

        <p className="text-sm text-[#8b909a] leading-relaxed mb-6">
          The route <span className="text-[#d2ff38] font-mono bg-white/5 px-2 py-0.5 rounded">{location.pathname}</span> belongs to another teammate's branch and hasn't been merged into this build yet.
        </p>

        <div className="bg-[#0e1013] border border-white/5 rounded-2xl p-4 text-left text-xs text-[#8b909a] space-y-1.5 mb-7">
          <div className="text-white font-semibold mb-1">Active Route Status:</div>
          <div className="flex justify-between">
            <span>/ (Discover Swipe & Feed)</span>
            <span className="text-[#d2ff38] font-semibold">LIVE</span>
          </div>
          <div className="flex justify-between">
            <span>{location.pathname}</span>
            <span className="text-red-400 font-semibold">404 MISSING FILE</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#d2ff38] text-[#0b0c0e] font-extrabold text-sm py-3.5 px-6 rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_8px_25px_rgba(210,255,56,0.25)]"
        >
          ← Back to Discover
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Your Main Discover Page */}
        <Route path="/" element={<DiscoverPage />} />

        {/* All other teammate routes & unknown paths hit the Custom 404 page */}
        <Route path="/explore" element={<Custom404 />} />
        <Route path="/host" element={<Custom404 />} />
        <Route path="/events/:id" element={<Custom404 />} />
        <Route path="/my-tickets" element={<Custom404 />} />
        <Route path="/gate-scanner" element={<Custom404 />} />
        <Route path="*" element={<Custom404 />} />
      </Routes>
    </Router>
  );
}