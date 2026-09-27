import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
}

const STAGES = [
  'Validating wallet address format & checksum',
  'Identifying blockchain network & token standards',
  'Fetching transaction history & internal contract calls',
  'Building directional transaction graph & counterparty map',
  'Detecting intermediary transit & layering wallets',
  'Matching destination addresses against known VASP clusters',
  'Detecting suspicious behavior patterns & mixer heuristics',
  'Calculating explainable risk score & contributing indicators',
  'Generating intelligence summary & actionable recommendations'
];

export const AnalysisProgressModal: React.FC<Props> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStep + 1) / STAGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-cyber-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-cyber-700">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Automated Blockchain Analytics Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Stage {currentStep + 1} of {STAGES.length} • {progressPercent}% Complete
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-cyber-950 h-2.5 rounded-full overflow-hidden border border-cyber-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="mt-5 space-y-2 max-h-72 overflow-y-auto pr-1">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-lg text-xs font-mono transition-all ${
                  isCurrent 
                    ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-200' 
                    : (isDone ? 'text-slate-400 opacity-90' : 'text-slate-600')
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                )}
                <span className={isCurrent ? 'font-semibold' : ''}>{stage}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-cyber-800 text-[11px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Executing heuristics and cross-referencing known VASP clusters...</span>
        </div>
      </div>
    </div>
  );
};
