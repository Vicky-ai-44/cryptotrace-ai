import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Plus, 
  Download, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  Clock, 
  ExternalLink,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { EvidenceRecord } from '../types';

export const EvidencePage: React.FC = () => {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      const data = await api.getEvidence();
      setRecords(data.evidenceRecords || []);
      if (data.evidenceRecords && data.evidenceRecords.length > 0) {
        setSelectedRecord(data.evidenceRecords[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(txt);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateNew = async () => {
    try {
      const res = await api.createEvidence({
        caseId: 'case-001',
        transactionHash: '0x7791820491820491820491820491820491820491820491820491820491820491',
        blockNumber: 38291048,
        blockTimestamp: new Date().toISOString(),
        walletAddress: '0xBINANCE_DEPOSIT_CLUSTER_DEMO_09182397120',
        blockchain: 'BNB Chain',
        source: 'CryptoTrace Automated Forensics Snapshot Service',
        notes: 'Forensic digital chain-of-custody sealed snapshot captured by investigator.'
      });
      if (res.success) {
        loadEvidence();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportEvidenceJson = (record: EvidenceRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${record.evidenceRecordId}_sealed_forensic_evidence.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <span>Digital Evidence Preservation & Chain of Custody</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographic SHA-256 sealed transaction snapshots for court-admissible forensic packages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Evidence Record</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Records List */}
        <div className="lg:col-span-7 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Sealed Evidence Repository ({records.length})
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
              FIPS-140 COMPLIANT
            </span>
          </div>

          <div className="space-y-3">
            {records.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs space-y-2 ${
                    isSelected 
                      ? 'bg-cyber-950 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-cyber-950/60 border-cyber-800 hover:border-cyber-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">{rec.evidenceRecordId}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rec.retrievedAt}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 truncate">
                    Wallet: {rec.walletAddress}
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-cyber-850 text-[10px] text-slate-400">
                    <span>Block: #{rec.blockNumber} ({rec.blockchain})</span>
                    <span className="text-emerald-400 font-semibold truncate max-w-[150px]">
                      SHA256: {rec.dataHash.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Evidence Inspector */}
        <div className="lg:col-span-5 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Evidence Seal Certificate</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
              VERIFIED
            </span>
          </div>

          {selectedRecord ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Evidence Identifier</div>
                <div className="text-lg font-bold text-emerald-400">{selectedRecord.evidenceRecordId}</div>
                <div className="text-[10px] text-slate-400">Linked Case: {selectedRecord.caseId}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Cryptographic SHA-256 Seal</div>
                <div className="flex items-center justify-between bg-cyber-950 p-2 rounded border border-cyber-800 mt-1">
                  <span className="text-cyan-300 text-[11px] break-all">{selectedRecord.dataHash}</span>
                  <button onClick={() => handleCopy(selectedRecord.dataHash)} className="p-1 text-slate-400 hover:text-white shrink-0">
                    {copied === selectedRecord.dataHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-cyber-950 p-2.5 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400">Block Height</div>
                  <div className="text-white font-bold mt-0.5">#{selectedRecord.blockNumber}</div>
                </div>
                <div className="bg-cyber-950 p-2.5 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400">Blockchain</div>
                  <div className="text-white font-bold mt-0.5">{selectedRecord.blockchain}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Transaction Hash</div>
                <div className="bg-cyber-950 p-2 rounded border border-cyber-800 mt-1 text-[11px] text-slate-300 truncate">
                  {selectedRecord.transactionHash}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Target Address</div>
                <div className="bg-cyber-950 p-2 rounded border border-cyber-800 mt-1 text-[11px] text-cyan-300 truncate">
                  {selectedRecord.walletAddress}
                </div>
              </div>

              <div className="p-3 bg-cyber-950/60 rounded-xl border border-cyber-800 text-[11px] text-slate-300 space-y-1 font-sans">
                <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Investigator Notes:</div>
                <p>{selectedRecord.notes}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => exportEvidenceJson(selectedRecord)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Cryptographic Evidence Package (.JSON)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              Select an evidence item to review seal integrity.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
