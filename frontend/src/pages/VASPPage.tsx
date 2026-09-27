import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Search,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { VASPEntity } from '../types';

export const VASPPage: React.FC = () => {
  const [vasps, setVasps] = useState<VASPEntity[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadVASPData();
  }, []);

  const loadVASPData = async () => {
    try {
      const data = await api.getWalletVASP('0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F');
      setVasps(data.attributions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(txt);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredVasps = vasps.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.depositAddress.toLowerCase().includes(search.toLowerCase()) ||
    v.attributionStatus.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: VASPEntity['attributionStatus']) => {
    switch (status) {
      case 'CONFIRMED ATTRIBUTION':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'LIKELY ATTRIBUTION':
        return 'bg-blue-950/80 border-blue-500/50 text-blue-300';
      case 'POSSIBLE ATTRIBUTION':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'UNKNOWN':
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>VASP & Centralized Exchange Attribution Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Clustering heuristics, sweeper signatures, and KYC legal liaison endpoints
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-cyber-700 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>Court-Admissible Attribution Heuristics</span>
        </div>
      </div>

      {/* Mandatory Demo Data Integrity Notice (Section 15 & 41) */}
      <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200 font-mono">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-amber-300">
            Attribution Integrity & Disclaimer Notice:
          </div>
          <p className="leading-relaxed text-amber-200/90 font-sans">
            Attribution results represent heuristic cluster matches and automated behavioral signatures. The system distinguishes between <strong>CONFIRMED</strong>, <strong>LIKELY</strong>, and <strong>POSSIBLE</strong> attributions. Demo dataset entries are labeled for forensic evaluation prototyping.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-4 shadow-md flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search VASP by name, deposit address, or attribution status..."
            className="w-full bg-cyber-950 border border-cyber-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* VASP Clusters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVasps.map((vasp) => (
          <div key={vasp.id} className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">{vasp.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{vasp.entityType}</div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-mono font-bold ${getStatusBadge(vasp.attributionStatus)}`}>
                  {vasp.attributionStatus}
                </span>
              </div>

              {/* Confidence and Hops */}
              <div className="grid grid-cols-2 gap-2 bg-cyber-950 p-2.5 rounded-xl border border-cyber-800 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Confidence</div>
                  <div className="text-lg font-bold text-emerald-400">{vasp.confidence}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Trail Distance</div>
                  <div className="text-lg font-bold text-cyan-400">{vasp.distanceHops} Hops</div>
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-1.5 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Identified Deposit Cluster Address:</div>
                  <div className="flex items-center justify-between bg-cyber-950 p-2 rounded border border-cyber-800 mt-0.5">
                    <span className="text-cyan-300 text-[11px] truncate">{vasp.depositAddress}</span>
                    <button onClick={() => handleCopy(vasp.depositAddress)} className="text-slate-400 hover:text-white p-0.5">
                      {copied === vasp.depositAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Network:</span>
                  <span className="text-white font-semibold">{vasp.blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Traced Inflow:</span>
                  <span className="text-emerald-400 font-bold">${vasp.totalReceivedUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Seen:</span>
                  <span className="text-slate-300">{vasp.lastInteraction}</span>
                </div>
              </div>

              {/* Evidence points */}
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1">
                  Attribution Evidence Points:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                  {vasp.evidencePoints.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Jurisdiction & Legal Liaison Footer */}
            <div className="pt-3 border-t border-cyber-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Jurisdiction:</span>
              <span className="text-cyan-300">{vasp.jurisdiction || 'Global'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
