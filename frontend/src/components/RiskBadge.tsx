import React from 'react';
import { RiskLevel } from '../types';
import { AlertTriangle, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<Props> = ({ level, score, size = 'md' }) => {
  const getStyle = () => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950/80 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]';
      case 'HIGH':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'MEDIUM':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'LOW':
      default:
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case 'HIGH':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'LOW':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${getStyle()} ${sizeClasses}`}>
      {getIcon()}
      <span>{level}</span>
      {score !== undefined && <span className="opacity-75">({score}/100)</span>}
    </span>
  );
};
