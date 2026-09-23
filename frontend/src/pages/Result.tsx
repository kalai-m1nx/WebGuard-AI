import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScan } from '../services/api';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';

export default function Result() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await getScan(id);
          setData(res);
        }
      } catch (err: any) {
        setError("Failed to load scan results.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="pt-32 text-center text-primary animate-pulse text-2xl">Loading report...</div>;
  }

  if (error || !data) {
    return <div className="pt-32 text-center text-danger">{error || "Scan not found."}</div>;
  }

  const getRiskColor = (level: string) => {
    if (level === 'LOW RISK') return 'text-success';
    if (level === 'MODERATE') return 'text-warning';
    return 'text-danger';
  };

  const radarData = Object.keys(data.risk_breakdown || {}).map(key => ({
    subject: key,
    A: data.risk_breakdown[key],
    fullMark: 100,
  }));

  return (
    <div className="max-w-6xl mx-auto pt-10 px-6 pb-20">
      <Link to="/scanner" className="inline-flex items-center gap-2 text-textMuted hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> New Scan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Score Card */}
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center lg:col-span-1">
          <h3 className="text-textMuted font-medium mb-4 uppercase tracking-wider">Overall Risk Score</h3>
          <div className={`text-8xl font-black mb-4 ${getRiskColor(data.risk_level)}`}>
            {data.risk_score}
          </div>
          <div className={`px-4 py-1 rounded-full border mb-6 text-lg font-bold tracking-wide ${
            data.risk_level === 'LOW RISK' ? 'bg-success/10 border-success/30 text-success' :
            data.risk_level === 'MODERATE' ? 'bg-warning/10 border-warning/30 text-warning' :
            'bg-danger/10 border-danger/30 text-danger'
          }`}>
            {data.risk_level}
          </div>
          <p className="text-textMuted text-sm">Target: <span className="text-white break-all">{data.url}</span></p>
          <p className="text-textMuted text-sm mt-1">Domain: <span className="text-white">{data.domain}</span></p>
        </div>

        {/* AI Summary */}
        <div className="glass-card p-8 rounded-2xl lg:col-span-2 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-primary w-6 h-6" /> AI Security Summary
          </h3>
          <p className="text-lg text-textMain leading-relaxed mb-6">{data.summary}</p>
          
          <h4 className="font-semibold text-white mb-3">Recommendations:</h4>
          <ul className="space-y-2">
            {data.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-textMuted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Indicators Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="text-xl font-bold text-white col-span-full mb-2">Security Indicators</h3>
          {data.indicators?.map((ind: any, idx: number) => (
            <div key={idx} className="glass-card p-5 rounded-xl border-l-4" style={{
              borderLeftColor: ind.status === 'PASS' ? '#00E676' : ind.status === 'WARNING' ? '#FFB800' : '#FF3366'
            }}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white">{ind.name}</span>
                {ind.status === 'PASS' && <ShieldCheck className="w-5 h-5 text-success" />}
                {ind.status === 'WARNING' && <AlertTriangle className="w-5 h-5 text-warning" />}
                {ind.status === 'HIGH RISK' && <ShieldAlert className="w-5 h-5 text-danger" />}
              </div>
              <p className="text-sm text-textMuted">{ind.reason}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-1 min-h-[300px] flex flex-col">
           <h3 className="text-lg font-bold text-white mb-4 text-center">Risk Breakdown</h3>
           <div className="flex-grow w-full h-full min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#94A3B8', fontSize: 12}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Risk" dataKey="A" stroke="#00D1FF" fill="#00D1FF" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
}
