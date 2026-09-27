import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const ReportsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') || 'case-001';
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [caseId]);

  const loadReport = async () => {
    try {
      const data = await api.getCaseReport(caseId);
      setReport(data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const exportReportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.reportReference}_investigation_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportReportCsv = () => {
    if (!report) return;
    const rows = [
      ['Report Reference', report.reportReference],
      ['Case ID', report.caseInformation.caseId],
      ['Complaint ID', report.caseInformation.complaintId],
      ['Fraud Typology', report.caseInformation.fraudType],
      ['Suspect Wallet', report.walletInformation.address],
      ['Blockchain', report.walletInformation.blockchain],
      ['Risk Score', `${report.riskAnalysis.score}/100 (${report.riskAnalysis.level})`],
      ['Nearest VASP', report.vaspAttribution?.name || 'N/A'],
      ['VASP Confidence', `${report.vaspAttribution?.confidence}%`],
      ['Total Received USD', report.transactionSummary.totalReceivedUsd],
      ['Total Forwarded USD', report.transactionSummary.totalSentUsd]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.reportReference}_summary.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print bg-cyber-900 border border-cyber-700/80 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Digital Forensics Investigation Dossier</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ref: {report.reportReference} • Case: {report.caseInformation.caseId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportReportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportReportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyber-850 hover:bg-cyber-800 border border-cyber-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs shadow-md shadow-cyan-950 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (Styled for screen & print) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-8 report-page border border-slate-300">
        {/* Document Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest font-mono text-slate-500 font-bold">
              Law Enforcement Digital Forensics Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              BLOCKCHAIN INTELLIGENCE DOSSIER
            </h1>
            <p className="text-sm font-mono text-slate-600 mt-1">
              CryptoTrace AI Automated Forensic Analytics Platform • Law Enforcement Edition
            </p>
          </div>
          <div className="text-right font-mono text-xs text-slate-600 space-y-1">
            <div>Dossier No: <strong className="text-slate-900">{report.reportReference}</strong></div>
            <div>Generated: {new Date(report.generatedAt).toLocaleString()}</div>
            <div className="text-emerald-700 font-bold">● DIGITALLY SEALED</div>
          </div>
        </div>

        {/* 1. Case Information */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
            <span>1. Case Intake Information</span>
            <span className="text-xs font-normal text-slate-500">{report.caseInformation.status}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="text-slate-500">Case Identifier:</div>
              <div className="font-bold text-slate-900">{report.caseInformation.caseId}</div>
            </div>
            <div>
              <div className="text-slate-500">NCRP Complaint ID:</div>
              <div className="font-bold text-slate-900">{report.caseInformation.complaintId}</div>
            </div>
            <div>
              <div className="text-slate-500">Victim Reference:</div>
              <div className="font-bold text-slate-900">{report.caseInformation.victimReference}</div>
            </div>
            <div>
              <div className="text-slate-500">Fraud Typology:</div>
              <div className="font-bold text-slate-900">{report.caseInformation.fraudType}</div>
            </div>
            <div>
              <div className="text-slate-500">Investigating Officer:</div>
              <div className="font-bold text-slate-900">{report.investigator}</div>
            </div>
            <div>
              <div className="text-slate-500">Reported Date:</div>
              <div className="font-bold text-slate-900">{report.caseInformation.reportedDate}</div>
            </div>
          </div>
        </section>

        {/* 2. Wallet & Transaction Summary */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-1">
            2. Suspect Wallet Telemetry & Balance
          </h2>
          <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs space-y-1">
            <div>Address: <strong className="text-slate-900">{report.walletInformation.address}</strong></div>
            <div className="flex gap-6 text-slate-600">
              <span>Blockchain: <strong>{report.walletInformation.blockchain}</strong></span>
              <span>First Seen: <strong>{report.walletInformation.firstSeen}</strong></span>
              <span>Last Activity: <strong>{report.walletInformation.lastActivity}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase">Total Received Inflow</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${report.transactionSummary.totalReceivedUsd.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase">Total Forwarded Outflow</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${report.transactionSummary.totalSentUsd.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase">Residual Balance</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${report.transactionSummary.residualBalance.toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Fund Flow & Intermediaries */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-1">
            3. Fund Flow Traversal & Detected Intermediary Wallets
          </h2>
          <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
            <strong>Traced Traversal:</strong> {report.fundFlowSummary.pathDescription}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2 border">Intermediary Wallet</th>
                  <th className="p-2 border">Received USD</th>
                  <th className="p-2 border">Forwarded USD</th>
                  <th className="p-2 border">Avg Holding Time</th>
                  <th className="p-2 border">Forwarding Ratio</th>
                  <th className="p-2 border">Risk Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.intermediaryWallets.map((inter: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-2 border">{inter.wallet.slice(0, 10)}...{inter.wallet.slice(-6)}</td>
                    <td className="p-2 border">${inter.receivedUsd.toLocaleString()}</td>
                    <td className="p-2 border">${inter.forwardedUsd.toLocaleString()}</td>
                    <td className="p-2 border font-bold text-red-700">{inter.avgHoldingMinutes} mins</td>
                    <td className="p-2 border font-bold text-red-700">{inter.forwardingRatio}%</td>
                    <td className="p-2 border font-bold">{inter.riskIndicator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. VASP Attribution Findings */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-1">
            4. VASP / Exchange Attribution Findings
          </h2>
          {report.vaspAttribution ? (
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-500 uppercase">Identified VASP Entity:</span>
                  <div className="text-base font-bold text-slate-900">{report.vaspAttribution.name} ({report.vaspAttribution.entityType})</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 uppercase">Attribution Status:</span>
                  <div className="font-bold text-emerald-800">{report.vaspAttribution.attributionStatus} ({report.vaspAttribution.confidence}%)</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div>Deposit Cluster Address: <strong className="text-slate-900">{report.vaspAttribution.depositAddress}</strong></div>
                <div>Distance: <strong>{report.vaspAttribution.distanceHops} Hops</strong> • Traced Volume: <strong>${report.vaspAttribution.totalReceivedUsd.toLocaleString()} USD</strong></div>
              </div>

              <div className="pt-2">
                <div className="font-bold text-slate-700">Attribution Evidence:</div>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                  {report.vaspAttribution.evidencePoints.map((pt: string, i: number) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-500">No confirmed VASP attribution found.</p>
          )}
        </section>

        {/* 5. Risk Analysis & Recommendations */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-1">
            5. Risk Assessment & Actionable Recommendations
          </h2>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-mono text-red-900 space-y-1">
            <div className="font-bold">Automated Risk Score: {report.riskAnalysis.score}/100 ({report.riskAnalysis.level})</div>
            <div>Contributing Signals: {report.riskAnalysis.indicators.filter((i: any) => i.triggered).map((i: any) => i.label).join(', ')}</div>
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Investigative Recommendations:
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-xs font-sans text-slate-800">
              {report.investigativeRecommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Legal Disclaimer */}
        <section className="pt-6 border-t-2 border-slate-900 text-[11px] font-mono text-slate-500 space-y-1">
          <div className="font-bold text-slate-700 uppercase">OFFICIAL INVESTIGATIVE AID DISCLAIMER:</div>
          <p className="leading-normal font-sans">
            {report.disclaimer}
          </p>
          <div className="pt-4 flex justify-between text-slate-400">
            <span>CryptoTrace AI Digital Forensics Subsystem v2.4.1</span>
            <span>Investigator Signature: _______________________</span>
          </div>
        </section>
      </div>
    </div>
  );
};
