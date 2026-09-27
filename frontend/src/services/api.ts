const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port !== '5173' ? '/api' : 'http://localhost:5000/api');

async function fetchJson(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[API Warning: ${endpoint}]`, error);
    throw error;
  }
}

export const api = {
  login: (data: { officerId: string; password?: string }) => 
    fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getDashboardStats: () => 
    fetchJson('/dashboard/stats'),

  getCases: (params?: { search?: string; risk?: string; blockchain?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson(`/cases?${query}`);
  },

  getCaseById: (id: string) => 
    fetchJson(`/cases/${id}`),

  createCase: (data: any) => 
    fetchJson('/cases', { method: 'POST', body: JSON.stringify(data) }),

  analyzeWallet: (data: { walletAddress: string; blockchain: string; hops?: number; timeRange?: string }) => 
    fetchJson('/analyze', { method: 'POST', body: JSON.stringify(data) }),

  getWalletTransactions: (address: string) => 
    fetchJson(`/wallet/${address}/transactions`),

  getWalletGraph: (address: string) => 
    fetchJson(`/wallet/${address}/graph`),

  getWalletRisk: (address: string) => 
    fetchJson(`/wallet/${address}/risk`),

  getWalletVASP: (address: string) => 
    fetchJson(`/wallet/${address}/vasp`),

  getWalletAlerts: (address: string) => 
    fetchJson(`/wallet/${address}/alerts`),

  getCaseReport: (caseId: string) => 
    fetchJson(`/cases/${caseId}/report`),

  createEvidence: (data: any) => 
    fetchJson('/evidence', { method: 'POST', body: JSON.stringify(data) }),

  getEvidence: (caseId?: string) => 
    fetchJson(`/evidence${caseId ? `?caseId=${caseId}` : ''}`),

  getIntegrations: () => 
    fetchJson('/integrations'),

  getAuditLogs: () => 
    fetchJson('/audit-log'),

  createAuditLog: (data: any) => 
    fetchJson('/audit-log', { method: 'POST', body: JSON.stringify(data) }),

  search: (q: string) => 
    fetchJson(`/search?q=${encodeURIComponent(q)}`),

  getLiveSimulationTick: () => 
    fetchJson('/live/stream')
};
