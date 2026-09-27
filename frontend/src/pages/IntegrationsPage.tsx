import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  Database, 
  RefreshCw,
  Info,
  Layers,
  Key
} from 'lucide-react';
import { api } from '../services/api';
import { ConnectorIntegration } from '../types';

export const IntegrationsPage: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorIntegration[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const data = await api.getIntegrations();
      setConnectors(data.connectors || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      loadConnectors();
    }, 1200);
  };

  const getStatusBadge = (status: ConnectorIntegration['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'ACTIVE / DEMO':
        return 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300';
      case 'DEMO CONNECTOR':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'STANDBY':
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Government & External Intelligence Connectors</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Pluggable adapter architecture for NCRP, SAHYOG, VASP registers, and RPC nodes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isSyncing ? 'Testing Telemetry...' : 'Poll Connectors'}</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Banner (Section 4 & 33) */}
      <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200 font-mono">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-amber-300">
            DEMO / SIMULATION INTEGRATION NOTICE:
          </div>
          <p className="leading-relaxed text-amber-200/90 font-sans">
            To ensure zero dependency on restricted production government infrastructure, NCRP and SAHYOG interfaces operate via mock integration adapters (<code>NCRPAdapter</code>, <code>SAHYOGAdapter</code>). The modular architecture allows plug-and-play activation of real authorized mutual-TLS credentials in production deployments.
          </p>
        </div>
      </div>

      {/* Connectors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((conn) => (
          <div 
            key={conn.id} 
            className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-cyber-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-cyber-800 text-cyan-300 font-mono font-bold">
                      {conn.shortCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{conn.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{conn.name}</h3>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-mono font-bold shrink-0 ${getStatusBadge(conn.status)}`}>
                  {conn.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {conn.description}
              </p>

              <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">API Specification</span>
                  <span className="text-slate-200 font-semibold">{conn.apiVersion}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Records Indexed</span>
                  <span className="text-emerald-400 font-bold">{conn.recordsRetrieved.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Authentication</span>
                  <span className="text-slate-300 text-[11px] truncate block">{conn.authType}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Last Synchronized</span>
                  <span className="text-slate-300 text-[11px]">{conn.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-cyber-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Adapter Class:</span>
              <code className="text-cyan-300 bg-cyber-950 px-2 py-0.5 rounded border border-cyber-800">
                {conn.shortCode}Adapter
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
