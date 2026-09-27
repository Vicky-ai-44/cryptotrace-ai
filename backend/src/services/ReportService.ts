import { Case, WalletIntelligence, VASPEntity, IntermediaryAnalysis, CrossChainMovement, RiskEvaluation, EvidenceRecord, Transaction } from '../types/index.js';

export interface FullInvestigationReport {
  id: string;
  reportReference: string;
  generatedAt: string;
  investigator: string;
  caseInformation: {
    caseId: string;
    complaintId: string;
    victimReference: string;
    fraudType: string;
    status: string;
    reportedDate: string;
  };
  walletInformation: WalletIntelligence;
  transactionSummary: {
    totalCount: number;
    totalReceivedUsd: number;
    totalSentUsd: number;
    residualBalance: number;
    counterparties: number;
  };
  fundFlowSummary: {
    totalHopsTraced: number;
    pathDescription: string;
    destinationReached: string;
  };
  intermediaryWallets: IntermediaryAnalysis[];
  crossChainActivity: CrossChainMovement[];
  vaspAttribution: VASPEntity | null;
  riskAnalysis: RiskEvaluation;
  investigativeRecommendations: string[];
  evidenceRecords: EvidenceRecord[];
  transactions: Transaction[];
  disclaimer: string;
}

export class ReportService {
  buildReport(
    caseItem: Case,
    walletIntel: WalletIntelligence,
    vasp: VASPEntity | null,
    intermediaries: IntermediaryAnalysis[],
    crossChain: CrossChainMovement[],
    risk: RiskEvaluation,
    recommendations: string[],
    evidence: EvidenceRecord[],
    transactions: Transaction[]
  ): FullInvestigationReport {
    return {
      id: `rep-${caseItem.id}-${Date.now()}`,
      reportReference: `CT-REP-2026-${caseItem.caseNumber.replace(/[^0-9]/g, '') || '001'}`,
      generatedAt: new Date().toISOString(),
      investigator: caseItem.investigatingOfficer || 'Cyber Crime Investigation Division',
      caseInformation: {
        caseId: caseItem.caseNumber,
        complaintId: caseItem.complaintId,
        victimReference: caseItem.victimReference,
        fraudType: caseItem.fraudType,
        status: caseItem.status,
        reportedDate: caseItem.reportedDate
      },
      walletInformation: walletIntel,
      transactionSummary: {
        totalCount: walletIntel.txCount,
        totalReceivedUsd: walletIntel.totalReceived,
        totalSentUsd: walletIntel.totalSent,
        residualBalance: walletIntel.balance,
        counterparties: walletIntel.counterpartiesCount
      },
      fundFlowSummary: {
        totalHopsTraced: vasp?.distanceHops || 3,
        pathDescription: `Victim Wallet -> Suspect Wallet [${walletIntel.address.slice(0, 8)}...] -> Intermediary Layering (2 Nodes) -> Cross-Chain Bridge -> VASP Deposit Address [${vasp?.depositAddress.slice(0, 10) || 'Unattributed'}...]`,
        destinationReached: vasp ? `${vasp.name} (${vasp.attributionStatus}, Confidence: ${vasp.confidence}%)` : 'Under multi-hop evaluation'
      },
      intermediaryWallets: intermediaries,
      crossChainActivity: crossChain,
      vaspAttribution: vasp,
      riskAnalysis: risk,
      investigativeRecommendations: recommendations,
      evidenceRecords: evidence,
      transactions: transactions.slice(0, 15),
      disclaimer: 'Automated blockchain analytics are investigative aids and should be independently verified by authorized investigators before enforcement or legal action. Attribution models are based on heuristic clustering datasets.'
    };
  }
}
