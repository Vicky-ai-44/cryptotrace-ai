import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Bell, 
  Activity, 
  UserCheck, 
  LogOut, 
  ChevronRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  link: string;
  badge: string;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(19842145);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll live block ticker every 6 seconds to simulate real-time blockchain monitoring
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getLiveSimulationTick();
        if (data?.blockNumber) {
          setCurrentBlock(data.blockNumber);
        }
      } catch (e) {
        // Fallback auto increment
        setCurrentBlock(prev => prev + 1);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.search(searchQuery.trim());
        setSearchResults(res.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (link: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('ct_auth_user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-cyber-900/90 backdrop-blur-md border-b border-cyber-700/60 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Quick Environment & Block Telemetry */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            <span>DEMO ENVIRONMENT</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-cyber-950/80 border border-cyber-700/60 text-slate-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">INDEXER:</span>
            <span className="text-cyan-300 font-semibold">BLOCK #{currentBlock.toLocaleString()}</span>
            <span className="text-xs px-1.5 py-0.2 bg-cyan-950 border border-cyan-500/40 text-cyan-400 rounded">LIVE</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              placeholder="Search suspect wallet (0x...), transaction hash, Case ID, Complaint ID..."
              className="w-full bg-cyber-950/90 border border-cyber-700/70 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-cyber-900 border border-cyber-600 rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-2 bg-cyber-950 border-b border-cyber-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Intelligence Search Matches</span>
                <span className="text-cyan-400">{searchResults.length} Results</span>
              </div>
              <div className="divide-y divide-cyber-800">
                {searchResults.map((res, i) => (
                  <button 
                    key={i}
                    onClick={() => handleResultClick(res.link)}
                    className="w-full text-left px-4 py-3 hover:bg-cyber-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-cyber-700/80 text-cyan-300 font-mono font-semibold">
                          {res.type}
                        </span>
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {res.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{res.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Action + Officer Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              navigate('/analyze?wallet=0xDEMO71A8F39C2A4B69E89D713894292B45A8A92F&chain=Ethereum&autoload=true');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-medium shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
            title="Load Hackathon Demo Case CYBER-2026-001"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>Load Demo Case</span>
          </button>

          <button 
            onClick={() => navigate('/alerts')}
            className="p-2 rounded-lg bg-cyber-800/60 border border-cyber-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors relative"
            title="Active Intelligence Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>

          <div className="h-6 w-px bg-cyber-700/60"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border border-cyan-400/40">
              RS
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200">Insp. Rahul Sharma</div>
              <div className="text-[10px] text-cyan-400 font-mono">Cyber Crime Analyst</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-cyber-800 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
