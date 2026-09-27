import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Filter,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { RealtimeAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await api.getWalletAlerts('0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F');
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts.filter(a => 
    severityFilter === 'ALL' || a.severity === severityFilter
  );

  const getSeverityStyle = (sev: RealtimeAlert['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/40 border-red-500/50',
          badge: 'bg-red-950 text-red-300 border-red-500/40',
          dot: 'bg-red-500'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/40 border-orange-500/50',
          badge: 'bg-orange-950 text-orange-300 border-orange-500/40',
          dot: 'bg-orange-500'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50',
          badge: 'bg-amber-950 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-blue-950/40 border-blue-500/50',
          badge: 'bg-blue-950 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <span>Real-Time Forensics Alerts & Risk Feed</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automated alerts triggered by layering speed, cross-chain bridging, and VASP sweeps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Severity:</span>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-cyber-900 border border-cyber-700 text-xs text-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500 bg-cyber-900 rounded-2xl border border-cyber-800">
            No alerts found matching current filter.
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const style = getSeverityStyle(alt.severity);
            return (
              <div 
                key={alt.id}
                className={`p-5 rounded-2xl border ${style.bg} shadow-lg space-y-3 transition-all hover:translate-x-1 duration-150`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`}></span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${style.badge}`}>
                      {alt.severity} RISK
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {alt.timestamp}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-cyan-300 truncate max-w-xs">
                    Target: {alt.wallet.slice(0, 10)}...{alt.wallet.slice(-6)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-sans leading-snug">
                    {alt.reason}
                  </h4>
                  <div className="text-xs font-mono text-slate-400">
                    Associated Hash: <span className="text-slate-300">{alt.transactionHash}</span>
                  </div>
                </div>

                {/* Recommended Investigator Action */}
                <div className="p-3 bg-cyber-950/70 border border-cyber-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 text-slate-300 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-mono uppercase text-[10px] block">
                        Recommended Action:
                      </strong>
                      <span>{alt.action}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/analyze?wallet=${encodeURIComponent(alt.wallet)}&autoload=true`)}
                    className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-xs shrink-0 transition-colors cursor-pointer"
                  >
                    Trace Wallet →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
