import React from 'react';
import { ArrowDown, Check, Shield, X, Sparkles } from 'lucide-react';

interface DecisionTreeGraphProps {
  activeNode: string;
}

export const DecisionTreeGraph: React.FC<DecisionTreeGraphProps> = ({ activeNode }) => {
  const isNodeActive = (nodeId: string) => {
    return activeNode.toUpperCase().includes(nodeId.toUpperCase());
  };

  const getNodeClass = (nodeId: string, baseStyle: string, activeStyle: string) => {
    const active = isNodeActive(nodeId);
    return `${baseStyle} ${active ? `${activeStyle} ring-2 ring-[#FF4444] scale-[1.02] shadow-[2px_2px_0px_#141414]` : 'opacity-90'}`;
  };

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] text-[#141414]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#141414]">
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase text-[#141414] flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-[#141414]" />
            Live Decision Logic & State Machine
          </h3>
          <p className="text-xs text-[#141414]/70 font-mono">
            Real-time execution path conforming strictly to Section 24 Decision Tree
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 bg-[#141414] text-[#E4E3E0]">
          NODE: <span className="text-white font-bold">{activeNode || 'START'}</span>
        </span>
      </div>

      {/* Decision Tree Flow */}
      <div className="space-y-3 font-sans text-xs">
        {/* Step 1: Start & Capture Order ID */}
        <div className="flex flex-col items-center">
          <div className={getNodeClass('START', 'w-72 p-2.5 bg-[#E4E3E0] border border-[#141414] text-center transition-all', 'bg-[#141414] text-[#E4E3E0]')}>
            <span className="section-label block">Step 1: Input Capture</span>
            <span className="font-mono font-bold">Receive Customer Inquiry & Order ID</span>
          </div>
          <ArrowDown className="w-3.5 h-3.5 text-[#141414] my-0.5" />
        </div>

        {/* Step 2: Query DB */}
        <div className="flex flex-col items-center">
          <div className={getNodeClass('VERIFY_CUSTOMER', 'w-80 p-2.5 bg-[#E4E3E0] border border-[#141414] text-center transition-all', 'bg-[#141414] text-[#E4E3E0]')}>
            <span className="section-label block">Tool 1: DB Verification</span>
            <span className="font-mono font-bold">query_database(order_id)</span>
          </div>
          <ArrowDown className="w-3.5 h-3.5 text-[#141414] my-0.5" />
        </div>

        {/* Branch: Not Found vs Verified */}
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          <div className={getNodeClass('ORDER_NOT_FOUND', 'p-2.5 bg-[#E4E3E0] border border-[#FF4444] text-[#FF4444] text-center', 'bg-[#FF4444] text-white')}>
            <div className="font-mono font-black flex items-center justify-center text-xs uppercase">
              <X className="w-3.5 h-3.5 mr-1" /> Not Found
            </div>
            <div className="text-[11px] text-[#141414]/70 mt-1 font-sans">Explain missing order & stop</div>
          </div>

          <div className={getNodeClass('VERIFY', 'p-2.5 bg-[#E4E3E0] border border-[#0F8246] text-[#0F8246] text-center', 'bg-[#0F8246] text-white')}>
            <div className="font-mono font-black flex items-center justify-center text-xs uppercase">
              <Check className="w-3.5 h-3.5 mr-1" /> Order Exists
            </div>
            <div className="text-[11px] text-[#141414]/70 mt-1 font-sans">Match customer email & amount</div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-[#141414] my-0.5" />
        </div>

        {/* Step 3: Check Carrier API */}
        <div className="flex flex-col items-center">
          <div className={getNodeClass('CARRIER', 'w-80 p-2.5 bg-[#E4E3E0] border border-[#141414] text-center transition-all', 'bg-[#141414] text-[#E4E3E0]')}>
            <span className="section-label block">Tool 2: Physical Carrier Status</span>
            <span className="font-mono font-bold">check_shipping_carrier_api(order_id)</span>
          </div>
          <ArrowDown className="w-3.5 h-3.5 text-[#141414] my-0.5" />
        </div>

        {/* Carrier 4 Outcomes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {/* Case A: Delivered */}
          <div className={getNodeClass('CARRIER_DELIVERED', 'p-2.5 bg-[#E4E3E0] border border-[#141414] text-left', 'bg-[#141414] text-[#E4E3E0]')}>
            <div className="font-mono text-[11px] font-black uppercase text-[#141414]">CASE A: DELIVERED</div>
            <div className="text-[10px] text-[#141414]/70 mt-1 leading-snug font-sans">
              Provide proof timestamp. <strong>No refund.</strong> Guide claim filing.
            </div>
          </div>

          {/* Case B: In-Transit */}
          <div className={getNodeClass('CARRIER_IN_TRANSIT', 'p-2.5 bg-[#E4E3E0] border border-[#141414] text-left', 'bg-[#141414] text-[#E4E3E0]')}>
            <div className="font-mono text-[11px] font-black uppercase text-[#141414]">CASE B: IN-TRANSIT</div>
            <div className="text-[10px] text-[#141414]/70 mt-1 leading-snug font-sans">
              Provide hub location & ETA. <strong>No refund.</strong> Advise waiting.
            </div>
          </div>

          {/* Case C: Lost */}
          <div className={getNodeClass('LOST', 'p-2.5 bg-[#E4E3E0] border-2 border-[#FF4444] text-left', 'bg-[#FF4444] text-white')}>
            <div className="font-mono text-[11px] font-black uppercase text-[#FF4444]">CASE C: LOST</div>
            <div className="text-[10px] text-[#141414]/80 mt-1 leading-snug font-sans">
              Carrier confirmed lost. <strong>Pause for Human Approval.</strong>
            </div>
          </div>

          {/* Case D: Exception */}
          <div className={getNodeClass('EXCEPTION', 'p-2.5 bg-[#E4E3E0] border-2 border-[#FF4444] text-left', 'bg-[#FF4444] text-white')}>
            <div className="font-mono text-[11px] font-black uppercase text-[#FF4444]">CASE D: EXCEPTION</div>
            <div className="text-[10px] text-[#141414]/80 mt-1 leading-snug font-sans">
              Evaluate damage severity. <strong>Pause if eligible.</strong>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-[#141414] my-0.5" />
        </div>

        {/* Human Supervisor Gate */}
        <div className="flex flex-col items-center">
          <div className={getNodeClass('HUMAN_APPROVAL_PAUSE', 'w-full max-w-md p-3 bg-[#FF4444]/10 border-2 border-[#FF4444] text-center transition-all', 'bg-[#FF4444] text-white')}>
            <div className="flex items-center justify-center space-x-1.5 font-mono font-black uppercase">
              <Shield className="w-4 h-4" />
              <span>Section 10: TrueForge Human Authorization Gate</span>
            </div>
            <div className="text-[11px] text-[#141414]/80 mt-1 font-sans">
              Autonomous refund prohibited. Halts execution until explicit True / False signal.
            </div>
          </div>
        </div>

        {/* Post-Approval Branches */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <div className="p-2.5 bg-[#E4E3E0] border border-[#FF4444] text-center">
            <div className="font-mono font-black text-[#FF4444] text-xs uppercase">Approval: FALSE</div>
            <div className="text-[10px] text-[#141414]/70 mt-0.5 font-sans">Stop refund. Escalate to manual queue.</div>
          </div>

          <div className="p-2.5 bg-[#E4E3E0] border border-[#0F8246] text-center">
            <div className="font-mono font-black text-[#0F8246] text-xs uppercase">Approval: TRUE</div>
            <div className="text-[10px] text-[#141414]/70 mt-0.5 font-sans">Execute Stripe gateway refund & return receipt.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
