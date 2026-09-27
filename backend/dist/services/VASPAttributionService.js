import { demoVaspAttributions, DEMO_SUSPECT_WALLET, DEMO_VASP_DEPOSIT } from '../data/mockData.js';
export class VASPAttributionService {
    attributions = [...demoVaspAttributions];
    getAttributionsForWallet(address, chain) {
        const isPrimary = address.toLowerCase() === DEMO_SUSPECT_WALLET.toLowerCase() ||
            address.toLowerCase() === DEMO_VASP_DEPOSIT.toLowerCase();
        if (isPrimary) {
            return this.attributions;
        }
        // Check if directly matches any registered VASP address
        const exact = this.attributions.filter(v => v.depositAddress.toLowerCase() === address.toLowerCase());
        if (exact.length > 0)
            return exact;
        // Synthetic attribution for arbitrary address search
        const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const hasAttribution = (seed % 3) !== 0;
        if (!hasAttribution) {
            return [{
                    id: `vasp-unk-${seed}`,
                    name: 'Unattributed Cluster',
                    entityType: 'VASP',
                    blockchain: chain,
                    depositAddress: address,
                    confidence: 12,
                    attributionStatus: 'UNKNOWN',
                    source: 'Automated Heuristics (No direct cluster match)',
                    distanceHops: 0,
                    totalReceivedUsd: 0,
                    lastInteraction: 'N/A',
                    evidencePoints: ['No matching exchange deposit sweep pattern found in local attribution dataset.'],
                }];
        }
        const exchanges = [
            { name: 'Binance', type: 'Centralized Exchange', conf: 88, status: 'LIKELY ATTRIBUTION' },
            { name: 'Coinbase', type: 'Centralized Exchange', conf: 76, status: 'LIKELY ATTRIBUTION' },
            { name: 'WazirX (Demo)', type: 'Centralized Exchange', conf: 91, status: 'CONFIRMED ATTRIBUTION' },
            { name: 'Kraken', type: 'Centralized Exchange', conf: 52, status: 'POSSIBLE ATTRIBUTION' }
        ];
        const chosen = exchanges[seed % exchanges.length];
        return [{
                id: `vasp-gen-${seed}`,
                name: chosen.name,
                entityType: chosen.type,
                blockchain: chain,
                depositAddress: `0xEXCHANGE_CLUSTER_${(seed * 47).toString(16).toUpperCase()}`,
                confidence: chosen.conf,
                attributionStatus: chosen.status,
                source: 'Heuristic Hot Wallet Cluster DB (Demo Attribution Dataset)',
                distanceHops: (seed % 3) + 2,
                totalReceivedUsd: Number(((seed * 11) % 15000 + 1200).toFixed(2)),
                lastInteraction: '2026-09-27 07:15 IST',
                evidencePoints: [
                    'Deposit consolidation hot wallet sweep pattern match',
                    'Transaction gas telemetry matches exchange batch-sweeper agent'
                ],
                jurisdiction: 'Authorized LE Liaison Channel'
            }];
    }
    getNearestVASP(address, chain) {
        const list = this.getAttributionsForWallet(address, chain);
        if (!list.length)
            return null;
        // Return highest confidence or shortest hops
        return list.slice().sort((a, b) => (a.distanceHops - b.distanceHops) || (b.confidence - a.confidence))[0];
    }
}
