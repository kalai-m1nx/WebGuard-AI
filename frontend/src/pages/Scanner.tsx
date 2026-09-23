import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scanUrl } from '../services/api';
import { Activity, ShieldAlert } from 'lucide-react';

export default function Scanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialUrl = query.get('url') || '';
  
  const [url, setUrl] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');

  const steps = [
    "Initializing scan...",
    "Checking domain indicators...",
    "Analyzing page structure...",
    "Inspecting redirects...",
    "Analyzing scripts...",
    "Running AI risk model...",
    "Generating security report..."
  ];

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setError('');
    
    // Fake progress animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setProgressText(steps[step]);
        step++;
      }
    }, 800);

    try {
      const result = await scanUrl(url);
      clearInterval(interval);
      navigate(`/results/${result.id}`);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Failed to complete scan.");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (initialUrl && !isScanning && !error) {
      handleScan();
    }
  }, [initialUrl]);

  return (
    <div className="flex flex-col items-center justify-center pt-24 px-6 pb-20">
      <div className="max-w-3xl w-full glass-card p-10 rounded-2xl relative">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">URL Security Scanner</h2>
        
        <form onSubmit={handleScan} className="flex gap-4 mb-8">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="flex-grow px-6 py-4 bg-background border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 disabled:opacity-50"
            placeholder="Enter URL to scan..."
            required
          />
          <button 
            type="submit" 
            disabled={isScanning}
            className="px-8 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
              <Activity className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-primary font-medium animate-pulse">{progressText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
