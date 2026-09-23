import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboard().then(setStats);
  }, []);

  if (!stats) return <div className="pt-32 text-center text-primary animate-pulse">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto pt-10 px-6 pb-20">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Activity className="text-primary" /> Analytics Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
          <p className="text-textMuted font-medium mb-1">Total Scans</p>
          <p className="text-4xl font-bold text-white">{stats.total_scans}</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border-l-4 border-danger">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted font-medium mb-1">High Risk</p>
              <p className="text-4xl font-bold text-danger">{stats.high_risk}</p>
            </div>
            <ShieldAlert className="text-danger/50 w-8 h-8" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-warning">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted font-medium mb-1">Suspicious</p>
              <p className="text-4xl font-bold text-warning">{stats.suspicious}</p>
            </div>
            <AlertTriangle className="text-warning/50 w-8 h-8" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-success">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted font-medium mb-1">Low Risk</p>
              <p className="text-4xl font-bold text-success">{stats.low_risk}</p>
            </div>
            <ShieldCheck className="text-success/50 w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
