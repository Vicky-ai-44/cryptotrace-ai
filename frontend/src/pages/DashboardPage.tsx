import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Activity, 
  ShieldAlert, 
  Building2, 
  IndianRupee, 
  Layers, 
  Zap, 
  ArrowRight, 
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveStreamEvents, setLiveStreamEvents] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
    // Simulate real-time live events feed every 4 seconds
    const interval = setInterval(async () => {
      try {
        const tick = await api.getLiveSimulationTick();
        if (tick?.liveEvent) {
          setLiveStreamEvents(prev => [tick.liveEvent, ...prev.slice(0, 5)]);
        }
      } catch (err) {
        // Fallback simulation
        const fake = {
          hash: `0xsim${Math.random().toString(16).slice(2, 10)}...`,
          block: 19842145 + Math.floor(Math.random() * 20),
          timestamp: new Date().toLocaleTimeString() + ' IST',
          amount: Math.floor(800 + Math.random() * 3200),
          asset: 'USDT',
          action: 'Mempool Transaction Indexed & Scored'
        };
        setLiveStreamEvents(prev => [fake, ...prev.slice(0, 5)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      // Deterministic fallback
      setStats({
        totalCases: 128,
        activeInvestigations: 23,
        highRiskWallets: 47,
        vaspAttributions: 31,
        fundsTracedInr: '₹1.84 Cr',
        fundsTracedUsd: '$221,480',
        transactionsAnalyzed: 12482,
        recentInvestigations: [
          {
            caseId: 'CYBER-2026-001',
            wallet: '0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F',
            blockchain: 'Ethereum',
            risk: 'CRITICAL',
            nearestVasp: 'Binance',
            amount: '$42,850',
            status: 'Active',
            lastAnalyzed: '2026-09-27 09:50 IST'
          },
          {
            caseId: 'CASE-2026-002',
            wallet: '0x3892FcA9821b99a8eD124489aAc120019A821102',
            blockchain: 'BNB Chain',
            risk: 'HIGH',
            nearestVasp: 'WazirX (Demo)',
            amount: '$14,820',
            status: 'Under Review',
            lastAnalyzed: '2026-09-27 08:15 IST'
          },
          {
            caseId: 'CASE-2026-003',
            wallet: '0x8849cba912a7741d990098fca201948811d04491',
            blockchain: 'Ethereum',
            risk: 'HIGH',
            nearestVasp: 'KuCoin',
            amount: '$31,200',
            status: 'Escalated',
            lastAnalyzed: '2026-09-26 21:00 IST'
          }
        ],
        typologyDistribution: [
          { name: 'Investment Fraud', count: 54, value: 42 },
          { name: 'Task Scam', count: 32, value: 25 },
          { name: 'Phishing', count: 21, value: 16 },
          { name: 'Ransomware', count: 12, value: 10 },
          { name: 'Sextortion', count: 9, value: 7 }
        ],
        chainDistribution: [
          { name: 'Ethereum', value: 48, fill: '#627EEA' },
          { name: 'BNB Chain', value: 28, fill: '#F3BA2F' },
          { name: 'Bitcoin', value: 16, fill: '#F7931A' },
          { name: 'Polygon', value: 8, fill: '#8247E5' }
        ],
        volumeOverTime: [
          { date: 'Sep 21', volume: 18400, cases: 4 },
          { date: 'Sep 22', volume: 24200, cases: 7 },
          { date: 'Sep 23', volume: 19800, cases: 5 },
          { date: 'Sep 24', volume: 38900, cases: 9 },
          { date: 'Sep 25', volume: 46300, cases: 12 },
          { date: 'Sep 26', volume: 32100, cases: 8 },
          { date: 'Sep 27', volume: 42850, cases: 14 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = () => {
    navigate('/analyze?wallet=0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F&chain=Ethereum&autoload=true');
  };

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-cyan-400">Loading Forensics Dashboard...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'TOTAL CASES', value: stats.totalCases, sub: 'Registered Complaints', icon: FolderKanban, color: 'text-blue-400' },
    { label: 'ACTIVE INVESTIGATIONS', value: stats.activeInvestigations, sub: 'Real-Time Monitoring', icon: Activity, color: 'text-cyan-400' },
    { label: 'HIGH-RISK WALLETS', value: stats.highRiskWallets, sub: 'Risk Score > 60', icon: ShieldAlert, color: 'text-red-400' },
    { label: 'VASP ATTRIBUTIONS', value: stats.vaspAttributions, sub: 'Identified Exchanges', icon: Building2, color: 'text-emerald-400' },
    { label: 'FUNDS TRACED', value: stats.fundsTracedInr, sub: `${stats.fundsTracedUsd} Equivalent`, icon: IndianRupee, color: 'text-amber-400' },
    { label: 'TRANSACTIONS ANALYZED', value: stats.transactionsAnalyzed.toLocaleString(), sub: 'Multi-Chain Indexer', icon: Layers, color: 'text-indigo-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: One-Click Demo Investigation Trigger */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-cyber-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hackathon 5-Minute Evaluation Pitch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Case CYBER-2026-001: Investment Fraud Syndicate
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
            Instantly load the seeded end-to-end investigation: victim wire deposit → suspect wallet → multi-hop layering relays → cross-chain bridge → Binance VASP deposit cluster attribution.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Load Demo Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-4 shadow-md hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {card.value}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funds Traced Volume Over Time */}
        <div className="lg:col-span-8 bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Suspect Fund Inflow & Volume Traced (USD)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Daily volume aggregate across monitored high-risk addresses</p>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
              7-Day Window
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.volumeOverTime}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={val => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blockchain Share Pie */}
        <div className="lg:col-span-4 bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Network Distribution
            </h3>
            <p className="text-xs text-slate-400 font-mono">Monitored chains by transaction share</p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.chainDistribution} 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {stats.chainDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyber-800 text-xs font-mono">
            {stats.chainDistribution.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                <span className="text-slate-300">{item.name}</span>
                <span className="text-slate-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Grid: Recent Investigations & Live Real-Time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Investigations Table */}
        <div className="lg:col-span-8 bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Case Investigations
              </h3>
              <p className="text-xs text-slate-400 font-mono">Active complaints under automated mempool tracking</p>
            </div>
            <button
              onClick={() => navigate('/cases')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All 128 Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyber-750 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Suspect Wallet</th>
                  <th className="py-2.5 px-3">Blockchain</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Nearest VASP</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-800 font-mono">
                {stats.recentInvestigations.map((inv: any, i: number) => (
                  <tr key={i} className="hover:bg-cyber-850/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-cyan-300">{inv.caseId}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {inv.wallet.slice(0, 6)}...{inv.wallet.slice(-4)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{inv.blockchain}</td>
                    <td className="py-3 px-3">
                      <RiskBadge level={inv.risk} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                        {inv.nearestVasp}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white font-semibold">{inv.amount}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-800 text-slate-300">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/analyze?wallet=${encodeURIComponent(inv.wallet)}&chain=${inv.blockchain}&autoload=true`)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Live Monitoring Feed (Section 32) */}
        <div className="lg:col-span-4 bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Mempool Stream
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                SIMULATION
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-2 mb-3">
              Automated indexer continuously screening transactions against known VASP clusters:
            </p>

            <div className="space-y-2.5">
              {liveStreamEvents.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-slate-500">
                  Listening for blockchain transactions...
                </div>
              ) : (
                liveStreamEvents.map((ev, i) => (
                  <div key={i} className="p-2.5 bg-cyber-950/80 border border-cyber-800 rounded-lg text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-cyan-400">Block #{ev.block}</span>
                      <span>{ev.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-300 truncate max-w-[140px]">{ev.hash}</span>
                      <span className="text-emerald-400 font-semibold">+${ev.amount} {ev.asset}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{ev.action}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyber-800 text-[11px] text-slate-400 font-mono text-center">
            Streaming via simulated multi-chain WebSocket provider
          </div>
        </div>
      </div>
    </div>
  );
};
