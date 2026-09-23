import { ShieldAlert, Search, Activity, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      navigate(`/scanner?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24 px-6 pb-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-primary mb-8 text-sm font-medium">
          <Activity className="w-4 h-4" />
          <span>Advanced AI Threat Detection</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          AI-Powered <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Website Risk Detection</span>
        </h1>
        
        <p className="text-lg md:text-xl text-textMuted mb-12 max-w-2xl mx-auto leading-relaxed">
          Analyze suspicious websites, detect security indicators, and understand online risks before interacting with them. Safe, passive, and comprehensive.
        </p>

        <form onSubmit={handleScan} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-textMuted group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)..."
            required
            className="block w-full pl-16 pr-40 py-5 bg-card/50 border-2 border-white/10 rounded-2xl text-lg text-white placeholder-textMuted focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-all shadow-lg backdrop-blur-sm"
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              className="h-full px-8 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Scan Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-textMuted text-sm">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <p>Analysis is performed using safe security indicators. Never enter passwords into suspicious websites.</p>
        </div>
      </div>
    </div>
  );
}
