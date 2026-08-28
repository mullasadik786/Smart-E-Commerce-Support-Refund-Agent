import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Lock, UserCheck } from 'lucide-react';
import { ApprovalRequestPayload } from '../types';

interface ApprovalModalProps {
  request: ApprovalRequestPayload | null;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (approvalId: string, approved: boolean, approverName: string) => Promise<void>;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onRespond,
}) => {
  const [approverName, setApproverName] = useState('Supervisor Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleDecision = async (approved: boolean) => {
    setIsSubmitting(true);
    try {
      await onRespond(request.id, approved, approverName);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/70 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border-2 border-[#141414] max-w-xl w-full shadow-[6px_6px_0px_#141414] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#E4E3E0] p-4 sm:p-5 border-b-2 border-[#141414] flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#FF4444] text-white border border-[#141414] flex items-center justify-center font-mono font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-[#141414] uppercase text-base sm:text-lg">
                  TrueForge Human Authorization Gate
                </span>
              </div>
              <p className="text-xs text-[#141414]/80 mt-0.5 font-mono">
                Section 9 Compliance: High-risk irreversible financial refund requires human approval.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-[#141414] text-sm">
          {/* Warning Banner */}
          <div className="p-3.5 bg-[#FF4444]/10 border-2 border-[#FF4444] text-[#141414] text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-[#FF4444] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#FF4444] font-bold uppercase font-mono">IRREVERSIBLE FINANCIAL ACTION:</strong>{' '}
              Executing this refund will permanently transmit a refund instruction of{' '}
              <span className="font-mono font-black text-[#141414] bg-[#FFFFFF] px-1 border border-[#141414]">
                ${Number(request.amount).toFixed(2)} {request.currency}
              </span> to Stripe for Order <span className="font-mono font-bold">{request.order_id}</span>.
            </div>
          </div>

          {/* Evidence Dossier */}
          <div className="bg-[#ECEBE8] p-4 border border-[#141414] space-y-3">
            <div className="section-label flex items-center justify-between border-b border-[#141414]/20 pb-1">
              <span>Verified Evidence Dossier</span>
              <span className="text-[10px] text-[#0F8246] flex items-center font-mono font-bold">
                <UserCheck className="w-3 h-3 mr-1" />
                DB & CARRIER AUTHENTICATED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FFFFFF] border border-[#141414]">
                <div className="section-label">Order ID</div>
                <div className="font-mono font-bold text-[#141414] text-sm">{request.order_id}</div>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] border border-[#141414]">
                <div className="section-label">Refund Amount</div>
                <div className="font-mono font-bold text-[#141414] text-sm">
                  ${Number(request.amount).toFixed(2)} {request.currency}
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] border border-[#141414]">
                <div className="section-label">Carrier Status</div>
                <div className="font-mono font-bold text-[#FF4444]">
                  {request.evidence.carrier_status}
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFFFF] border border-[#141414]">
                <div className="section-label">Customer Email</div>
                <div className="font-mono text-[#141414] truncate">
                  {request.evidence.customer_email || 'Verified Customer'}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#FFFFFF] border border-[#141414] text-xs">
              <div className="section-label mb-1">Carrier Investigation Details</div>
              <div className="text-[#141414] font-mono leading-relaxed text-[11px]">
                {request.evidence.carrier_details}
              </div>
            </div>
          </div>

          {/* Approver Signature */}
          <div className="space-y-1">
            <label className="section-label block">
              Human Supervisor Identification / Approver Signature
            </label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] text-xs focus:outline-none font-mono"
              placeholder="e.g. Supervisor Jane Doe"
            />
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 bg-[#E4E3E0] border-t-2 border-[#141414] flex items-center justify-between space-x-3">
          <button
            onClick={() => handleDecision(false)}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border-2 border-[#FF4444] bg-[#FFFFFF] hover:bg-[#FF4444] hover:text-white text-[#FF4444] text-xs font-mono uppercase font-bold transition disabled:opacity-50 cursor-pointer"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject Refund
          </button>

          <button
            onClick={() => handleDecision(true)}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-[#141414] hover:bg-[#0F8246] text-[#E4E3E0] hover:text-white text-xs font-mono uppercase font-bold shadow transition disabled:opacity-50 cursor-pointer border border-[#141414]"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Authorize & Execute Stripe Refund
          </button>
        </div>
      </div>
    </div>
  );
};
