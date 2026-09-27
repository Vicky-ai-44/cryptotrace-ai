import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { WalletAnalysisPage } from './pages/WalletAnalysisPage';
import { WalletDetailPage } from './pages/WalletDetailPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { FundFlowPage } from './pages/FundFlowPage';
import { VASPPage } from './pages/VASPPage';
import { AlertsPage } from './pages/AlertsPage';
import { EvidencePage } from './pages/EvidencePage';
import { ReportsPage } from './pages/ReportsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="cases/:id" element={<CaseDetailPage />} />
          <Route path="analyze" element={<WalletAnalysisPage />} />
          <Route path="wallet/:address" element={<WalletDetailPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="graph" element={<FundFlowPage />} />
          <Route path="vasp" element={<VASPPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
