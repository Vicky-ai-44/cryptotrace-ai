import React, { useState } from 'react';
import { Case, FraudType, BlockchainType } from '../types';
import { X, ShieldPlus, AlertCircle } from 'lucide-react';
import { DEMO_SUSPECT_WALLET } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: any) => void;
}

export const CaseModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [complaintId, setComplaintId] = useState('');
  const [victimReference, setVictimReference] = useState('');
  const [fraudType, setFraudType] = useState<FraudType>('Investment Fraud');
  const [walletAddress, setWalletAddress] = useState(DEMO_SUSPECT_WALLET);
  const [blockchain, setBlockchain] = useState<BlockchainType>('Ethereum');
  const [totalLossUsd, setTotalLossUsd] = useState('15000');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      complaintId,
      victimReference,
      fraudType,
      walletAddress,
      blockchain,
      totalLossUsd: Number(totalLossUsd) || 0,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-cyber-900 border border-cyber-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 bg-cyber-950 border-b border-cyber-700">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Register New Cybercrime Investigation</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Complaint ID (NCRP)</label>
              <input
                type="text"
                value={complaintId}
                onChange={e => setComplaintId(e.target.value)}
                placeholder="e.g. NCRP-2026-IN-98214"
                className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Victim Reference</label>
              <input
                type="text"
                value={victimReference}
                onChange={e => setVictimReference(e.target.value)}
                placeholder="e.g. DEMO-VICTIM-001"
                className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Fraud Typology</label>
              <select
                value={fraudType}
                onChange={e => setFraudType(e.target.value as FraudType)}
                className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Investment Fraud">Investment Fraud</option>
                <option value="Task Fraud">Task Fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Ransomware">Ransomware</option>
                <option value="Sextortion">Sextortion</option>
                <option value="Darknet">Darknet</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Blockchain</label>
              <select
                value={blockchain}
                onChange={e => setBlockchain(e.target.value as BlockchainType)}
                className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="BNB Chain">BNB Chain</option>
                <option value="Polygon">Polygon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Suspect Wallet Address</label>
            <input
              type="text"
              required
              value={walletAddress}
              onChange={e => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Estimated Victim Loss (USD)</label>
            <input
              type="number"
              value={totalLossUsd}
              onChange={e => setTotalLossUsd(e.target.value)}
              placeholder="15000"
              className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Initial Brief / Complaint Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Victim reported deceptive crypto platform soliciting deposits..."
              className="w-full bg-cyber-950 border border-cyber-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-cyber-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-cyber-850 hover:bg-cyber-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/30"
            >
              Register Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
