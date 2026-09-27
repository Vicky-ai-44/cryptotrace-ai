import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  ShieldCheck, 
  Clock, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { AuditLogEntry } from '../types';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.officer.toLowerCase().includes(search.toLowerCase()) ||
    (l.caseId && l.caseId.toLowerCase().includes(search.toLowerCase())) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            <span>Investigative Audit & Chain-of-Custody Log</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Immutable forensic audit record tracking investigator queries, case modifications, and exported evidence
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/40">
          {logs.length} Total Audit Entries
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-4 shadow-md flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit trail by Officer, Case, Action, or Details..."
            className="w-full bg-cyber-950 border border-cyber-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-cyber-950 border-b border-cyber-750 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Case</th>
                <th className="py-3 px-4">Source Terminal</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-cyber-850/80 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-cyan-300">
                    {entry.officer}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {entry.caseId || 'GLOBAL'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {entry.source}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      {entry.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                    {entry.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
