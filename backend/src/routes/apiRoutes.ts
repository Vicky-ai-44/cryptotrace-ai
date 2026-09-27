import { Router } from 'express';
import {
  loginHandler,
  getDashboardStats,
  getCases,
  getCaseById,
  createCase,
  analyzeWallet,
  getWalletTransactions,
  getWalletGraph,
  getWalletRisk,
  getWalletVASP,
  getWalletAlerts,
  getCaseReport,
  createEvidence,
  getEvidenceList,
  getIntegrations,
  getAuditLogs,
  createAuditLog,
  searchGlobal,
  getLiveSimulationTick
} from '../controllers/apiController.js';

const router = Router();

// Authentication
router.post('/auth/login', loginHandler);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Case management
router.get('/cases', getCases);
router.post('/cases', createCase);
router.get('/cases/:id', getCaseById);
router.get('/cases/:id/report', getCaseReport);

// Core Analysis
router.post('/analyze', analyzeWallet);

// Wallet intelligence sub-resources
router.get('/wallet/:address/transactions', getWalletTransactions);
router.get('/wallet/:address/graph', getWalletGraph);
router.get('/wallet/:address/risk', getWalletRisk);
router.get('/wallet/:address/vasp', getWalletVASP);
router.get('/wallet/:address/alerts', getWalletAlerts);

// Digital Evidence Preservation
router.get('/evidence', getEvidenceList);
router.post('/evidence', createEvidence);

// Connectors & Integrations
router.get('/integrations', getIntegrations);

// Audit Logging
router.get('/audit-log', getAuditLogs);
router.post('/audit-log', createAuditLog);

// Global search & Live stream
router.get('/search', searchGlobal);
router.get('/live/stream', getLiveSimulationTick);

export default router;
