import { Request, Response } from 'express';
import { 
  initialCases, 
  demoWalletsIntelligence, 
  demoTransactions, 
  demoVaspAttributions, 
  demoIntermediaries, 
  demoCrossChainMovements, 
  demoAlerts, 
  demoEvidenceRecords, 
  demoAuditLogs, 
  demoConnectors,
  DEMO_SUSPECT_WALLET,
  DEMO_VICTIM_WALLET,
  DEMO_INTERMEDIARY_A,
  DEMO_INTERMEDIARY_B,
  DEMO_BRIDGE_ADDR,
  DEMO_BNB_INTERMEDIARY,
  DEMO_VASP_DEPOSIT,
  DEMO_MIXER_INDICATOR
} from '../data/mockData.js';
import { MockBlockchainProvider } from '../providers/BlockchainProvider.js';
import { RiskEngine } from '../services/RiskEngine.js';
import { VASPAttributionService } from '../services/VASPAttributionService.js';
import { AIAnalysisService } from '../services/AIAnalysisService.js';
import { EvidenceService } from '../services/EvidenceService.js';
import { ReportService } from '../services/ReportService.js';
import { BlockchainType, Case, FundFlowGraph, GraphEdge, GraphNode, RealtimeAlert } from '../types/index.js';

const blockchainProvider = new MockBlockchainProvider();
const riskEngine = new RiskEngine();
const vaspService = new VASPAttributionService();
const aiService = new AIAnalysisService();
const evidenceService = new EvidenceService();
const reportService = new ReportService();

// State in memory
let casesList: Case[] = [...initialCases];
let liveAlerts: RealtimeAlert[] = [...demoAlerts];
let currentSimulatedBlock = 19842145;

export const loginHandler = (req: Request, res: Response) => {
  const { officerId, password } = req.body;
  if ((officerId === 'demo-investigator' && password === 'demo123') || (officerId && password)) {
    return res.json({
      success: true,
      token: 'jwt-demo-session-token-cybercrime-investigator-2026',
      user: {
        id: 'usr-001',
        officerId: officerId || 'demo-investigator',
        name: 'Insp. Rahul Sharma',
        badgeNumber: 'CYBER-DELHI-8910',
        role: 'Senior Cybercrime Forensic Analyst',
        department: 'Special Financial & Cyber Crime Intelligence Cell'
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Use demo-investigator / demo123' });
};

export const getDashboardStats = (req: Request, res: Response) => {
  res.json({
    totalCases: 128,
    activeInvestigations: 23,
    highRiskWallets: 47,
    vaspAttributions: 31,
    fundsTracedInr: '₹1.84 Cr',
    fundsTracedUsd: '$221,480',
    transactionsAnalyzed: 12482,
    currentLiveBlock: currentSimulatedBlock,
    recentInvestigations: casesList.slice(0, 5).map(c => ({
      caseId: c.caseNumber,
      wallet: c.walletAddress,
      blockchain: c.blockchain,
      risk: c.riskLevel,
      nearestVasp: c.id === 'case-001' ? 'Binance' : (c.id === 'case-002' ? 'WazirX (Demo)' : 'Pending'),
      amount: `$${c.totalLossUsd.toLocaleString()}`,
      status: c.status,
      lastAnalyzed: '2026-09-27 09:50 IST'
    })),
    typologyDistribution: [
      { name: 'Investment Fraud', count: 54, value: 42 },
      { name: 'Task Scam', count: 32, value: 25 },
      { name: 'Phishing', count: 21, value: 16 },
      { name: 'Ransomware', count: 12, value: 10 },
      { name: 'Sextortion', count: 9, value: 7 }
    ],
    chainDistribution: [
      { name: 'Ethereum', value: 48, fill: '#627EEA' },
      { name: 'BNB Chain', value: 28, fill: '#F3BA2F' },
      { name: 'Bitcoin', value: 16, fill: '#F7931A' },
      { name: 'Polygon', value: 8, fill: '#8247E5' }
    ],
    volumeOverTime: [
      { date: 'Sep 21', volume: 18400, cases: 4 },
      { date: 'Sep 22', volume: 24200, cases: 7 },
      { date: 'Sep 23', volume: 19800, cases: 5 },
      { date: 'Sep 24', volume: 38900, cases: 9 },
      { date: 'Sep 25', volume: 46300, cases: 12 },
      { date: 'Sep 26', volume: 32100, cases: 8 },
      { date: 'Sep 27', volume: 42850, cases: 14 }
    ]
  });
};

export const getCases = (req: Request, res: Response) => {
  const { search, risk, blockchain, status } = req.query;
  let filtered = [...casesList];

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(c => 
      c.caseNumber.toLowerCase().includes(q) ||
      c.complaintId.toLowerCase().includes(q) ||
      c.walletAddress.toLowerCase().includes(q) ||
      c.victimReference.toLowerCase().includes(q)
    );
  }
  if (risk && risk !== 'ALL') {
    filtered = filtered.filter(c => c.riskLevel === risk);
  }
  if (blockchain && blockchain !== 'ALL') {
    filtered = filtered.filter(c => c.blockchain === blockchain);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(c => c.status === status);
  }

  res.json({ cases: filtered });
};

export const getCaseById = (req: Request, res: Response) => {
  const found = casesList.find(c => c.id === req.params.id || c.caseNumber === req.params.id);
  if (!found) {
    return res.status(404).json({ message: 'Case not found' });
  }
  res.json({ case: found });
};

export const createCase = (req: Request, res: Response) => {
  const { complaintId, victimReference, fraudType, walletAddress, blockchain, totalLossUsd, notes } = req.body;
  const newCase: Case = {
    id: `case-${Date.now()}`,
    caseNumber: `CASE-2026-${(casesList.length + 1).toString().padStart(3, '0')}`,
    complaintId: complaintId || `NCRP-2026-IN-${Math.floor(10000 + Math.random() * 90000)}`,
    victimReference: victimReference || `VIC-${Date.now().toString().slice(-4)}`,
    fraudType: fraudType || 'Investment Fraud',
    reportedDate: '2026-09-27 10:00 IST',
    investigatingOfficer: 'Insp. R. Sharma (Cyber Crime Cell)',
    walletAddress: walletAddress || DEMO_SUSPECT_WALLET,
    blockchain: blockchain || 'Ethereum',
    status: 'Active',
    riskLevel: 'HIGH',
    totalLossUsd: Number(totalLossUsd) || 15000,
    notes: notes || 'New case created via cybercrime intake portal.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  casesList.unshift(newCase);
  res.status(201).json({ success: true, case: newCase });
};

export const analyzeWallet = async (req: Request, res: Response) => {
  const { walletAddress, blockchain = 'Ethereum', hops = 3, timeRange = 'All Available' } = req.body;

  if (!walletAddress || !blockchainProvider.validateAddress(walletAddress, blockchain as BlockchainType)) {
    return res.status(400).json({ 
      error: 'Invalid wallet address for selected blockchain.',
      valid: false 
    });
  }

  const walletIntel = await blockchainProvider.getWalletIntelligence(walletAddress, blockchain as BlockchainType);
  const transactions = await blockchainProvider.getTransactions(walletAddress, blockchain as BlockchainType);
  const riskEval = riskEngine.evaluateWallet(walletAddress, blockchain as BlockchainType, transactions);
  const vaspAttributions = vaspService.getAttributionsForWallet(walletAddress, blockchain as BlockchainType);
  const nearestVasp = vaspService.getNearestVASP(walletAddress, blockchain as BlockchainType);
  const recommendations = aiService.generateRecommendations(riskEval.score, nearestVasp, true, true);
  const summary = aiService.generateInvestigationSummary(walletIntel, nearestVasp);

  // Generate fund flow graph
  const graph = buildGraphForAddress(walletAddress, blockchain as BlockchainType, nearestVasp);

  res.json({
    walletIntelligence: walletIntel,
    transactions,
    riskEvaluation: riskEval,
    vaspAttributions,
    nearestVasp,
    recommendations,
    aiSummary: summary,
    intermediaries: demoIntermediaries,
    crossChainMovements: demoCrossChainMovements,
    graph,
    analysisMetadata: {
      analyzedAt: new Date().toISOString(),
      hopsTraced: hops,
      timeRangeApplied: timeRange,
      blockchain: blockchain,
      engineVersion: 'CryptoTrace AI v2.4.1 (Demo Mode)'
    }
  });
};

function buildGraphForAddress(address: string, chain: BlockchainType, nearestVasp: any): FundFlowGraph {
  const isPrimary = address.toLowerCase() === DEMO_SUSPECT_WALLET.toLowerCase();

  if (isPrimary) {
    const nodes: GraphNode[] = [
      { id: 'node-victim', label: 'Victim Wallet', type: 'Victim', address: DEMO_VICTIM_WALLET, blockchain: 'Ethereum', balanceUsd: 120 },
      { id: 'node-suspect', label: 'Suspect Primary', type: 'Suspect Wallet', address: DEMO_SUSPECT_WALLET, blockchain: 'Ethereum', riskLevel: 'CRITICAL', balanceUsd: 3430 },
      { id: 'node-inter-a', label: 'Intermediary Relay A', type: 'Intermediary', address: DEMO_INTERMEDIARY_A, blockchain: 'Ethereum', riskLevel: 'HIGH', balanceUsd: 260 },
      { id: 'node-inter-b', label: 'Intermediary Relay B', type: 'Intermediary', address: DEMO_INTERMEDIARY_B, blockchain: 'Ethereum', riskLevel: 'HIGH', balanceUsd: 410 },
      { id: 'node-bridge', label: 'Stargate Bridge', type: 'Bridge', address: DEMO_BRIDGE_ADDR, blockchain: 'Ethereum', balanceUsd: 1250000 },
      { id: 'node-bnb-inter', label: 'BNB Chain Relay', type: 'Intermediary', address: DEMO_BNB_INTERMEDIARY, blockchain: 'BNB Chain', riskLevel: 'CRITICAL', balanceUsd: 40 },
      { id: 'node-vasp-deposit', label: 'Binance Deposit Cluster', type: 'Exchange', address: DEMO_VASP_DEPOSIT, blockchain: 'BNB Chain', riskLevel: 'MEDIUM', balanceUsd: 14280, isDestination: true },
      { id: 'node-vasp', label: 'Binance (VASP)', type: 'VASP', address: 'BINANCE_HOT_VAULT_ENTITY', blockchain: 'BNB Chain', isDestination: true },
      { id: 'node-mixer', label: 'Mixer Pool Indicator', type: 'Mixer Indicator', address: DEMO_MIXER_INDICATOR, blockchain: 'Ethereum', riskLevel: 'CRITICAL' }
    ];

    const edges: GraphEdge[] = [
      { id: 'e1', source: 'node-victim', target: 'node-suspect', amount: 15000, asset: 'USDT', usdValue: 15000, timestamp: '09:41 IST', transactionHash: '0x8f2c31e9...', hop: 1 },
      { id: 'e2', source: 'node-suspect', target: 'node-inter-a', amount: 18200, asset: 'USDT', usdValue: 18200, timestamp: '09:45 IST', transactionHash: '0x991824aa...', hop: 2 },
      { id: 'e3', source: 'node-inter-a', target: 'node-inter-b', amount: 17940, asset: 'USDT', usdValue: 17940, timestamp: '09:46 IST', transactionHash: '0x12a8849b...', hop: 3 },
      { id: 'e4', source: 'node-inter-b', target: 'node-bridge', amount: 12500, asset: 'USDT', usdValue: 12500, timestamp: '09:47 IST', transactionHash: '0x4481092c...', hop: 4 },
      { id: 'e5', source: 'node-bridge', target: 'node-bnb-inter', amount: 12470, asset: 'USDT (BEP20)', usdValue: 12470, timestamp: '09:48 IST', transactionHash: '0x66184910...', hop: 5 },
      { id: 'e6', source: 'node-bnb-inter', target: 'node-vasp-deposit', amount: 12430, asset: 'USDT (BEP20)', usdValue: 12430, timestamp: '09:49 IST', transactionHash: '0x77918204...', hop: 6 },
      { id: 'e7', source: 'node-vasp-deposit', target: 'node-vasp', amount: 12430, asset: 'USDT (Sweep)', usdValue: 12430, timestamp: '09:50 IST', transactionHash: '0x8820192a...', hop: 7 },
      { id: 'e8', source: 'node-suspect', target: 'node-mixer', amount: 5450, asset: 'ETH', usdValue: 5450, timestamp: '09:46 IST', transactionHash: '0x99201948...', hop: 2 }
    ];

    const shortestPathToVASP = ['node-victim', 'node-suspect', 'node-inter-a', 'node-inter-b', 'node-bridge', 'node-bnb-inter', 'node-vasp-deposit', 'node-vasp'];

    return { nodes, edges, shortestPathToVASP };
  }

  // Generic dynamic graph for arbitrary address
  const nodes: GraphNode[] = [
    { id: 'node-root-vic', label: 'Origin Counterparty', type: 'Victim', address: `0xORIGIN_${address.slice(2, 8)}`, blockchain: chain, balanceUsd: 500 },
    { id: 'node-root-suspect', label: 'Target Address', type: 'Suspect Wallet', address: address, blockchain: chain, riskLevel: 'HIGH', balanceUsd: 1200 },
    { id: 'node-root-inter1', label: 'Intermediary Node', type: 'Intermediary', address: `0xLAYER1_${address.slice(2, 6)}`, blockchain: chain, riskLevel: 'MEDIUM', balanceUsd: 350 },
    { id: 'node-root-vasp', label: nearestVasp ? nearestVasp.name : 'Target VASP', type: 'VASP', address: nearestVasp ? nearestVasp.depositAddress : '0xVASP_DEST', blockchain: chain, isDestination: true }
  ];

  const edges: GraphEdge[] = [
    { id: 'ge1', source: 'node-root-vic', target: 'node-root-suspect', amount: 8500, asset: 'USDT', usdValue: 8500, timestamp: 'Recent', transactionHash: '0xgen1...', hop: 1 },
    { id: 'ge2', source: 'node-root-suspect', target: 'node-root-inter1', amount: 8200, asset: 'USDT', usdValue: 8200, timestamp: 'Recent', transactionHash: '0xgen2...', hop: 2 },
    { id: 'ge3', source: 'node-root-inter1', target: 'node-root-vasp', amount: 8100, asset: 'USDT', usdValue: 8100, timestamp: 'Recent', transactionHash: '0xgen3...', hop: 3 }
  ];

  return {
    nodes,
    edges,
    shortestPathToVASP: ['node-root-vic', 'node-root-suspect', 'node-root-inter1', 'node-root-vasp']
  };
}

export const getWalletTransactions = async (req: Request, res: Response) => {
  const address = req.params.address as string;
  const txs = await blockchainProvider.getTransactions(address, 'Ethereum');
  res.json({ transactions: txs });
};

export const getWalletGraph = async (req: Request, res: Response) => {
  const address = req.params.address as string;
  const vasp = vaspService.getNearestVASP(address, 'Ethereum');
  const graph = buildGraphForAddress(address, 'Ethereum', vasp);
  res.json({ graph });
};

export const getWalletRisk = async (req: Request, res: Response) => {
  const address = req.params.address as string;
  const txs = await blockchainProvider.getTransactions(address, 'Ethereum');
  const risk = riskEngine.evaluateWallet(address, 'Ethereum', txs);
  res.json({ risk });
};

export const getWalletVASP = (req: Request, res: Response) => {
  const address = req.params.address as string;
  const vaspList = vaspService.getAttributionsForWallet(address, 'Ethereum');
  const nearest = vaspService.getNearestVASP(address, 'Ethereum');
  res.json({ attributions: vaspList, nearestVasp: nearest });
};

export const getWalletAlerts = (req: Request, res: Response) => {
  res.json({ alerts: liveAlerts });
};

export const createEvidence = (req: Request, res: Response) => {
  const record = evidenceService.createEvidenceRecord(req.body);
  res.status(201).json({ success: true, evidenceRecord: record });
};

export const getEvidenceList = (req: Request, res: Response) => {
  const records = evidenceService.getRecords(req.query.caseId as string);
  res.json({ evidenceRecords: records });
};

export const getCaseReport = async (req: Request, res: Response) => {
  const caseItem = casesList.find(c => c.id === req.params.id || c.caseNumber === req.params.id) || casesList[0];
  const walletIntel = await blockchainProvider.getWalletIntelligence(caseItem.walletAddress, caseItem.blockchain);
  const txs = await blockchainProvider.getTransactions(caseItem.walletAddress, caseItem.blockchain);
  const vasp = vaspService.getNearestVASP(caseItem.walletAddress, caseItem.blockchain);
  const risk = riskEngine.evaluateWallet(caseItem.walletAddress, caseItem.blockchain, txs);
  const recommendations = aiService.generateRecommendations(risk.score, vasp, true, true);
  const evidence = evidenceService.getRecords(caseItem.id);

  const report = reportService.buildReport(
    caseItem,
    walletIntel,
    vasp,
    demoIntermediaries,
    demoCrossChainMovements,
    risk,
    recommendations,
    evidence,
    txs
  );

  res.json({ report });
};

export const getIntegrations = (req: Request, res: Response) => {
  res.json({ connectors: demoConnectors });
};

export const getAuditLogs = (req: Request, res: Response) => {
  res.json({ logs: demoAuditLogs });
};

export const createAuditLog = (req: Request, res: Response) => {
  const entry = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
    officer: req.body.officer || 'demo-investigator',
    action: req.body.action || 'Investigation Action',
    caseId: req.body.caseId || 'CYBER-2026-001',
    source: '127.0.0.1 (Web Console)',
    result: (req.body.result || 'SUCCESS') as 'SUCCESS' | 'WARNING' | 'FAILED',
    details: req.body.details || 'Action logged by investigator'
  };
  demoAuditLogs.unshift(entry);
  res.status(201).json({ success: true, log: entry });
};

export const searchGlobal = async (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim().toLowerCase();
  if (!q) {
    return res.json({ results: [] });
  }

  const results: any[] = [];

  // Match cases
  casesList.forEach(c => {
    if (c.caseNumber.toLowerCase().includes(q) || c.complaintId.toLowerCase().includes(q)) {
      results.push({
        type: 'CASE',
        title: `${c.caseNumber} (${c.fraudType})`,
        subtitle: `Complaint ID: ${c.complaintId} | Victim: ${c.victimReference}`,
        link: `/cases/${c.id}`,
        badge: c.riskLevel
      });
    }
  });

  // Match wallet
  if (q.startsWith('0x') || q.startsWith('bc1') || q.length > 8) {
    results.push({
      type: 'WALLET',
      title: `Wallet Address: ${q.slice(0, 16)}...`,
      subtitle: `Query blockchain analytics & transaction graph`,
      link: `/analyze?wallet=${encodeURIComponent(q)}`,
      badge: 'EXPLORE'
    });
  }

  // Match transactions
  demoTransactions.forEach(t => {
    if (t.hash.toLowerCase().includes(q)) {
      results.push({
        type: 'TRANSACTION',
        title: `Tx: ${t.hash.slice(0, 18)}...`,
        subtitle: `Amount: $${t.usdValue.toLocaleString()} ${t.asset} | Block: ${t.blockNumber}`,
        link: `/transactions?hash=${t.hash}`,
        badge: t.direction
      });
    }
  });

  res.json({ results });
};

export const getLiveSimulationTick = (req: Request, res: Response) => {
  currentSimulatedBlock += 1;
  const newTxHash = `0xsim${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
  const simulatedTx = {
    hash: newTxHash,
    block: currentSimulatedBlock,
    timestamp: new Date().toLocaleTimeString() + ' IST',
    amount: Math.floor(500 + Math.random() * 4500),
    asset: 'USDT',
    from: `0xHOP_${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
    to: DEMO_VASP_DEPOSIT,
    action: 'Mempool Transaction Indexed & Scored'
  };

  res.json({
    blockNumber: currentSimulatedBlock,
    liveEvent: simulatedTx
  });
};
