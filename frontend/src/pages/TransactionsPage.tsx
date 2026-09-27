import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Layers, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Transaction } from '../types';

export const TransactionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTxs, setFilteredTxs] = useState<Transaction[]>([]);
  const [search, setSearch] = useState(searchParams.get('hash') || '');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await api.getWalletTransactions('0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F');
      setTransactions(data.transactions || []);
      setFilteredTxs(data.transactions || []);
      if (data.transactions && data.transactions.length > 0) {
        setSelectedTx(data.transactions[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let res = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(t => 
        t.hash.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q)
      );
    }
    if (directionFilter !== 'ALL') {
      res = res.filter(t => t.direction === directionFilter);
    }
    setFilteredTxs(res);
    setPage(1);
  }, [search, directionFilter, transactions]);

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paginatedTxs = filteredTxs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredTxs.length / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Transaction Telemetry & Explorer</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Decoded on-chain transactions, gas metrics, and transfer directionality
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/40">
          Total Indexed: {filteredTxs.length} Transactions
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Transaction Hash (0x...) or Address..."
            className="w-full bg-cyber-950 border border-cyber-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] text-slate-400 font-mono">Direction:</span>
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Directions</option>
            <option value="INCOMING">Incoming Funds (Inflow)</option>
            <option value="OUTGOING">Outgoing Forwarding (Outflow)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Table on Left + Details Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transaction Table */}
        <div className="lg:col-span-8 bg-cyber-900 border border-cyber-700/80 rounded-xl shadow-xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cyber-950 border-b border-cyber-750 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Tx Hash</th>
                  <th className="py-3 px-3">Direction</th>
                  <th className="py-3 px-3">From / To</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Risk Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-800 font-mono">
                {paginatedTxs.map((tx) => {
                  const isSelected = selectedTx?.id === tx.id;
                  const isIncoming = tx.direction === 'INCOMING';

                  return (
                    <tr 
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-950/70 border-l-2 border-cyan-400' : 'hover:bg-cyber-850/70'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-cyan-300">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isIncoming ? 'bg-blue-950 text-blue-300 border border-blue-500/40' : 'bg-orange-950 text-orange-300 border border-orange-500/40'
                        }`}>
                          {isIncoming ? <ArrowDownLeft className="w-3 h-3 text-blue-400" /> : <ArrowUpRight className="w-3 h-3 text-orange-400" />}
                          <span>{tx.direction}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <div className="text-[11px] truncate max-w-[130px]">
                          {isIncoming ? tx.from : tx.to}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        ${tx.usdValue.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{tx.asset}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {tx.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        {tx.riskIndicator ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-300 truncate block max-w-[150px]">
                            {tx.riskIndicator}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3 bg-cyber-950 border-t border-cyber-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Detail Panel (Section 12) */}
        <div className="lg:col-span-4 bg-cyber-900 border border-cyber-700/80 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Transaction Forensics Inspector
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
              CONFIRMED
            </span>
          </div>

          {selectedTx ? (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Transaction Hash</div>
                <div className="flex items-center justify-between bg-cyber-950 p-2 rounded border border-cyber-800 mt-1">
                  <span className="text-cyan-300 truncate text-[11px]">{selectedTx.hash}</span>
                  <button onClick={() => handleCopy(selectedTx.hash)} className="p-1 text-slate-400 hover:text-white shrink-0">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-cyber-950 p-2.5 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400">Block Number</div>
                  <div className="text-white font-bold mt-0.5">#{selectedTx.blockNumber}</div>
                </div>
                <div className="bg-cyber-950 p-2.5 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400">Gas Consumed</div>
                  <div className="text-slate-300 font-bold mt-0.5">{selectedTx.gasUsed?.toLocaleString() || '46,210'} units</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">From Sender</div>
                <div className="bg-cyber-950 p-2 rounded border border-cyber-800 mt-1 text-[11px] text-slate-300 truncate">
                  {selectedTx.from}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">To Recipient</div>
                <div className="bg-cyber-950 p-2 rounded border border-cyber-800 mt-1 text-[11px] text-slate-300 truncate">
                  {selectedTx.to}
                </div>
              </div>

              <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-800 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-slate-400">Settled Amount</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    ${selectedTx.usdValue.toLocaleString()} USD
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-cyber-800 text-slate-200 rounded">
                  {selectedTx.asset}
                </span>
              </div>

              {selectedTx.riskIndicator && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 space-y-1">
                  <div className="text-[10px] font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Suspicious Transaction Indicator</span>
                  </div>
                  <p className="text-[11px] font-sans leading-tight">{selectedTx.riskIndicator}</p>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`https://etherscan.io/tx/${selectedTx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Public Explorer Lookup (Simulated)</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              Select a transaction to inspect block metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
