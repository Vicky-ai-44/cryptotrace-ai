import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Crosshair, 
  Play, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  Layers, 
  ShieldAlert, 
  FileCheck, 
  FileText, 
  ChevronRight, 
  Shuffle, 
  Network,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { BlockchainType, FundFlowGraph, RiskEvaluation, VASPEntity, WalletIntelligence, IntermediaryAnalysis, CrossChainMovement } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { InteractiveFundFlow } from '../components/InteractiveFundFlow';
import { AnalysisProgressModal } from '../components/AnalysisProgressModal';

const DEMO_WALLET = '0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F';

export const WalletAnalysisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState(searchParams.get('wallet') || DEMO_WALLET);
  const [blockchain, setBlockchain] = useState<BlockchainType>((searchParams.get('chain') as BlockchainType) || 'Ethereum');
  const [hops, setHops] = useState<number>(3);
  const [timeRange, setTimeRange] = useState<string>('All Available');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Analysis result state
  const [intel, setIntel] = useState<WalletIntelligence | null>(null);
  const [risk, setRisk] = useState<RiskEvaluation | null>(null);
  const [vasp, setVasp] = useState<VASPEntity | null>(null);
  const [graph, setGraph] = useState<FundFlowGraph | null>(null);
  const [intermediaries, setIntermediaries] = useState<IntermediaryAnalysis[]>([]);
  const [crossChain, setCrossChain] = useState<CrossChainMovement[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [evidenceCreatedId, setEvidenceCreatedId] = useState<string | null>(null);

  // Auto-run if triggered via query param autoload=true
  useEffect(() => {
    const qWallet = searchParams.get('wallet');
    const qAutoload = searchParams.get('autoload');
    if (qWallet) {
      setWalletAddress(qWallet);
    }
    if (qAutoload === 'true' && !analysisCompleted) {
      triggerAnalysis();
    }
  }, [searchParams]);

  const triggerAnalysis = () => {
    if (!walletAddress.trim()) return;
    setShowProgressModal(true);
  };

  const handlePipelineCompleted = async () => {
    setShowProgressModal(false);
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeWallet({
        walletAddress: walletAddress.trim(),
        blockchain,
        hops,
        timeRange
      });

      setIntel(res.walletIntelligence);
      setRisk(res.riskEvaluation);
      setVasp(res.nearestVasp);
      setGraph(res.graph);
      setIntermediaries(res.intermediaries || []);
      setCrossChain(res.crossChainMovements || []);
      setRecommendations(res.recommendations || []);
      setAiSummary(res.aiSummary || '');
      setAnalysisCompleted(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error running blockchain analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateEvidenceRecord = async () => {
    try {
      const res = await api.createEvidence({
        caseId: 'case-001',
        transactionHash: '0x7791820491820491820491820491820491820491820491820491820491820491',
        blockNumber: 38291048,
        blockTimestamp: new Date().toISOString(),
        walletAddress: vasp?.depositAddress || walletAddress,
        blockchain,
        source: 'CryptoTrace Automated Forensics Snapshot',
        notes: `Sealed evidence record for suspect wallet ${walletAddress} tracing to ${vasp?.name || 'VASP'}`
      });

      if (res.success) {
        setEvidenceCreatedId(res.evidenceRecord.evidenceRecordId);
        // Also log audit event
        await api.createAuditLog({
          action: 'Evidence Record Generated',
          caseId: 'CYBER-2026-001',
          details: `Generated cryptographic evidence record ${res.evidenceRecord.evidenceRecordId}`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-cyan-400" />
            <span>Automated Blockchain Wallet Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Multi-hop transaction traversal, layering detection & exchange attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setWalletAddress(DEMO_WALLET);
              setBlockchain('Ethereum');
              triggerAnalysis();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo Wallet (CYBER-2026-001)</span>
          </button>
        </div>
      </div>

      {/* Analysis Control Input Bar */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Address input */}
          <div className="lg:col-span-6">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
              Suspect Cryptocurrency Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                placeholder="Enter suspect wallet (0x... or bc1...)"
                className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-4 py-3 text-sm text-cyan-200 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button
                onClick={() => handleCopy(walletAddress)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 p-1"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Blockchain Selector */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
              Blockchain
            </label>
            <select
              value={blockchain}
              onChange={e => setBlockchain(e.target.value as BlockchainType)}
              className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="BNB Chain">BNB Chain</option>
              <option value="Polygon">Polygon</option>
            </select>
          </div>

          {/* Analysis Depth */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
              Analysis Depth
            </label>
            <select
              value={hops}
              onChange={e => setHops(Number(e.target.value))}
              className="w-full bg-cyber-950 border border-cyber-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={1}>1 Hop (Direct Counterparties)</option>
              <option value={2}>2 Hops (Immediate Layering)</option>
              <option value={3}>3 Hops (Extended Flow)</option>
              <option value={5}>5 Hops (Deep Forensics)</option>
            </select>
          </div>

          {/* Start Analysis Button */}
          <div className="lg:col-span-2">
            <button
              onClick={triggerAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START BLOCKCHAIN ANALYSIS</span>
            </button>
          </div>
        </div>

        {/* Quick parameters info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-4">
            <span>Time Range:</span>
            {['24 Hours', '7 Days', '30 Days', 'All Available'].map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === tr ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'hover:text-slate-200'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deterministic Demo Provider Active</span>
          </div>
        </div>
      </div>

      {/* Progress Animation Modal */}
      <AnalysisProgressModal
        isOpen={showProgressModal}
        onComplete={handlePipelineCompleted}
      />

      {/* Analysis Results Display */}
      {analysisCompleted && intel && risk && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Intelligence & Risk Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Wallet Intelligence Card (Section 10) */}
            <div className="lg:col-span-7 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Wallet Intelligence Summary
                  </h3>
                </div>
                <RiskBadge level={intel.riskLevel} score={intel.riskScore} size="md" />
              </div>

              {/* Wallet Address Header */}
              <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Monitored Address</div>
                  <div className="text-sm font-mono text-cyan-300 font-bold break-all">
                    {intel.address}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-cyber-800 text-slate-300 font-mono ml-2 shrink-0">
                  {intel.blockchain}
                </span>
              </div>

              {/* 4-Column Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-cyber-950/70 p-3 rounded-xl border border-cyber-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">Total Received</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    ${intel.totalReceived.toLocaleString()}
                  </div>
                </div>

                <div className="bg-cyber-950/70 p-3 rounded-xl border border-cyber-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">Total Forwarded</div>
                  <div className="text-base font-bold text-red-400 font-mono mt-0.5">
                    ${intel.totalSent.toLocaleString()}
                  </div>
                </div>

                <div className="bg-cyber-950/70 p-3 rounded-xl border border-cyber-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">Residual Balance</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    ${intel.balance.toLocaleString()}
                  </div>
                </div>

                <div className="bg-cyber-950/70 p-3 rounded-xl border border-cyber-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">Counterparties</div>
                  <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                    {intel.counterpartiesCount} Unique
                  </div>
                </div>
              </div>

              {/* Metadata row */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1 text-slate-400">
                <div>First Seen: <span className="text-slate-200">{intel.firstSeen}</span></div>
                <div>Last Activity: <span className="text-slate-200">{intel.lastActivity}</span></div>
              </div>

              {/* AI Investigative Summary */}
              {aiSummary && (
                <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs leading-relaxed text-slate-300 font-sans">
                  <span className="font-bold text-cyan-400 font-mono block mb-1">
                    Automated Forensics Narrative:
                  </span>
                  {aiSummary}
                </div>
              )}
            </div>

            {/* Risk Engine & Contributing Indicators (Section 11 & 18) */}
            <div className="lg:col-span-5 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Risk Engine Score: {risk.score}/100
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 font-mono font-bold">
                    {risk.level}
                  </span>
                </div>

                {/* Fraud Typology Box (Section 18) */}
                <div className="mt-3 p-3 bg-cyber-950 rounded-xl border border-cyber-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Detected Typology:</span>
                    <span className="text-cyan-400 font-mono font-semibold">
                      Confidence: {risk.fraudTypology.confidence}%
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {risk.fraudTypology.pattern}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Requires investigator verification. (Not a judicial conclusion).
                  </div>
                </div>

                {/* Contributing Indicators Checklist */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Contributing Risk Indicators:
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {risk.indicators.map((ind, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-2 p-2 rounded-lg text-xs font-mono ${
                          ind.triggered ? 'bg-red-950/30 border border-red-500/20 text-slate-200' : 'text-slate-500 opacity-60'
                        }`}
                      >
                        {ind.triggered ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 mt-0.5"></div>
                        )}
                        <div>
                          <div className="font-semibold flex items-center gap-1.5">
                            <span>{ind.label}</span>
                            {ind.triggered && <span className="text-red-400 text-[10px]">(+{ind.weight})</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ind.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-cyber-800">
                <button
                  onClick={handleCreateEvidenceRecord}
                  className="flex-1 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-cyan-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preserve Evidence</span>
                </button>

                <button
                  onClick={() => navigate('/reports?caseId=case-001')}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Evidence Preservation Confirmation Banner if created */}
          {evidenceCreatedId && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Evidence Record Sealed: <strong>{evidenceCreatedId}</strong> (SHA-256 integrity hash committed)</span>
              </div>
              <button
                onClick={() => navigate('/evidence')}
                className="underline hover:text-white"
              >
                View Evidence Vault →
              </button>
            </div>
          )}

          {/* FUND FLOW GRAPH (Section 13) */}
          {graph && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>Fund Flow Investigation Graph</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Interactive multi-hop visualization
                </span>
              </div>
              <InteractiveFundFlow 
                graph={graph} 
                onSelectAddress={(addr) => {
                  setWalletAddress(addr);
                  triggerAnalysis();
                }}
              />
            </div>
          )}

          {/* Lower Forensic Panels: VASP Attribution + Intermediary Layering + Cross-Chain */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Nearest Identified VASP / Exchange Attribution (Section 14 & 15) */}
            <div className="lg:col-span-5 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Nearest Identified VASP
                  </h3>
                </div>
                {vasp && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                    {vasp.attributionStatus}
                  </span>
                )}
              </div>

              {vasp ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-cyber-950 rounded-xl border border-cyber-800">
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">VASP / Entity</div>
                      <div className="text-base font-bold text-white">{vasp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{vasp.entityType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Attribution Confidence</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">{vasp.confidence}%</div>
                      <div className="text-[10px] text-cyan-300 font-mono">{vasp.distanceHops} hops downstream</div>
                    </div>
                  </div>

                  <div className="p-3 bg-cyber-950/60 rounded-xl border border-cyber-800 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deposit Address:</span>
                      <span className="text-cyan-300 truncate max-w-[190px]">{vasp.depositAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Traced Amount:</span>
                      <span className="text-emerald-400 font-bold">${vasp.totalReceivedUsd.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Interaction:</span>
                      <span className="text-slate-200">{vasp.lastInteraction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Attribution Source:</span>
                      <span className="text-slate-300 truncate max-w-[190px]">{vasp.source}</span>
                    </div>
                  </div>

                  {/* Evidence Points */}
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-1.5">
                      Attribution Evidence:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 font-mono">
                      {vasp.evidencePoints.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 font-mono flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Demo Attribution Dataset. Sourced from mock cluster registry for law enforcement prototyping.</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  No reliable VASP attribution found within current hop distance.
                </div>
              )}
            </div>

            {/* Intermediary Wallet Detection (Section 16) */}
            <div className="lg:col-span-4 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
                <div className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Intermediary Layering Wallets
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono">
                  {intermediaries.length} Detected
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {intermediaries.map((inter, i) => (
                  <div key={i} className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-semibold truncate max-w-[150px]">
                        {inter.wallet.slice(0, 8)}...{inter.wallet.slice(-4)}
                      </span>
                      <RiskBadge level={inter.riskIndicator} size="sm" />
                    </div>

                    <div className="text-[11px] text-slate-300 font-sans">
                      {inter.patternLabel}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-cyber-850">
                      <div>Received: <span className="text-emerald-400 font-bold">${inter.receivedUsd.toLocaleString()}</span></div>
                      <div>Forwarded: <span className="text-red-400 font-bold">${inter.forwardedUsd.toLocaleString()}</span></div>
                      <div>Holding Time: <span className="text-white font-bold">{inter.avgHoldingMinutes} mins</span></div>
                      <div>Forwarding Ratio: <span className="text-amber-400 font-bold">{inter.forwardingRatio}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Chain Movement & Recommendations (Section 17 & 20) */}
            <div className="lg:col-span-3 bg-cyber-900 border border-cyber-700/80 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-cyber-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Cross-Chain Activity</span>
                  </h3>
                </div>

                {crossChain.map((cc, i) => (
                  <div key={i} className="mt-3 p-3 bg-cyber-950 rounded-xl border border-cyber-800 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="text-blue-400">{cc.sourceChain}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-yellow-400">{cc.destinationChain}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{cc.bridge}</div>
                    <div className="flex justify-between pt-1 border-t border-cyber-850 text-[11px]">
                      <span className="text-slate-400">Volume:</span>
                      <span className="text-emerald-400 font-bold">${cc.usdValue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}

                {/* Recommendations */}
                <div className="mt-4">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-2">
                    Investigative Action Checklist:
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                    {recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => navigate('/reports?caseId=case-001')}
                className="w-full py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>Full Formal Investigation Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
