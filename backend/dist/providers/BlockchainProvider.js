import { demoWalletsIntelligence, demoTransactions, DEMO_SUSPECT_WALLET } from '../data/mockData.js';
export class MockBlockchainProvider {
    validateAddress(address, chain) {
        if (!address || typeof address !== 'string')
            return false;
        const clean = address.trim();
        if (chain === 'Ethereum' || chain === 'BNB Chain' || chain === 'Polygon') {
            // Allow demo synthetic addresses or standard 0x hex
            return clean.startsWith('0x') && clean.length >= 10;
        }
        if (chain === 'Bitcoin') {
            return clean.startsWith('1') || clean.startsWith('3') || clean.startsWith('bc1') || clean.startsWith('bc1q') || clean.startsWith('demo_btc');
        }
        return clean.length >= 8;
    }
    async getBalance(address, chain) {
        const known = demoWalletsIntelligence[address];
        if (known) {
            return { balance: known.balance, asset: known.asset };
        }
        // Deterministic balance based on address char codes
        const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const balance = Number(((seed % 10000) / 100).toFixed(2));
        const asset = chain === 'Bitcoin' ? 'BTC' : (chain === 'Ethereum' ? 'ETH' : (chain === 'BNB Chain' ? 'BNB' : 'MATIC'));
        return { balance, asset };
    }
    async getTransactions(address, chain) {
        if (address === DEMO_SUSPECT_WALLET || address.toLowerCase() === DEMO_SUSPECT_WALLET.toLowerCase()) {
            return demoTransactions;
        }
        const matching = demoTransactions.filter(t => t.from.toLowerCase() === address.toLowerCase() || t.to.toLowerCase() === address.toLowerCase());
        if (matching.length > 0)
            return matching;
        // Generate realistic deterministic transactions for any searched wallet
        const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const count = (seed % 8) + 4;
        const txs = [];
        const baseBlock = 19840000 + (seed % 5000);
        for (let i = 0; i < count; i++) {
            const isIncoming = i % 2 === 0;
            const amount = Number(((seed * (i + 1) * 37) % 8500 + 450).toFixed(2));
            const hash = `0x${((seed * 9999 + i * 1337).toString(16)).padStart(64, 'a')}`;
            txs.push({
                id: `gen-tx-${i}-${seed}`,
                hash,
                timestamp: `2026-09-${20 + (i % 7)} ${10 + (i % 12)}:${15 + (i * 3) % 45}:00 IST`,
                direction: isIncoming ? 'INCOMING' : 'OUTGOING',
                from: isIncoming ? `0xCOUNTERPARTY_${(seed + i).toString(16).toUpperCase()}_GEN` : address,
                to: isIncoming ? address : `0xINTERMEDIARY_${(seed * 2 + i).toString(16).toUpperCase()}_GEN`,
                amount,
                asset: chain === 'Bitcoin' ? 'BTC' : 'USDT',
                usdValue: amount,
                status: 'CONFIRMED',
                riskIndicator: i === 0 ? 'Rapid pass-through forwarding' : (i === 1 ? 'High-velocity transaction' : undefined),
                blockNumber: baseBlock + i * 15,
                gasUsed: 42000
            });
        }
        return txs;
    }
    async getWalletIntelligence(address, chain) {
        if (demoWalletsIntelligence[address]) {
            return demoWalletsIntelligence[address];
        }
        const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const score = (seed % 65) + 25; // 25 - 90
        const riskLevel = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
        return {
            address,
            blockchain: chain,
            riskScore: score,
            riskLevel,
            firstSeen: '2026-09-22 10:14 IST',
            lastActivity: '2026-09-27 08:30 IST',
            balance: Number(((seed % 5000) / 10).toFixed(2)),
            asset: chain === 'Bitcoin' ? 'BTC' : 'USDT',
            totalReceived: Number(((seed * 23) % 50000 + 5000).toFixed(2)),
            totalSent: Number(((seed * 19) % 48000 + 4500).toFixed(2)),
            txCount: (seed % 40) + 12,
            counterpartiesCount: (seed % 18) + 5,
            isIntermediary: score > 65,
            isVaspAssociated: false,
            tag: score > 75 ? 'Potential Layering Wallet (Automated Heuristic)' : 'Monitored External Account'
        };
    }
    async getBlockDetails(blockNumber, chain) {
        return {
            blockNumber,
            chain,
            timestamp: new Date().toISOString(),
            miner: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
            transactionsCount: 184,
            gasLimit: 30000000
        };
    }
}
