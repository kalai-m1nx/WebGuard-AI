import { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(data => {
      setHistory(data.reverse());
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto pt-10 px-6 pb-20">
      <h2 className="text-3xl font-bold text-white mb-8">Scan History</h2>
      
      {loading ? (
        <div className="text-center text-primary animate-pulse">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-textMuted py-20 glass-card rounded-xl">No scans yet.</div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-textMuted font-medium">Date</th>
                <th className="p-4 text-textMuted font-medium">Website</th>
                <th className="p-4 text-textMuted font-medium">Risk Level</th>
                <th className="p-4 text-textMuted font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((scan) => (
                <tr key={scan.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-textMuted">
                    {new Date(scan.scanned_at).toLocaleDateString()} {new Date(scan.scanned_at).toLocaleTimeString()}
                  </td>
                  <td className="p-4 font-medium text-white truncate max-w-xs">{scan.domain}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      scan.risk_level === 'LOW RISK' ? 'bg-success/10 text-success' :
                      scan.risk_level === 'MODERATE' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {scan.risk_level === 'LOW RISK' && <ShieldCheck className="w-3 h-3" />}
                      {scan.risk_level === 'MODERATE' && <AlertTriangle className="w-3 h-3" />}
                      {scan.risk_level === 'HIGH RISK' && <ShieldAlert className="w-3 h-3" />}
                      {scan.risk_level}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/results/${scan.id}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
