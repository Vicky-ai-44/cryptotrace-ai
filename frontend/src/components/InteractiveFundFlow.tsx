import React, { useState } from 'react';
import { FundFlowGraph, GraphNode } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldAlert, 
  Building2, 
  Layers, 
  Shuffle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface Props {
  graph: FundFlowGraph;
  onSelectAddress?: (address: string) => void;
}

export const InteractiveFundFlow: React.FC<Props> = ({ graph, onSelectAddress }) => {
  const [zoom, setZoom] = useState(1);
  const [highlightShortestPath, setHighlightShortestPath] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [copied, setCopied] = useState(false);

  // Layout node coordinates horizontally/hierarchically based on hops
  const nodePositions: Record<string, { x: number; y: number }> = {
    'node-victim': { x: 70, y: 220 },
    'node-suspect': { x: 250, y: 220 },
    'node-inter-a': { x: 440, y: 150 },
    'node-mixer': { x: 380, y: 340 },
    'node-inter-b': { x: 620, y: 150 },
    'node-bridge': { x: 800, y: 150 },
    'node-bnb-inter': { x: 970, y: 220 },
    'node-vasp-deposit': { x: 1140, y: 220 },
    'node-vasp': { x: 1320, y: 220 },
    // Fallback coordinates for dynamic arbitrary addresses
    'node-root-vic': { x: 100, y: 220 },
    'node-root-suspect': { x: 360, y: 220 },
    'node-root-inter1': { x: 640, y: 220 },
    'node-root-vasp': { x: 940, y: 220 }
  };

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'Victim':
        return {
          bg: 'fill-blue-950/90',
          stroke: 'stroke-blue-500',
          text: 'text-blue-300',
          border: 'border-blue-500/50',
          glow: 'rgba(59, 130, 246, 0.4)'
        };
      case 'Suspect Wallet':
        return {
          bg: 'fill-red-950/90',
          stroke: 'stroke-red-500',
          text: 'text-red-300',
          border: 'border-red-500/50',
          glow: 'rgba(239, 68, 68, 0.6)'
        };
      case 'Intermediary':
        return {
          bg: 'fill-amber-950/90',
          stroke: 'stroke-amber-500',
          text: 'text-amber-300',
          border: 'border-amber-500/50',
          glow: 'rgba(245, 158, 11, 0.4)'
        };
      case 'Bridge':
        return {
          bg: 'fill-purple-950/90',
          stroke: 'stroke-purple-500',
          text: 'text-purple-300',
          border: 'border-purple-500/50',
          glow: 'rgba(168, 85, 247, 0.5)'
        };
      case 'Mixer Indicator':
        return {
          bg: 'fill-fuchsia-950/90',
          stroke: 'stroke-fuchsia-500',
          text: 'text-fuchsia-300',
          border: 'border-fuchsia-500/50',
          glow: 'rgba(217, 70, 239, 0.5)'
        };
      case 'Exchange':
      case 'VASP':
        return {
          bg: 'fill-emerald-950/90',
          stroke: 'stroke-emerald-400',
          text: 'text-emerald-300',
          border: 'border-emerald-400/50',
          glow: 'rgba(16, 185, 129, 0.5)'
        };
      default:
        return {
          bg: 'fill-slate-900',
          stroke: 'stroke-slate-600',
          text: 'text-slate-300',
          border: 'border-slate-600',
          glow: 'rgba(148, 163, 184, 0.3)'
        };
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEdgeInShortestPath = (source: string, target: string) => {
    if (!highlightShortestPath || !graph.shortestPathToVASP) return false;
    const path = graph.shortestPathToVASP;
    const srcIndex = path.indexOf(source);
    const tgtIndex = path.indexOf(target);
    return srcIndex !== -1 && tgtIndex !== -1 && tgtIndex === srcIndex + 1;
  };

  return (
    <div className="relative w-full bg-cyber-950 border border-cyber-700/80 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
      {/* Top Toolbar */}
      <div className="p-3 bg-cyber-900/90 border-b border-cyber-700/60 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>FUND FLOW FORENSICS GRAPH</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {graph.nodes.length} Nodes | {graph.edges.length} Transactions Traced
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighlightShortestPath(!highlightShortestPath)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              highlightShortestPath
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-cyber-850 border-cyber-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shortest Path to Known VASP</span>
          </button>

          <div className="h-5 w-px bg-cyber-700 mx-1"></div>

          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
            className="p-1.5 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-1.5 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-auto cursor-grab active:cursor-grabbing bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '1450px', height: '100%' }}
          className="transition-transform duration-150 p-6"
        >
          <svg className="w-[1450px] h-[480px]">
            <defs>
              <linearGradient id="edge-grad-active" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
              </marker>
              <marker id="arrow-default" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Edges */}
            {graph.edges.map((edge) => {
              const src = nodePositions[edge.source] || { x: 100, y: 100 };
              const tgt = nodePositions[edge.target] || { x: 300, y: 300 };
              const inPath = isEdgeInShortestPath(edge.source, edge.target);

              // Quadratic curve path
              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2 - (src.y !== tgt.y ? 0 : 25);
              const pathD = `M ${src.x} ${src.y} Q ${midX} ${midY} ${tgt.x} ${tgt.y}`;

              return (
                <g key={edge.id} className="transition-all">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={inPath ? 'url(#edge-grad-active)' : '#334155'}
                    strokeWidth={inPath ? 3 : 1.5}
                    strokeDasharray={inPath ? '6 4' : undefined}
                    className={inPath ? 'animate-pulse' : ''}
                    markerEnd={inPath ? 'url(#arrow)' : 'url(#arrow-default)'}
                    filter={inPath ? 'url(#glow)' : undefined}
                  />
                  {/* Edge label pill */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-48"
                      y="-12"
                      width="96"
                      height="22"
                      rx="11"
                      className={`${inPath ? 'fill-cyan-950 stroke-cyan-400' : 'fill-cyber-900 stroke-cyber-700'}`}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold ${inPath ? 'fill-cyan-300' : 'fill-slate-400'}`}
                    >
                      ${edge.usdValue.toLocaleString()}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Render Nodes */}
            {graph.nodes.map((node) => {
              const pos = nodePositions[node.id] || { x: 200, y: 200 };
              const color = getNodeColor(node.type);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Aura for Target/VASP */}
                  {(node.type === 'Suspect Wallet' || node.type === 'VASP') && (
                    <circle
                      r="40"
                      fill="none"
                      stroke={node.type === 'Suspect Wallet' ? '#ef4444' : '#10b981'}
                      strokeWidth="1.5"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    r="28"
                    className={`${color.bg} ${color.stroke} transition-all duration-200 group-hover:scale-110`}
                    strokeWidth={isSelected ? 3.5 : 2}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Node icon / initials */}
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-white font-mono pointer-events-none"
                  >
                    {node.type === 'Victim' && 'VIC'}
                    {node.type === 'Suspect Wallet' && 'SUS'}
                    {node.type === 'Intermediary' && 'INT'}
                    {node.type === 'Bridge' && 'BRG'}
                    {node.type === 'Mixer Indicator' && 'MIX'}
                    {node.type === 'Exchange' && 'DEP'}
                    {node.type === 'VASP' && 'VASP'}
                  </text>

                  {/* Node Label Below */}
                  <text
                    x="0"
                    y="42"
                    textAnchor="middle"
                    className={`text-xs font-semibold ${isSelected ? 'fill-cyan-300' : 'fill-slate-200'} pointer-events-none`}
                  >
                    {node.label}
                  </text>

                  {/* Address Snippet */}
                  <text
                    x="0"
                    y="55"
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-mono pointer-events-none"
                  >
                    {node.address.slice(0, 6)}...{node.address.slice(-4)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Intelligence Flyout */}
        {selectedNode && (
          <div className="absolute right-4 top-4 w-80 bg-cyber-900/95 border border-cyan-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-md z-20 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Node Telemetry
                </span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-cyber-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Entity / Label</div>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  {selectedNode.label}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-800 text-cyan-300 font-mono border border-cyber-700">
                    {selectedNode.type}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Address</div>
                <div className="flex items-center gap-2 mt-0.5 bg-cyber-950 p-1.5 rounded border border-cyber-800">
                  <span className="text-xs font-mono text-cyan-300 truncate">
                    {selectedNode.address}
                  </span>
                  <button 
                    onClick={() => handleCopy(selectedNode.address)}
                    className="p-1 hover:text-cyan-400 text-slate-400 shrink-0"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-cyber-950/80 p-2 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400 font-mono">Blockchain</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">{selectedNode.blockchain}</div>
                </div>
                <div className="bg-cyber-950/80 p-2 rounded border border-cyber-800">
                  <div className="text-[10px] text-slate-400 font-mono">Balance</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5 font-mono">
                    ${selectedNode.balanceUsd ? selectedNode.balanceUsd.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>

              {selectedNode.riskLevel && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">Risk Assessment:</span>
                  <RiskBadge level={selectedNode.riskLevel} />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onSelectAddress && onSelectAddress(selectedNode.address)}
                  className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                >
                  <span>Analyze Wallet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Legend */}
      <div className="px-4 py-2 bg-cyber-900/90 border-t border-cyber-700/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-300">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Victim
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Suspect Wallet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Intermediary (Layering)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span> Cross-Chain Bridge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> VASP / Exchange
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-fuchsia-500"></span> Mixer Indicator
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any node to inspect digital forensics telemetry</span>
        </div>
      </div>
    </div>
  );
};
