import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Archive, 
  ArrowRight, 
  ExternalLink,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Case, FraudType, BlockchainType, RiskLevel } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { CaseModal } from '../components/CaseModal';

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [chainFilter, setChainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, [search, riskFilter, chainFilter, statusFilter]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCases({
        search,
        risk: riskFilter,
        blockchain: chainFilter,
        status: statusFilter
      });
      setCases(data.cases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCase = async (newCaseData: any) => {
    try {
      const res = await api.createCase(newCaseData);
      if (res.success) {
        loadCases();
        // Log action
        api.createAuditLog({
          action: 'Case Created',
          caseId: res.case.caseNumber,
          details: `Registered new case for complaint ${res.case.complaintId}`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCasesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cryptotrace_cases_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCasesCsv = () => {
    const headers = ['CaseNumber', 'ComplaintID', 'VictimRef', 'FraudType', 'Wallet', 'Blockchain', 'RiskLevel', 'LossUSD', 'Status'];
    const rows = cases.map(c => [
      c.caseNumber,
      c.complaintId,
      c.victimReference,
      c.fraudType,
      c.walletAddress,
      c.blockchain,
      c.riskLevel,
      c.totalLossUsd,
      c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cryptotrace_cases_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
            <span>Cybercrime Case Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active FIRs, NCRP intake complaints, and blockchain tracking records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCasesCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportCasesJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Export JSON"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Case ID, Complaint ID, Victim Ref, or Suspect Wallet..."
            className="w-full bg-cyber-950 border border-cyber-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] text-slate-400 font-mono">Risk:</span>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Chain Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] text-slate-400 font-mono">Chain:</span>
          <select
            value={chainFilter}
            onChange={e => setChainFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Chains</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Bitcoin">Bitcoin</option>
            <option value="BNB Chain">BNB Chain</option>
            <option value="Polygon">Polygon</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] text-slate-400 font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cyber-950 border-b border-cyber-750 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Case / Complaint ID</th>
                <th className="py-3 px-4">Victim Reference</th>
                <th className="py-3 px-4">Fraud Typology</th>
                <th className="py-3 px-4">Suspect Wallet</th>
                <th className="py-3 px-4">Blockchain</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Reported Loss</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800 font-mono">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    No matching cybercrime investigation cases found.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-cyber-850/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-cyan-300">{c.caseNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.complaintId}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-200">
                      {c.victimReference}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-cyber-800 text-slate-200 text-[11px]">
                        {c.fraudType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {c.walletAddress.slice(0, 8)}...{c.walletAddress.slice(-4)}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {c.blockchain}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={c.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      ${c.totalLossUsd.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-800 text-slate-300">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/cases/${c.id}`)}
                        className="px-2.5 py-1 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-200 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => navigate(`/analyze?wallet=${encodeURIComponent(c.walletAddress)}&chain=${c.blockchain}&autoload=true`)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-cyber-950 border-t border-cyber-800 text-xs text-slate-400 font-mono flex items-center justify-between">
          <span>Showing {cases.length} investigation records</span>
          <span className="text-[11px]">Authorized Case Repository (Demo Database)</span>
        </div>
      </div>

      {/* Case Creation Modal */}
      <CaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};
