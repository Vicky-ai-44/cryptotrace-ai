import { VASPEntity, WalletIntelligence, Case } from '../types/index.js';

export class AIAnalysisService {
  generateInvestigationSummary(
    walletIntel: WalletIntelligence, 
    vasp: VASPEntity | null, 
    caseInfo?: Case
  ): string {
    const vaspName = vasp ? vasp.name : 'Unknown VASP';
    const conf = vasp ? `${vasp.confidence}% (${vasp.attributionStatus})` : 'Pending Attribution';
    const hops = vasp ? `${vasp.distanceHops} hops` : 'Multi-hop';

    return `Investigative Analysis Summary:
Suspect wallet ${walletIntel.address} on ${walletIntel.blockchain} exhibits structured fund disposition behavior indicative of organized syndicate layering. 
A total inflow of $${walletIntel.totalReceived.toLocaleString()} was followed by rapid downstream egress across intermediary forwarding nodes. 
Automated cluster attribution detected an outflow endpoint linked to ${vaspName} with an attribution confidence of ${conf} situated ${hops} downstream. 
Risk score is evaluated at ${walletIntel.riskScore}/100 (${walletIntel.riskLevel}). Immediate formal KYC preservation request to VASP compliance liaison is advised under applicable legal mandates.`;
  }

  generateRecommendations(
    riskScore: number, 
    vasp: VASPEntity | null, 
    hasCrossChain: boolean = true, 
    hasIntermediaries: boolean = true
  ): string[] {
    const recs: string[] = [
      'Preserve transaction hash and block metadata immediately using the Evidence Preservation Service.',
      'Review intermediary wallet relationships and flag identified layering addresses for continuous mempool tracking.'
    ];

    if (vasp && vasp.attributionStatus !== 'UNKNOWN') {
      recs.push(`Review identified VASP interaction for deposit address ${vasp.depositAddress} (${vasp.name}).`);
      recs.push(`Consider authorized Section 91 CrPC / MLAT request to ${vasp.name} compliance liaison for KYC records, account holder identity, and IP access logs.`);
    }

    if (hasCrossChain) {
      recs.push('Analyze cross-chain bridge escrow transactions to identify receiving addresses on destination chain.');
    }

    if (hasIntermediaries) {
      recs.push('Continue multi-hop tracing downstream to identify potential secondary cash-out points and P2P merchant accounts.');
    }

    recs.push('Correlate suspect wallet timestamps with NCRP complaint bank account transaction logs to map fiat on-ramp channels.');
    recs.push('Maintain strict digital chain of custody for all exported forensic artifacts.');

    return recs;
  }
}
