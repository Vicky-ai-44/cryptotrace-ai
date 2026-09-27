import crypto from 'crypto';
import { EvidenceRecord, BlockchainType } from '../types/index.js';
import { demoEvidenceRecords } from '../data/mockData.js';

export class EvidenceService {
  private records: EvidenceRecord[] = [...demoEvidenceRecords];

  createEvidenceRecord(payload: {
    caseId?: string;
    transactionHash: string;
    blockNumber: number;
    blockTimestamp: string;
    walletAddress: string;
    blockchain: BlockchainType;
    source: string;
    notes?: string;
    metadataToHash?: any;
  }): EvidenceRecord {
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

    const newRecord: EvidenceRecord = {
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

  getRecords(caseId?: string): EvidenceRecord[] {
    if (caseId) {
      return this.records.filter(r => r.caseId === caseId || r.caseId === 'case-001');
    }
    return this.records;
  }

  getRecordById(recordId: string): EvidenceRecord | undefined {
    return this.records.find(r => r.evidenceRecordId === recordId || r.id === recordId);
  }
}
