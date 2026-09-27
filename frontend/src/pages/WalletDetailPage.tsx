import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const WalletDetailPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      navigate(`/analyze?wallet=${encodeURIComponent(address)}&autoload=true`, { replace: true });
    } else {
      navigate('/analyze', { replace: true });
    }
  }, [address, navigate]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono text-cyan-400">Loading Wallet Deep-Dive Forensics...</span>
      </div>
    </div>
  );
};
