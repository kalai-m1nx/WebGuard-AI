import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">CyberShield <span className="text-primary">AI</span></span>
      </Link>
      
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/" className="text-textMuted hover:text-white transition-colors">Home</Link>
        <Link to="/scanner" className="text-textMuted hover:text-white transition-colors">Scanner</Link>
        <Link to="/dashboard" className="text-textMuted hover:text-white transition-colors">Dashboard</Link>
        <Link to="/history" className="text-textMuted hover:text-white transition-colors">History</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-textMuted hover:text-white transition-colors font-medium">Login</Link>
        <Link to="/register" className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(0,209,255,0.15)] hover:shadow-[0_0_20px_rgba(0,209,255,0.3)]">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
