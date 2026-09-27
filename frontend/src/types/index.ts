export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FraudType = 
  | 'Investment Fraud' 
  | 'Task Fraud' 
  | 'Phishing' 
  | 'Ransomware' 
  | 'Sextortion' 
  | 'Darknet' 
  | 'Money Laundering'
  | 'Other';

export type BlockchainType = 'Ethereum' | 'Bitcoin' | 'BNB Chain' | 'Polygon';

export const DEMO_SUSPECT_WALLET = '0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F';

export interface User {
  id: string;
  officerId: string;
  name: string;
  badgeNumber: string;
  role: string;
  department: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  complaintId: string;
  victimReference: string;
  fraudType: FraudType;
  reportedDate: string;
  investigatingOfficer: string;
  walletAddress: string;
  blockchain: BlockchainType;
  status: 'Active' | 'Under Review' | 'Escalated' | 'Archived' | 'Closed';
  riskLevel: RiskLevel;
  totalLossUsd: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletIntelligence {
  address: string;
  blockchain: BlockchainType;
  riskScore: number;
  riskLevel: RiskLevel;
  firstSeen: string;
  lastActivity: string;
  balance: number;
  asset: string;
  totalReceived: number;
  totalSent: number;
  txCount: number;
  counterpartiesCount: number;
  isIntermediary: boolean;
  isVaspAssociated: boolean;
  tag?: string;
}

export interface Transaction {
  id: string;
  hash: string;
  timestamp: string;
  direction: 'INCOMING' | 'OUTGOING' | 'INTERNAL';
  from: string;
  to: string;
  amount: number;
  asset: string;
  usdValue: number;
  status: 'CONFIRMED' | 'PENDING' | 'FLAGGED';
  riskIndicator?: string;
  blockNumber: number;
  gasUsed?: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Victim' | 'Suspect Wallet' | 'Intermediary' | 'Bridge' | 'DeFi' | 'Mixer Indicator' | 'Exchange' | 'VASP';
  address: string;
  blockchain: BlockchainType;
  riskLevel?: RiskLevel;
  balanceUsd?: number;
  isDestination?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  asset: string;
  usdValue: number;
  timestamp: string;
  transactionHash: string;
  hop: number;
}

export interface FundFlowGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  shortestPathToVASP?: string[];
}

export interface VASPEntity {
  id: string;
  name: string;
  entityType: 'VASP' | 'Centralized Exchange' | 'P2P Platform' | 'OTC Desk' | 'Payment Gateway';
  blockchain: BlockchainType;
  depositAddress: string;
  confidence: number;
  attributionStatus: 'CONFIRMED ATTRIBUTION' | 'LIKELY ATTRIBUTION' | 'POSSIBLE ATTRIBUTION' | 'UNKNOWN';
  source: string;
  distanceHops: number;
  totalReceivedUsd: number;
  lastInteraction: string;
  evidencePoints: string[];
  jurisdiction?: string;
}

export interface IntermediaryAnalysis {
  wallet: string;
  receivedUsd: number;
  forwardedUsd: number;
  avgHoldingMinutes: number;
  forwardingRatio: number;
  riskIndicator: RiskLevel;
  patternLabel: string;
  fanOutDegree: number;
}

export interface CrossChainMovement {
  id: string;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  bridge: string;
  amount: number;
  asset: string;
  usdValue: number;
  timestamp: string;
  sourceTxHash: string;
  destTxHash: string;
  suspectAddress: string;
  destinationAddress: string;
}

export interface RiskIndicatorItem {
  code: string;
  label: string;
  weight: number;
  triggered: boolean;
  description: string;
}

export interface RiskEvaluation {
  score: number;
  level: RiskLevel;
  indicators: RiskIndicatorItem[];
  explanation: string[];
  fraudTypology: {
    pattern: string;
    confidence: number;
    indicators: string[];
  };
}

export interface RealtimeAlert {
  id: string;
  timestamp: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  wallet: string;
  transactionHash: string;
  reason: string;
  action: string;
  read?: boolean;
}

export interface EvidenceRecord {
  id: string;
  evidenceRecordId: string;
  caseId?: string;
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: string;
  walletAddress: string;
  blockchain: BlockchainType;
  source: string;
  retrievedAt: string;
  dataHash: string;
  analysisVersion: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officer: string;
  action: string;
  caseId?: string;
  source: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface ConnectorIntegration {
  id: string;
  name: string;
  shortCode: string;
  status: 'DEMO CONNECTOR' | 'ACTIVE / DEMO' | 'ACTIVE' | 'STANDBY';
  lastSync: string;
  apiVersion: string;
  recordsRetrieved: number;
  description: string;
  authType: string;
  type: 'GOVERNMENT' | 'BLOCKCHAIN' | 'INTELLIGENCE' | 'FORENSIC';
}
