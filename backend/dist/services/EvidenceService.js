import crypto from 'crypto';
import { demoEvidenceRecords } from '../data/mockData.js';
export class EvidenceService {
    records = [...demoEvidenceRecords];
    createEvidenceRecord(payload) {
        const rawData = JSON.stringify({
            tx: payload.transactionHash,
            block: payload.blockNumber,
            time: payload.blockTimestamp,
            wallet: payload.walletAddress,
            chain: payload.blockchain,
            meta: payload.metadataToHash || {}
        });
        const sha256 = crypto.createHash('sha256').update(rawData).digest('hex');
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const newRecordId = `EV-2026-00${this.records.length + randomSuffix}`;
        const newRecord = {
            id: `ev-rec-${Date.now()}`,
            evidenceRecordId: newRecordId,
            caseId: payload.caseId || 'CYBER-2026-001',
            transactionHash: payload.transactionHash,
            blockNumber: payload.blockNumber,
            blockTimestamp: payload.blockTimestamp,
            walletAddress: payload.walletAddress,
            blockchain: payload.blockchain,
            source: payload.source || 'CryptoTrace AI Forensics Engine (Authorized Law Enforcement Snapshot)',
            retrievedAt: new Date().toISOString(),
            dataHash: sha256,
            analysisVersion: 'v2.4.1-law-enforcement-edition',
            notes: payload.notes || 'Forensic digital chain-of-custody snapshot captured by investigator.'
        };
        this.records.unshift(newRecord);
        return newRecord;
    }
    getRecords(caseId) {
        if (caseId) {
            return this.records.filter(r => r.caseId === caseId || r.caseId === 'case-001');
        }
        return this.records;
    }
    getRecordById(recordId) {
        return this.records.find(r => r.evidenceRecordId === recordId || r.id === recordId);
    }
}
