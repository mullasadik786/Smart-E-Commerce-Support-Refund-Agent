import React, { useState } from 'react';
import { ApprovalRequestPayload, RefundRecord } from '../types';
import { Lock, CheckCircle, XCircle, AlertTriangle, ShieldCheck, DollarSign, Clock, ArrowUpRight } from 'lucide-react';

interface ApprovalQueueViewProps {
  pendingApprovals: ApprovalRequestPayload[];
  refunds: RefundRecord[];
  onOpenModal: (approval: ApprovalRequestPayload) => void;
  onRespond: (approvalId: string, approved: boolean, approverName: string) => Promise<void>;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({
  pendingApprovals,
  refunds,
  onOpenModal,
  onRespond,
}) => {
  const [approverName, setApproverName] = useState('Supervisor Admin');
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'history'>('pending');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black uppercase text-[#141414] flex items-center">
              <Lock className="w-5 h-5 mr-2 text-[#FF4444]" />
              Section 10: TrueForge Human Authorization Desk
            </h2>
            <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#FF4444] text-white uppercase">
              Pause-State Gateway
            </span>
          </div>
          <p className="text-xs text-[#141414]/80 mt-1 font-sans">
            Autonomous agent refund executions are permanently gated. Human supervisors must review carrier evidence and explicitly authorize Stripe transactions.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex bg-[#E4E3E0] p-1 border border-[#141414]">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold transition flex items-center cursor-pointer ${
              activeSubTab === 'pending'
                ? 'bg-[#141414] text-[#E4E3E0]'
                : 'text-[#141414]/70 hover:text-[#141414]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending Approvals ({pendingApprovals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold transition flex items-center cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-[#141414] text-[#E4E3E0]'
                : 'text-[#141414]/70 hover:text-[#141414]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Ledger Audit ({refunds.length})
          </button>
        </div>
      </div>

      {/* Pending Approvals View */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="bg-[#FFFFFF] border-2 border-[#141414] p-12 text-center text-[#141414]/80 shadow-[4px_4px_0px_#141414]">
              <div className="w-12 h-12 bg-[#E4E3E0] border border-[#141414] flex items-center justify-center mx-auto mb-3 text-[#0F8246]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black uppercase text-[#141414]">No Pending Authorizations</h3>
              <p className="text-xs text-[#141414]/70 mt-1 max-w-sm mx-auto font-sans">
                All financial actions are cleared. When the autonomous agent identifies a LOST or damaged package, approval requests will appear here automatically.
              </p>
            </div>
          ) : (
            pendingApprovals.map((req) => (
              <div
                key={req.id}
                className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#141414]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FF4444] text-white border border-[#141414] flex items-center justify-center font-black font-mono text-xs">
                      PAUSE
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-[#141414] text-sm">{req.order_id}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-mono">
                          {req.action}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-[#FF4444] text-white font-mono font-bold">
                          Carrier: {req.evidence.carrier_status}
                        </span>
                      </div>
                      <p className="text-xs text-[#141414]/70 mt-0.5 font-mono">
                        TIMESTAMP: {new Date(req.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="section-label">Authoritative Amount</div>
                      <div className="text-lg font-black text-[#141414] font-mono bg-[#E4E3E0] px-2 py-0.5 border border-[#141414]">
                        ${Number(req.amount).toFixed(2)} {req.currency}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenModal(req)}
                      className="px-3.5 py-2 bg-[#141414] hover:bg-[#FF4444] text-[#E4E3E0] hover:text-white font-mono uppercase font-bold text-xs shadow transition flex items-center cursor-pointer border border-[#141414]"
                    >
                      <span>Review & Authorize</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#E4E3E0] border border-[#141414]">
                    <div className="section-label">Customer Account</div>
                    <div className="text-[#141414] font-mono font-bold mt-0.5">{req.evidence.customer_email || 'Verified Customer'}</div>
                    <div className="text-[#141414]/70 font-mono text-[11px] mt-1">Purchased: {req.evidence.purchase_date || 'Recent'}</div>
                  </div>

                  <div className="p-3 bg-[#E4E3E0] border border-[#141414]">
                    <div className="section-label">Refund Policy Reason</div>
                    <div className="text-[#141414] mt-0.5 font-sans leading-snug">{req.reason}</div>
                  </div>

                  <div className="p-3 bg-[#E4E3E0] border border-[#141414]">
                    <div className="section-label">Carrier Verification Proof</div>
                    <div className="text-[#141414] mt-0.5 font-mono text-[11px] leading-snug">
                      {req.evidence.carrier_details}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-3 border-t border-[#141414]/20 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onRespond(req.id, false, approverName)}
                    className="px-3 py-1.5 border-2 border-[#FF4444] text-[#FF4444] hover:bg-[#FF4444] hover:text-white text-xs font-mono uppercase font-bold transition cursor-pointer"
                  >
                    Reject Refund
                  </button>
                  <button
                    onClick={() => onRespond(req.id, true, approverName)}
                    className="px-4 py-1.5 bg-[#0F8246] hover:bg-[#141414] text-white text-xs font-mono uppercase font-bold shadow transition cursor-pointer border border-[#141414]"
                  >
                    Authorize (${Number(req.amount).toFixed(2)})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Audit History View */}
      {activeSubTab === 'history' && (
        <div className="bg-[#FFFFFF] border-2 border-[#141414] shadow-[4px_4px_0px_#141414] overflow-hidden">
          <div className="p-4 bg-[#E4E3E0] border-b-2 border-[#141414] flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold text-[#141414]">
              Stripe Gateway Finalized Ledger
            </h3>
            <span className="text-xs text-[#141414] font-mono font-bold">
              TOTAL RECORDED: {refunds.length}
            </span>
          </div>

          {refunds.length === 0 ? (
            <div className="p-12 text-center text-[#141414]/60 font-mono text-xs">
              No refunds have been processed yet.
            </div>
          ) : (
            <div className="divide-y divide-[#141414]/20 text-xs font-mono">
              {refunds.map((ref) => (
                <div key={ref.refund_id} className="p-4 hover:bg-[#ECEBE8] transition flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#141414]">{ref.order_id}</span>
                      <span className="px-2 py-0.5 bg-[#141414] text-[#E4E3E0] text-[10px] font-bold">
                        GATEWAY_SETTLED
                      </span>
                      <span className="text-[#141414]/70 text-[11px]">
                        REF: {ref.reference_id}
                      </span>
                    </div>
                    <p className="text-[#141414]/80 text-[11px] mt-1 font-sans">
                      Reason: {ref.reason} • Authorized By: <strong className="text-[#141414] font-mono">{ref.processed_by}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-[#0F8246]">
                      +${ref.amount.toFixed(2)} {ref.currency}
                    </div>
                    <div className="text-[10px] text-[#141414]/60">
                      {new Date(ref.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
