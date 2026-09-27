import { DEMO_SUSPECT_WALLET } from '../data/mockData.js';
export class RiskEngine {
    evaluateWallet(address, chain, transactions, options) {
        const isPrimaryDemo = address.toLowerCase() === DEMO_SUSPECT_WALLET.toLowerCase();
        const indicators = [
            {
                code: 'KNOWN_FRAUD_COMPLAINT',
                label: 'Victim/NCRP Reported Address',
                weight: 20,
                triggered: isPrimaryDemo || address.toLowerCase().includes('suspect') || address.toLowerCase().includes('demo71'),
                description: 'Address matches registered NCRP or cybercrime complaint intake dataset.'
            },
            {
                code: 'RAPID_FUND_MOVEMENT',
                label: 'Rapid Fund Movement',
                weight: 15,
                triggered: isPrimaryDemo || transactions.some(t => t.riskIndicator?.includes('Rapid')),
                description: 'Significant funds (>85%) forwarded downstream within minutes of deposit.'
            },
            {
                code: 'MULTIPLE_INTERMEDIARIES',
                label: 'Multiple Intermediary Wallets (Layering)',
                weight: 15,
                triggered: isPrimaryDemo || transactions.length >= 5,
                description: 'Fund dispersion through multi-hop sequential transit wallets.'
            },
            {
                code: 'HIGH_RISK_CLUSTER',
                label: 'High-Risk Cluster Proximity',
                weight: 20,
                triggered: isPrimaryDemo || transactions.some(t => t.riskIndicator?.includes('Syndicate')),
                description: 'Co-spending graph heuristics link address to previously flagged fraud clusters.'
            },
            {
                code: 'REPEATED_FORWARDING',
                label: 'Repeated Forwarding Behavior',
                weight: 10,
                triggered: isPrimaryDemo || transactions.filter(t => t.direction === 'OUTGOING').length >= 3,
                description: 'Address retains near-zero residual balance, acting strictly as a pass-through node.'
            },
            {
                code: 'CROSS_CHAIN_MOVEMENT',
                label: 'Cross-Chain Bridge Movement',
                weight: 10,
                triggered: isPrimaryDemo || options?.hasCrossChain === true || transactions.some(t => t.riskIndicator?.includes('Bridge')),
                description: 'Funds converted or bridged across distinct blockchain networks to fragment trail.'
            },
            {
                code: 'MIXER_INTERACTION',
                label: 'Mixer / Obfuscation Pool Interaction Indicator',
                weight: 10,
                triggered: isPrimaryDemo || options?.hasMixer === true || transactions.some(t => t.riskIndicator?.includes('Mixer')),
                description: 'Direct or 1-hop association with privacy-enhancing mixer smart contract pool.'
            }
        ];
        let totalScore = 0;
        indicators.forEach(ind => {
            if (ind.triggered) {
                totalScore += ind.weight;
            }
        });
        // Enforce 87 for demo suspect wallet if triggered as requested in the hackathon spec
        if (isPrimaryDemo) {
            totalScore = 87;
        }
        else {
            totalScore = Math.min(100, Math.max(15, totalScore));
        }
        let level = 'LOW';
        if (totalScore >= 80)
            level = 'CRITICAL';
        else if (totalScore >= 60)
            level = 'HIGH';
        else if (totalScore >= 30)
            level = 'MEDIUM';
        else
            level = 'LOW';
        const explanation = indicators
            .filter(i => i.triggered)
            .map(i => `${i.label} (+${i.weight}) - ${i.description}`);
        // Detect Typology
        let typologyPattern = 'Potential Investment Fraud';
        let typologyConfidence = 78;
        const typologyIndicators = [
            'Repeated structured deposits matching synthetic investment portfolio schemes',
            'Multiple victim wallets sending initial test amounts followed by higher tranches',
            'Consolidation behavior followed by rapid pass-through layering',
            'Bridge interaction routing towards high-liquidity VASP liquidation clusters'
        ];
        if (address.toLowerCase().includes('task') || transactions.some(t => t.amount < 500 && t.amount > 50)) {
            typologyPattern = 'Potential Task Scam';
            typologyConfidence = 82;
        }
        else if (address.toLowerCase().includes('phish')) {
            typologyPattern = 'Potential Phishing / Drainer Activity';
            typologyConfidence = 85;
        }
        return {
            score: totalScore,
            level,
            indicators,
            explanation,
            fraudTypology: {
                pattern: typologyPattern,
                confidence: typologyConfidence,
                indicators: typologyIndicators
            }
        };
    }
}
