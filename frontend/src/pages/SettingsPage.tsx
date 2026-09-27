import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Key, 
  Database, 
  Check, 
  Save, 
  Sparkles,
  Server,
  BellRing
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [providerMode, setProviderMode] = useState('DEMO');
  const [ethRpc, setEthRpc] = useState('https://mainnet.infura.io/v3/[CONFIDENTIAL_ENV]');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>System & Forensic Engine Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Provider abstraction settings, RPC endpoints, and law enforcement telemetry
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Mode Card */}
        <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Blockchain Provider Mode</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
              ACTIVE: {providerMode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setProviderMode('DEMO')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                providerMode === 'DEMO'
                  ? 'bg-cyber-950 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-cyber-950/60 border-cyber-800 hover:border-cyber-700'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Deterministic Seeded Demo Mode</span>
                {providerMode === 'DEMO' && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Works seamlessly without public RPC keys. Pre-loaded with complete hackathon case CYBER-2026-001.
              </p>
            </div>

            <div 
              onClick={() => setProviderMode('RPC_LIVE')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                providerMode === 'RPC_LIVE'
                  ? 'bg-cyber-950 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-cyber-950/60 border-cyber-800 hover:border-cyber-700'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Public RPC Live Query Mode</span>
                {providerMode === 'RPC_LIVE' && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Queries external public nodes (Ethereum, Polygon, BNB) via secure backend environment variables.
              </p>
            </div>
          </div>
        </div>

        {/* RPC Endpoints (Masked) */}
        <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-cyber-800 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Multi-Chain RPC Node Endpoints</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Ethereum Mainnet RPC URL (Backend .env managed)</label>
              <input
                type="text"
                disabled
                value="ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/********"
                className="w-full bg-cyber-950 border border-cyber-800 rounded-lg p-2.5 text-slate-400 opacity-80"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">BNB Chain RPC URL (Backend .env managed)</label>
              <input
                type="text"
                disabled
                value="BNB_RPC_URL=https://bsc-dataseed.binance.org"
                className="w-full bg-cyber-950 border border-cyber-800 rounded-lg p-2.5 text-slate-400 opacity-80"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Polygon Mainnet RPC URL (Backend .env managed)</label>
              <input
                type="text"
                disabled
                value="POLYGON_RPC_URL=https://polygon-rpc.com"
                className="w-full bg-cyber-950 border border-cyber-800 rounded-lg p-2.5 text-slate-400 opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Configuration preferences saved successfully.</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
