import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitFork, 
  Layers, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { FundFlowGraph } from '../types';
import { InteractiveFundFlow } from '../components/InteractiveFundFlow';

export const FundFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const [graph, setGraph] = useState<FundFlowGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      const res = await api.getWalletGraph('0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F');
      setGraph(res.graph);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <GitFork className="w-6 h-6 text-cyan-400" />
            <span>Fund Flow & Liquidation Path Visualizer</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Multi-hop directed graph mapping transit wallets, cross-chain bridges, and VASP liquidation points
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analyze?wallet=0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F&chain=Ethereum&autoload=true')}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Deep Dive in Wallet Analysis</span>
          </button>
        </div>
      </div>

      {/* Path Narrative Banner */}
      <div className="p-4 bg-cyber-900 border border-cyber-700/80 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase font-semibold">Active Path Attribution:</span>
          <span className="text-emerald-400 font-bold">Nearest Destination: Binance VASP Cluster (3 Hops)</span>
        </div>
        <div className="p-3 bg-cyber-950 rounded-lg border border-cyber-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/40 shrink-0">
            Victim Wallet
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold shrink-0">
            Suspect Collector (0xDEMO71...)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40 shrink-0">
            Layering Relay A
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40 shrink-0">
            Layering Relay B
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/40 shrink-0">
            Stargate Bridge
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
            Binance Deposit Cluster (0xBINANCE...)
          </span>
        </div>
      </div>

      {/* Interactive Visualizer Canvas */}
      {isLoading || !graph ? (
        <div className="flex items-center justify-center h-96 bg-cyber-950 rounded-xl border border-cyber-800">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <InteractiveFundFlow 
          graph={graph}
          onSelectAddress={(addr) => navigate(`/analyze?wallet=${encodeURIComponent(addr)}&autoload=true`)}
        />
      )}

      {/* Forensic Intelligence Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-cyber-900 border border-cyber-700/80 rounded-xl space-y-1 font-mono text-xs">
          <div className="text-slate-400 text-[10px] uppercase">Shortest Path Length</div>
          <div className="text-xl font-bold text-cyan-300">3 Intermediary Hops</div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Funds transit two non-custodial relay wallets before entering cross-chain protocol.
          </p>
        </div>

        <div className="p-4 bg-cyber-900 border border-cyber-700/80 rounded-xl space-y-1 font-mono text-xs">
          <div className="text-slate-400 text-[10px] uppercase">Cross-Chain Conversion</div>
          <div className="text-xl font-bold text-purple-400">ETH → BNB Chain</div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Bridge transaction converts ERC-20 USDT into BEP-20 USDT liquidation tranches.
          </p>
        </div>

        <div className="p-4 bg-cyber-900 border border-cyber-700/80 rounded-xl space-y-1 font-mono text-xs">
          <div className="text-slate-400 text-[10px] uppercase">Identified Liquidation</div>
          <div className="text-xl font-bold text-emerald-400">$12,430 USDT Swept</div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Consolidated at centralized exchange hot wallet cluster with 92% attribution confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
