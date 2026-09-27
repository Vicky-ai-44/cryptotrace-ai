import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  FolderKanban, 
  Crosshair, 
  Layers, 
  GitFork, 
  Building2, 
  AlertTriangle, 
  FileCheck, 
  FileText, 
  Cpu, 
  FileSpreadsheet, 
  Settings, 
  Zap,
  Info
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Investigations', icon: FolderKanban },
    { to: '/analyze', label: 'Wallet Analysis', icon: Crosshair, highlight: true },
    { to: '/transactions', label: 'Transaction Explorer', icon: Layers },
    { to: '/graph', label: 'Fund Flow', icon: GitFork },
    { to: '/vasp', label: 'VASP Intelligence', icon: Building2 },
    { to: '/alerts', label: 'Risk & Alerts', icon: AlertTriangle },
    { to: '/evidence', label: 'Evidence', icon: FileCheck },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/integrations', label: 'Integrations', icon: Cpu },
    { to: '/audit-log', label: 'Audit Logs', icon: FileSpreadsheet },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-cyber-950 border-r border-cyber-700/60 flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-cyber-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                CryptoTrace <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Cybercrime Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Hackathon Quick Demo Case Loader Button */}
        <div className="p-3">
          <button 
            onClick={() => {
              navigate('/analyze?wallet=0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F&chain=Ethereum&autoload=true');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/50 rounded-lg text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform fill-cyan-400/20" />
            <span>Load Demo Investigation</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-semibold shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-850/80'
                  }
                  ${item.highlight ? 'text-cyan-400' : ''}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                    CORE
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Status Footer */}
      <div className="p-3 border-t border-cyber-700/60 bg-cyber-900/50">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cyber-950/60 border border-cyber-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-slate-300 truncate">demo-investigator</div>
            <div className="text-[10px] text-slate-400 font-mono">Role: Cyber Analyst</div>
          </div>
        </div>
        <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Simulation Dataset Active</span>
        </div>
      </div>
    </aside>
  );
};
