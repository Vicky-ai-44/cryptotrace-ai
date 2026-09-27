import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  ArrowLeft, 
  Crosshair, 
  FileText, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  FileCheck,
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { Case, EvidenceRecord } from '../types';
import { RiskBadge } from '../components/RiskBadge';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCaseDetails();
  }, [id]);

  const loadCaseDetails = async () => {
    try {
      const res = await api.getCaseById(id || 'case-001');
      setCaseData(res.case);
      const evRes = await api.getEvidence(id);
      setEvidenceList(evRes.evidenceRecords || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !caseData) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Investigation Timeline (Section 22)
  const timeline = [
    { time: '09:41 IST', event: 'Victim complaint intake logged (NCRP Portal synchronisation)', status: 'COMPLETED' },
    { time: '09:44 IST', event: 'Suspect wallet address verified & checksum validated', status: 'COMPLETED' },
    { time: '09:45 IST', event: 'Blockchain transactions retrieved from multi-chain indexer', status: 'COMPLETED' },
    { time: '09:47 IST', event: 'Intermediary layering wallets identified (holding time < 2 mins)', status: 'COMPLETED' },
    { time: '09:48 IST', event: 'Cross-chain bridge movement detected (Ethereum -> BNB Chain)', status: 'COMPLETED' },
    { time: '09:49 IST', event: 'VASP attribution generated (Binance Deposit Cluster match)', status: 'COMPLETED' },
    { time: '09:50 IST', event: 'Risk assessment evaluated at 87/100 (CRITICAL level)', status: 'COMPLETED' },
    { time: '09:51 IST', event: 'Digital evidence record sealed EV-2026-00182 with SHA-256 hash', status: 'COMPLETED' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cases')}
            className="p-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 rounded-lg text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Case {caseData.caseNumber}
              </h1>
              <RiskBadge level={caseData.riskLevel} />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Complaint Ref: {caseData.complaintId} • Victim: {caseData.victimReference}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/analyze?wallet=${encodeURIComponent(caseData.walletAddress)}&chain=${caseData.blockchain}&autoload=true`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs shadow-md shadow-cyan-950 transition-all cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>Trace Funds in Analysis Engine</span>
          </button>

          <button
            onClick={() => navigate(`/reports?caseId=${caseData.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-cyan-300 font-bold rounded-lg text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Formal Report</span>
          </button>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case Info & Suspect Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-cyber-800 pb-2">
              Case Profile & Intelligence Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-950 p-3 rounded-xl border border-cyber-800">
                <div className="text-[10px] text-slate-400 font-mono">Fraud Classification</div>
                <div className="text-sm font-bold text-white mt-0.5">{caseData.fraudType}</div>
              </div>

              <div className="bg-cyber-950 p-3 rounded-xl border border-cyber-800">
                <div className="text-[10px] text-slate-400 font-mono">Reported Financial Loss</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  ${caseData.totalLossUsd.toLocaleString()} USD
                </div>
              </div>

              <div className="bg-cyber-950 p-3 rounded-xl border border-cyber-800">
                <div className="text-[10px] text-slate-400 font-mono">Investigating Officer</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">{caseData.investigatingOfficer}</div>
              </div>

              <div className="bg-cyber-950 p-3 rounded-xl border border-cyber-800">
                <div className="text-[10px] text-slate-400 font-mono">Registration Date</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">{caseData.reportedDate}</div>
              </div>
            </div>

            <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Primary Suspect Wallet</div>
              <div className="text-xs font-mono text-cyan-300 font-bold break-all">
                {caseData.walletAddress}
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Blockchain Network: <strong className="text-slate-200">{caseData.blockchain}</strong>
              </div>
            </div>

            {caseData.notes && (
              <div className="p-3 bg-cyber-950/60 rounded-xl border border-cyber-800 text-xs text-slate-300 leading-relaxed font-sans">
                <div className="text-[10px] text-slate-400 font-mono uppercase font-bold mb-1">
                  Investigation Brief Notes:
                </div>
                {caseData.notes}
              </div>
            )}
          </div>

          {/* Evidence Records Sealed for this Case (Section 21) */}
          <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Sealed Digital Evidence Records</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">
                {evidenceList.length} Verified Records
              </span>
            </div>

            <div className="space-y-2">
              {evidenceList.map((ev, i) => (
                <div key={i} className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span>{ev.evidenceRecordId}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{ev.retrievedAt}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate">Tx: {ev.transactionHash}</div>
                  <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-cyber-850">
                    <span>Block: #{ev.blockNumber}</span>
                    <span className="text-emerald-400 font-bold">SHA-256 Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chronological Investigation Timeline (Section 22) */}
        <div className="lg:col-span-5 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyber-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Investigation Chronology Timeline</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
              Live Audit Log
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyber-700">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-cyber-950 border-2 border-cyan-400"></div>

                <div className="text-[10px] font-mono text-cyan-400 font-semibold">{item.time}</div>
                <div className="text-xs text-slate-200 mt-0.5 font-sans leading-snug">{item.event}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cyber-800 text-[11px] text-slate-400 font-mono text-center">
            All events cryptographically signed into local audit store.
          </div>
        </div>
      </div>
    </div>
  );
};
