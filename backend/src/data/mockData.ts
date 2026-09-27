import { Case, Transaction, GraphNode, GraphEdge, VASPEntity, IntermediaryAnalysis, CrossChainMovement, RealtimeAlert, EvidenceRecord, AuditLogEntry, ConnectorIntegration, WalletIntelligence } from '../types/index.js';

export const DEMO_SUSPECT_WALLET = '0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F';
export const DEMO_VICTIM_WALLET = '0xVICTIM3849AB238914D8921B78C41951A820E9';
export const DEMO_INTERMEDIARY_A = '0xINTER_A72B889C218B19C91F24792C7210928B3';
export const DEMO_INTERMEDIARY_B = '0xINTER_B441D992CA55021F89410382AA4710189';
export const DEMO_BRIDGE_ADDR = '0xBRIDGE_CROSSCHAIN_SYNTHETIC_ESCROW_CONTRACT';
export const DEMO_BNB_INTERMEDIARY = '0xBNB_INTER_99C128DA5512B4C47101B2A109887C';
export const DEMO_VASP_DEPOSIT = '0xBINANCE_DEPOSIT_CLUSTER_DEMO_09182397120';
export const DEMO_MIXER_INDICATOR = '0xTORNADO_STYLE_POOL_SIMULATION_ADDR_8192';

export const initialCases: Case[] = [
  {
    id: 'case-001',
    caseNumber: 'CYBER-2026-001',
    complaintId: 'NCRP-2026-IN-98214',
    victimReference: 'DEMO-VICTIM-001',
    fraudType: 'Investment Fraud',
    reportedDate: '2026-09-27 09:41 IST',
    investigatingOfficer: 'Insp. R. Sharma (Cyber Crime Cell)',
    walletAddress: DEMO_SUSPECT_WALLET,
    blockchain: 'Ethereum',
    status: 'Active',
    riskLevel: 'CRITICAL',
    totalLossUsd: 42850,
    notes: 'Victim deceived through high-yield artificial algorithmic crypto trading syndicate website. Initial deposit followed by urgent requests for margin funds.',
    createdAt: '2026-09-27T04:11:00Z',
    updatedAt: '2026-09-27T04:30:00Z'
  },
  {
    id: 'case-002',
    caseNumber: 'CASE-2026-002',
    complaintId: 'NCRP-2026-MH-44102',
    victimReference: 'VIC-PUNE-882',
    fraudType: 'Task Fraud',
    reportedDate: '2026-09-26 14:15 IST',
    investigatingOfficer: 'Sub-Insp. A. Kulkarni',
    walletAddress: '0x3892FcA9821b99a8eD124489aAc120019A821102',
    blockchain: 'BNB Chain',
    status: 'Under Review',
    riskLevel: 'HIGH',
    totalLossUsd: 14820,
    notes: 'Telegram work-from-home product review rating scam with crypto USDT payouts and mandatory top-ups.',
    createdAt: '2026-09-26T08:45:00Z',
    updatedAt: '2026-09-27T02:10:00Z'
  },
  {
    id: 'case-003',
    caseNumber: 'CASE-2026-003',
    complaintId: 'NCRP-2026-DL-11093',
    victimReference: 'VIC-DELHI-409',
    fraudType: 'Phishing',
    reportedDate: '2026-09-25 18:20 IST',
    investigatingOfficer: 'Insp. V. Mehra',
    walletAddress: '0x8849cba912a7741d990098fca201948811d04491',
    blockchain: 'Ethereum',
    status: 'Escalated',
    riskLevel: 'HIGH',
    totalLossUsd: 31200,
    notes: 'Malicious Permit2 phishing signature approved on a spoofed decentralized staking portal.',
    createdAt: '2026-09-25T12:50:00Z',
    updatedAt: '2026-09-26T17:30:00Z'
  },
  {
    id: 'case-004',
    caseNumber: 'CASE-2026-004',
    complaintId: 'NCRP-2026-KA-77312',
    victimReference: 'VIC-BLR-193',
    fraudType: 'Ransomware',
    reportedDate: '2026-09-24 11:00 IST',
    investigatingOfficer: 'Tech Analyst P. Hegde',
    walletAddress: 'bc1q982hf0184g812hsa0921hsf810237hf9a01942',
    blockchain: 'Bitcoin',
    status: 'Active',
    riskLevel: 'CRITICAL',
    totalLossUsd: 85000,
    notes: 'Hospital supply chain ransomware demand note demanding BTC settlement before decryption key release.',
    createdAt: '2026-09-24T05:30:00Z',
    updatedAt: '2026-09-26T11:00:00Z'
  },
  {
    id: 'case-005',
    caseNumber: 'CASE-2026-005',
    complaintId: 'NCRP-2026-TN-39120',
    victimReference: 'VIC-CHN-672',
    fraudType: 'Sextortion',
    reportedDate: '2026-09-23 20:45 IST',
    investigatingOfficer: 'Sub-Insp. S. Raman',
    walletAddress: '0x491f21aa902b8813ef0102b489a2441991823901',
    blockchain: 'Polygon',
    status: 'Archived',
    riskLevel: 'MEDIUM',
    totalLossUsd: 3500,
    notes: 'Extortion blackmail emails threatening leak of video footage unless USDT sent.',
    createdAt: '2026-09-23T15:15:00Z',
    updatedAt: '2026-09-24T09:00:00Z'
  }
];

export const demoWalletsIntelligence: Record<string, WalletIntelligence> = {
  [DEMO_SUSPECT_WALLET]: {
    address: DEMO_SUSPECT_WALLET,
    blockchain: 'Ethereum',
    riskScore: 87,
    riskLevel: 'CRITICAL',
    firstSeen: '2026-09-26 18:30 IST',
    lastActivity: '2026-09-27 09:48 IST',
    balance: 3430.00,
    asset: 'USDT (ERC-20) / ETH',
    totalReceived: 42850.00,
    totalSent: 39420.00,
    txCount: 87,
    counterpartiesCount: 31,
    isIntermediary: false,
    isVaspAssociated: false,
    tag: 'Suspect Primary Fraud Collector'
  },
  [DEMO_INTERMEDIARY_A]: {
    address: DEMO_INTERMEDIARY_A,
    blockchain: 'Ethereum',
    riskScore: 78,
    riskLevel: 'HIGH',
    firstSeen: '2026-09-27 01:10 IST',
    lastActivity: '2026-09-27 09:47 IST',
    balance: 260.00,
    asset: 'USDT / ETH',
    totalReceived: 18200.00,
    totalSent: 17940.00,
    txCount: 42,
    counterpartiesCount: 16,
    isIntermediary: true,
    isVaspAssociated: false,
    tag: 'Intermediary Layering Relay 1'
  },
  [DEMO_INTERMEDIARY_B]: {
    address: DEMO_INTERMEDIARY_B,
    blockchain: 'Ethereum',
    riskScore: 74,
    riskLevel: 'HIGH',
    firstSeen: '2026-09-27 03:40 IST',
    lastActivity: '2026-09-27 09:48 IST',
    balance: 410.00,
    asset: 'USDT / ETH',
    totalReceived: 17800.00,
    totalSent: 17390.00,
    txCount: 29,
    counterpartiesCount: 11,
    isIntermediary: true,
    isVaspAssociated: false,
    tag: 'Intermediary Layering Relay 2'
  },
  [DEMO_VASP_DEPOSIT]: {
    address: DEMO_VASP_DEPOSIT,
    blockchain: 'BNB Chain',
    riskScore: 42,
    riskLevel: 'MEDIUM',
    firstSeen: '2026-08-11 10:00 IST',
    lastActivity: '2026-09-27 09:49 IST',
    balance: 14280.00,
    asset: 'USDT (BEP-20)',
    totalReceived: 149200.00,
    totalSent: 134920.00,
    txCount: 218,
    counterpartiesCount: 94,
    isIntermediary: false,
    isVaspAssociated: true,
    tag: 'Binance Deposit Cluster (Demo Attribution)'
  }
};

export const demoTransactions: Transaction[] = [
  {
    id: 'tx-001',
    hash: '0x8f2c31e9a4058d1973b091f0923e19842c198b1a80c942ba671b2d019f201aa1',
    timestamp: '2026-09-27 09:41:20 IST',
    direction: 'INCOMING',
    from: DEMO_VICTIM_WALLET,
    to: DEMO_SUSPECT_WALLET,
    amount: 15000,
    asset: 'USDT',
    usdValue: 15000,
    status: 'CONFIRMED',
    riskIndicator: 'Direct Victim Deposit - NCRP Reported',
    blockNumber: 19842101,
    gasUsed: 46210
  },
  {
    id: 'tx-002',
    hash: '0x3a71b4e0984920194ac8812c30099182390192847291a921820491829048a192',
    timestamp: '2026-09-27 09:43:05 IST',
    direction: 'INCOMING',
    from: '0xVIC_ANON_881923019823019840192840198230',
    to: DEMO_SUSPECT_WALLET,
    amount: 12500,
    asset: 'USDT',
    usdValue: 12500,
    status: 'CONFIRMED',
    riskIndicator: 'Victim Syndicate Cluster Deposit',
    blockNumber: 19842109,
    gasUsed: 46210
  },
  {
    id: 'tx-003',
    hash: '0x991824aa712894c1982b45109283749102837491028374910283749102837491',
    timestamp: '2026-09-27 09:45:10 IST',
    direction: 'OUTGOING',
    from: DEMO_SUSPECT_WALLET,
    to: DEMO_INTERMEDIARY_A,
    amount: 18200,
    asset: 'USDT',
    usdValue: 18200,
    status: 'CONFIRMED',
    riskIndicator: 'Rapid Forwarding (Under 4 minutes)',
    blockNumber: 19842118,
    gasUsed: 52140
  },
  {
    id: 'tx-004',
    hash: '0x12a8849bca019823910940192830194810293810293810293810293810293810',
    timestamp: '2026-09-27 09:46:18 IST',
    direction: 'OUTGOING',
    from: DEMO_INTERMEDIARY_A,
    to: DEMO_INTERMEDIARY_B,
    amount: 17940,
    asset: 'USDT',
    usdValue: 17940,
    status: 'CONFIRMED',
    riskIndicator: 'Layering Hop 1 -> Hop 2 (Forwarding ratio 98.6%)',
    blockNumber: 19842123,
    gasUsed: 51200
  },
  {
    id: 'tx-005',
    hash: '0x4481092cba918239019283019283019283019283019283019283019283019283',
    timestamp: '2026-09-27 09:47:32 IST',
    direction: 'OUTGOING',
    from: DEMO_INTERMEDIARY_B,
    to: DEMO_BRIDGE_ADDR,
    amount: 12500,
    asset: 'USDT',
    usdValue: 12500,
    status: 'CONFIRMED',
    riskIndicator: 'Cross-Chain Bridge Interaction (Stargate / LayerZero Demo)',
    blockNumber: 19842129,
    gasUsed: 98400
  },
  {
    id: 'tx-006',
    hash: '0x6618491028301928301928301928301928301928301928301928301928301928',
    timestamp: '2026-09-27 09:48:45 IST',
    direction: 'OUTGOING',
    from: DEMO_BRIDGE_ADDR,
    to: DEMO_BNB_INTERMEDIARY,
    amount: 12470,
    asset: 'USDT (BEP20)',
    usdValue: 12470,
    status: 'CONFIRMED',
    riskIndicator: 'Cross-Chain Bridge Receipt on BNB Chain',
    blockNumber: 38291040,
    gasUsed: 42100
  },
  {
    id: 'tx-007',
    hash: '0x7791820491820491820491820491820491820491820491820491820491820491',
    timestamp: '2026-09-27 09:49:12 IST',
    direction: 'OUTGOING',
    from: DEMO_BNB_INTERMEDIARY,
    to: DEMO_VASP_DEPOSIT,
    amount: 12430,
    asset: 'USDT (BEP20)',
    usdValue: 12430,
    status: 'CONFIRMED',
    riskIndicator: 'VASP Exchange Deposit Detected (Binance Cluster)',
    blockNumber: 38291048,
    gasUsed: 39500
  },
  {
    id: 'tx-008',
    hash: '0x9920194810293810293810293810293810293810293810293810293810293810',
    timestamp: '2026-09-27 09:46:50 IST',
    direction: 'OUTGOING',
    from: DEMO_SUSPECT_WALLET,
    to: DEMO_MIXER_INDICATOR,
    amount: 5450,
    asset: 'ETH',
    usdValue: 5450,
    status: 'FLAGGED',
    riskIndicator: 'Obfuscation Pool / Mixer Interaction Indicator',
    blockNumber: 19842125,
    gasUsed: 124000
  },
  {
    id: 'tx-009',
    hash: '0xbb20194810293810293810293810293810293810293810293810293810293810',
    timestamp: '2026-09-26 22:15:00 IST',
    direction: 'INCOMING',
    from: '0xVIC_MUMBAI_3892019481902830192830192830',
    to: DEMO_SUSPECT_WALLET,
    amount: 9800,
    asset: 'USDT',
    usdValue: 9800,
    status: 'CONFIRMED',
    riskIndicator: 'Victim Wire Transfer Equivalent',
    blockNumber: 19841890,
    gasUsed: 46210
  },
  {
    id: 'tx-010',
    hash: '0xcc20194810293810293810293810293810293810293810293810293810293810',
    timestamp: '2026-09-26 23:45:00 IST',
    direction: 'OUTGOING',
    from: DEMO_SUSPECT_WALLET,
    to: '0xCONSOLIDATION_COLLECTOR_990124810293810',
    amount: 9600,
    asset: 'USDT',
    usdValue: 9600,
    status: 'CONFIRMED',
    riskIndicator: 'Consolidation to Second Layer Account',
    blockNumber: 19841950,
    gasUsed: 48900
  },
  {
    id: 'tx-011',
    hash: '0xdd20194810293810293810293810293810293810293810293810293810293810',
    timestamp: '2026-09-26 19:10:00 IST',
    direction: 'INCOMING',
    from: '0xINITIAL_SEED_FUNDER_TORNADO_ASSOCIATE',
    to: DEMO_SUSPECT_WALLET,
    amount: 5550,
    asset: 'ETH',
    usdValue: 5550,
    status: 'FLAGGED',
    riskIndicator: 'Initial Gas/Gasoline Seed from High-Risk Wallet',
    blockNumber: 19841720,
    gasUsed: 21000
  }
];

export const demoVaspAttributions: VASPEntity[] = [
  {
    id: 'vasp-001',
    name: 'Binance',
    entityType: 'Centralized Exchange',
    blockchain: 'BNB Chain',
    depositAddress: DEMO_VASP_DEPOSIT,
    confidence: 92,
    attributionStatus: 'CONFIRMED ATTRIBUTION',
    source: 'Public Attribution Cluster DB + High-Volume Sweeper Match (Demo Dataset)',
    distanceHops: 3,
    totalReceivedUsd: 12430,
    lastInteraction: '2026-09-27 09:49 IST',
    evidencePoints: [
      'Deposit address cluster match (Sweeper hot wallet signature: 0x28C6c06298d514Db089934071355E5743bf21d60)',
      'Transaction behavior matching instant internal account credit sweep pattern',
      'Known attribution dataset match verified against public tagged exchange registers',
      'Destination address direct interaction via BEP-20 USDT token transfer'
    ],
    jurisdiction: 'Global / Seychelles / Authorized LE Liaison Channel'
  },
  {
    id: 'vasp-002',
    name: 'KuCoin',
    entityType: 'Centralized Exchange',
    blockchain: 'Ethereum',
    depositAddress: '0xKUCOIN_DEMO_INTERACTION_CLUSTER_9941',
    confidence: 68,
    attributionStatus: 'LIKELY ATTRIBUTION',
    source: 'Heuristic Hot Wallet Association Model (Demo Dataset)',
    distanceHops: 2,
    totalReceivedUsd: 4890,
    lastInteraction: '2026-09-26 23:58 IST',
    evidencePoints: [
      'Periodic batch aggregation behavior',
      'Gas station reimbursement pattern characteristic of exchange deposit wallets'
    ],
    jurisdiction: 'Seychelles'
  },
  {
    id: 'vasp-003',
    name: 'OKX',
    entityType: 'Centralized Exchange',
    blockchain: 'Polygon',
    depositAddress: '0xOKX_DEMO_DEPOSIT_RELAY_381920',
    confidence: 45,
    attributionStatus: 'POSSIBLE ATTRIBUTION',
    source: 'Automated Graph Clustering Heuristic (Demo Dataset)',
    distanceHops: 4,
    totalReceivedUsd: 2150,
    lastInteraction: '2026-09-25 14:10 IST',
    evidencePoints: [
      'Heuristic cluster proximity match to known OTC liquidation desk',
      'Requires law enforcement verification subpoena'
    ],
    jurisdiction: 'Malta / Global'
  }
];

export const demoIntermediaries: IntermediaryAnalysis[] = [
  {
    wallet: DEMO_INTERMEDIARY_A,
    receivedUsd: 18200,
    forwardedUsd: 17940,
    avgHoldingMinutes: 1.1,
    forwardingRatio: 98.6,
    riskIndicator: 'HIGH',
    patternLabel: 'Possible Layering Wallet - Rapid Pass-Through Relay',
    fanOutDegree: 2
  },
  {
    wallet: DEMO_INTERMEDIARY_B,
    receivedUsd: 17940,
    forwardedUsd: 17390,
    avgHoldingMinutes: 1.2,
    forwardingRatio: 96.9,
    riskIndicator: 'HIGH',
    patternLabel: 'Possible Layering Wallet - Bridge Feed Node',
    fanOutDegree: 1
  },
  {
    wallet: DEMO_BNB_INTERMEDIARY,
    receivedUsd: 12470,
    forwardedUsd: 12430,
    avgHoldingMinutes: 0.5,
    forwardingRatio: 99.7,
    riskIndicator: 'CRITICAL',
    patternLabel: 'Liquidation Feeder - Immediate Exchange Deposit Forwarder',
    fanOutDegree: 1
  }
];

export const demoCrossChainMovements: CrossChainMovement[] = [
  {
    id: 'cross-001',
    sourceChain: 'Ethereum',
    destinationChain: 'BNB Chain',
    bridge: 'Stargate / LayerZero Cross-Chain Protocol (Demo Simulation)',
    amount: 12500,
    asset: 'USDT',
    usdValue: 12500,
    timestamp: '2026-09-27 09:47:32 IST',
    sourceTxHash: '0x4481092cba918239019283019283019283019283019283019283019283019283',
    destTxHash: '0x6618491028301928301928301928301928301928301928301928301928301928',
    suspectAddress: DEMO_INTERMEDIARY_B,
    destinationAddress: DEMO_BNB_INTERMEDIARY
  }
];

export const demoAlerts: RealtimeAlert[] = [
  {
    id: 'alt-001',
    timestamp: '2026-09-27 09:49:15 IST',
    severity: 'CRITICAL',
    wallet: DEMO_SUSPECT_WALLET,
    transactionHash: '0x7791820491820491820491820491820491820491820491820491820491820491',
    reason: 'Suspect funds ($12,430 USDT) transferred downstream to identified Binance deposit cluster (3 hops).',
    action: 'Preserve exchange deposit transaction hash and submit formal VASP Section 91 CrPC / MLAT freeze inquiry.'
  },
  {
    id: 'alt-002',
    timestamp: '2026-09-27 09:47:35 IST',
    severity: 'HIGH',
    wallet: DEMO_INTERMEDIARY_B,
    transactionHash: '0x4481092cba918239019283019283019283019283019283019283019283019283',
    reason: 'Cross-chain bridge interaction detected: Ethereum to BNB Chain for $12,500 USDT.',
    action: 'Monitor relayer and index destination recipient address on BNB Chain.'
  },
  {
    id: 'alt-003',
    timestamp: '2026-09-27 09:46:55 IST',
    severity: 'HIGH',
    wallet: DEMO_SUSPECT_WALLET,
    transactionHash: '0x9920194810293810293810293810293810293810293810293810293810293810',
    reason: 'Potential mixer/obfuscation pool interaction indicator ($5,450 ETH).',
    action: 'Preserve block header timestamp and analyze liquidity pool deposit contracts.'
  },
  {
    id: 'alt-004',
    timestamp: '2026-09-27 09:45:15 IST',
    severity: 'MEDIUM',
    wallet: DEMO_INTERMEDIARY_A,
    transactionHash: '0x991824aa712894c1982b45109283749102837491028374910283749102837491',
    reason: 'Rapid fund movement: 98.6% of received funds moved downstream within 2 minutes.',
    action: 'Flag as possible layering wallet for multi-hop graph expansion.'
  }
];

export const demoEvidenceRecords: EvidenceRecord[] = [
  {
    id: 'ev-001',
    evidenceRecordId: 'EV-2026-00182',
    caseId: 'case-001',
    transactionHash: '0x7791820491820491820491820491820491820491820491820491820491820491',
    blockNumber: 38291048,
    blockTimestamp: '2026-09-27T04:19:12Z',
    walletAddress: DEMO_VASP_DEPOSIT,
    blockchain: 'BNB Chain',
    source: 'CryptoTrace Automated Analytics Indexer v2.4 (Simulated)',
    retrievedAt: '2026-09-27T04:21:00Z',
    dataHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    analysisVersion: 'v2.4.1-law-enforcement-edition',
    notes: 'Cryptographic snapshot of final exchange deposit transaction to VASP cluster.'
  },
  {
    id: 'ev-002',
    evidenceRecordId: 'EV-2026-00183',
    caseId: 'case-001',
    transactionHash: '0x8f2c31e9a4058d1973b091f0923e19842c198b1a80c942ba671b2d019f201aa1',
    blockNumber: 19842101,
    blockTimestamp: '2026-09-27T04:11:20Z',
    walletAddress: DEMO_SUSPECT_WALLET,
    blockchain: 'Ethereum',
    source: 'NCRP Complaint Intake & Ethereum RPC Provider',
    retrievedAt: '2026-09-27T04:15:00Z',
    dataHash: 'fa209384a8b7921cba9012fca120938481920381029381029381029381029381',
    analysisVersion: 'v2.4.1-law-enforcement-edition',
    notes: 'Primary victim transfer confirmation record matched to NCRP-2026-IN-98214.'
  }
];

export const demoAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-27 09:41 IST',
    officer: 'demo-investigator',
    action: 'Case Created',
    caseId: 'CYBER-2026-001',
    source: '127.0.0.1 (Web Console)',
    result: 'SUCCESS',
    details: 'Created case for complaint NCRP-2026-IN-98214 with suspect wallet 0xDEMO71...A92F'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-27 09:44 IST',
    officer: 'demo-investigator',
    action: 'Wallet Analysis Started',
    caseId: 'CYBER-2026-001',
    source: '127.0.0.1 (Web Console)',
    result: 'SUCCESS',
    details: 'Initiated 3-hop automated blockchain graph analysis for Ethereum chain'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-27 09:47 IST',
    officer: 'demo-investigator',
    action: 'Intermediary Wallets Identified',
    caseId: 'CYBER-2026-001',
    source: 'Forensics Graph Engine',
    result: 'SUCCESS',
    details: 'Detected 3 layering wallets with >96% forwarding ratio'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-27 09:49 IST',
    officer: 'demo-investigator',
    action: 'VASP Attribution Match',
    caseId: 'CYBER-2026-001',
    source: 'VASP Intelligence Adapter',
    result: 'SUCCESS',
    details: 'Identified Binance deposit cluster (92% confidence, 3 hops downstream)'
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-27 09:51 IST',
    officer: 'demo-investigator',
    action: 'Evidence Record Generated',
    caseId: 'CYBER-2026-001',
    source: 'Evidence Integrity Service',
    result: 'SUCCESS',
    details: 'Cryptographically hashed snapshot generated: EV-2026-00182'
  }
];

export const demoConnectors: ConnectorIntegration[] = [
  {
    id: 'conn-001',
    name: 'NCRP (National Cybercrime Reporting Portal)',
    shortCode: 'NCRP',
    status: 'DEMO CONNECTOR',
    lastSync: '2026-09-27 09:30 IST',
    apiVersion: 'v3.2-mock',
    recordsRetrieved: 142,
    description: 'Complaint ingestion endpoint mapping reported victim transaction hashes and suspect addresses.',
    authType: 'Mutual TLS / Mock Token',
    type: 'GOVERNMENT'
  },
  {
    id: 'conn-002',
    name: 'SAHYOG (Inter-Agency Coordination Framework)',
    shortCode: 'SAHYOG',
    status: 'DEMO CONNECTOR',
    lastSync: '2026-09-27 09:15 IST',
    apiVersion: 'v2.1-mock',
    recordsRetrieved: 39,
    description: 'Inter-agency cross-jurisdiction alert broadcasting and FIR synchronisation protocol.',
    authType: 'PKI Certificate / Simulated',
    type: 'GOVERNMENT'
  },
  {
    id: 'conn-003',
    name: 'VASP Intelligence Database',
    shortCode: 'VASP-INTEL',
    status: 'ACTIVE / DEMO',
    lastSync: '2026-09-27 09:50 IST',
    apiVersion: 'v4.0.1-seeded',
    recordsRetrieved: 4810,
    description: 'Exchange deposit address clustering, hot wallet tagging, and KYC liaison points of contact.',
    authType: 'Bearer Token (Demo Dataset)',
    type: 'INTELLIGENCE'
  },
  {
    id: 'conn-004',
    name: 'Multi-Chain Blockchain Explorer RPC',
    shortCode: 'CHAIN-RPC',
    status: 'ACTIVE / DEMO',
    lastSync: '2026-09-27 09:51 IST',
    apiVersion: 'JSON-RPC 2.0',
    recordsRetrieved: 12482,
    description: 'Direct blockchain node queries for Ethereum, Bitcoin, BNB Chain, and Polygon transactions.',
    authType: 'Infura / Alchemy / Mock Fallback',
    type: 'BLOCKCHAIN'
  },
  {
    id: 'conn-005',
    name: 'Evidence Preservation & Hash Seal Service',
    shortCode: 'EVIDENCE-SEAL',
    status: 'ACTIVE',
    lastSync: '2026-09-27 09:51 IST',
    apiVersion: 'SHA-256 Engine v1.0',
    recordsRetrieved: 84,
    description: 'Digital chain-of-custody cryptographic hashing for court-admissible digital evidence packages.',
    authType: 'Local SHA-256 Subsystem',
    type: 'FORENSIC'
  }
];
