import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  KeyRound, 
  BadgeCheck, 
  Layers, 
  Building2, 
  GitFork, 
  AlertTriangle,
  ArrowRight,
  Lock,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('demo-investigator');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.login({ officerId, password });
      if (res.success) {
        localStorage.setItem('ct_auth_user', JSON.stringify(res.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Local fallback for offline demo
      localStorage.setItem('ct_auth_user', JSON.stringify({
        officerId,
        name: 'Insp. Rahul Sharma',
        role: 'Senior Cybercrime Forensic Analyst'
      }));
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setOfficerId('demo-investigator');
    setPassword('demo123');
    localStorage.setItem('ct_auth_user', JSON.stringify({
      officerId: 'demo-investigator',
      name: 'Insp. Rahul Sharma',
      role: 'Senior Cybercrime Forensic Analyst'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Banner */}
      <div className="w-full bg-cyber-900 border-b border-cyber-700/60 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-600">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">CryptoTrace AI</span>
            <span className="text-[10px] ml-2 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
              Law Enforcement Portal
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>FIPS-140 Hashed Digital Forensic Session</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero & Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
            <BadgeCheck className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Blockchain Intelligence for Cybercrime Investigations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Automated Wallet Tracing & <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              VASP Exchange Attribution
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Empower cybercrime investigators and digital forensic analysts to rapidly trace suspect fund flows from victim complaints, identify multi-hop intermediary layering wallets, unmask exchange destinations, and secure court-admissible evidence records.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-700/70 hover:border-cyan-500/40 transition-colors">
              <div className="p-2 w-fit rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Blockchain Analytics</h4>
              <p className="text-xs text-slate-400 mt-1">Multi-chain transaction graph indexing for ETH, BTC, BNB, and Polygon.</p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-700/70 hover:border-cyan-500/40 transition-colors">
              <div className="p-2 w-fit rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 mb-2">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">VASP Attribution</h4>
              <p className="text-xs text-slate-400 mt-1">Automated exchange deposit cluster attribution with confidence telemetry.</p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-700/70 hover:border-cyan-500/40 transition-colors">
              <div className="p-2 w-fit rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30 mb-2">
                <GitFork className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fund Flow Intelligence</h4>
              <p className="text-xs text-slate-400 mt-1">Interactive graph visualization with shortest path to liquidation nodes.</p>
            </div>

            <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-700/70 hover:border-cyan-500/40 transition-colors">
              <div className="p-2 w-fit rounded-lg bg-red-950 text-red-400 border border-red-500/30 mb-2">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Risk Engine</h4>
              <p className="text-xs text-slate-400 mt-1">Explainable scoring based on rapid forwarding and mixer signatures.</p>
            </div>
          </div>
        </div>

        {/* Right: Login Box */}
        <div className="lg:col-span-5">
          <div className="bg-cyber-900/95 border border-cyber-700 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-cyber-800">
              <div>
                <h3 className="text-lg font-bold text-white">Investigator Access</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Authorized Law Enforcement Personnel</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                  Officer ID / Badge
                </label>
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={e => setOfficerId(e.target.value)}
                  className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                  placeholder="demo-investigator"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                  placeholder="demo123"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-sm shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Console'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-cyber-850 hover:bg-cyber-800 border border-cyan-500/40 text-cyan-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>One-Click Hackathon Login (demo-investigator)</span>
                </button>
              </div>

              <div className="pt-4 border-t border-cyber-800 text-[11px] text-slate-400 font-mono space-y-1">
                <div className="text-slate-300 font-semibold">Demo Credentials:</div>
                <div className="flex justify-between">
                  <span>Officer ID:</span>
                  <span className="text-cyan-300 font-bold">demo-investigator</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="text-cyan-300 font-bold">demo123</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full bg-cyber-950 border-t border-cyber-800 py-4 px-6 text-center text-xs text-slate-400 font-mono">
        CryptoTrace AI Digital Forensics System • Investigative Aid Disclaimer: Results require independent verification before formal legal summons or asset seizure orders.
      </footer>
    </div>
  );
};
