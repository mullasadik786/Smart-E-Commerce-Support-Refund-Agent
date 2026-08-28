import React from 'react';
import { AgentLogicalState } from '../types';
import { DecisionTreeGraph } from './DecisionTreeGraph';
import { Database, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface StateInspectorViewProps {
  state: AgentLogicalState;
  activeDecisionNode: string;
}

export const StateInspectorView: React.FC<StateInspectorViewProps> = ({
  state,
  activeDecisionNode,
}) => {
  const stateFields: { key: keyof AgentLogicalState; label: string; desc: string }[] = [
    { key: 'customer_verified', label: 'customer_verified', desc: 'Identity & email matched with order DB' },
    { key: 'order_id', label: 'order_id', desc: 'Active order alphanumeric identifier' },
    { key: 'order_exists', label: 'order_exists', desc: 'Database confirmation of order existence' },
    { key: 'order_amount', label: 'order_amount', desc: 'Authoritative total amount paid ($)' },
    { key: 'currency', label: 'currency', desc: 'Billing currency format' },
    { key: 'order_status', label: 'order_status', desc: 'Database internal order status' },
    { key: 'shipping_status', label: 'shipping_status', desc: 'Physical carrier real-time status' },
    { key: 'carrier_details', label: 'carrier_details', desc: 'Tracking location / exception evidence' },
    { key: 'refund_eligible', label: 'refund_eligible', desc: 'Policy eligibility according to carrier state' },
    { key: 'refund_amount', label: 'refund_amount', desc: 'Authoritative calculated refund amount' },
    { key: 'refund_reason', label: 'refund_reason', desc: 'Strict justification for financial return' },
    { key: 'approval_required', label: 'approval_required', desc: 'TrueForge Pause State requirement' },
    { key: 'approval_received', label: 'approval_received', desc: 'Explicit Human Supervisor authorization' },
    { key: 'refund_status', label: 'refund_status', desc: 'Stripe gateway final state' },
    { key: 'refund_reference', label: 'refund_reference', desc: 'Authoritative Stripe transaction reference ID' },
  ];

  const renderValueBadge = (key: keyof AgentLogicalState, value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-[#141414]/40 font-mono text-xs">NULL</span>;
    }

    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono font-bold bg-[#141414] text-[#E4E3E0]">
          <CheckCircle2 className="w-3 h-3 mr-1 text-[#0F8246]" /> TRUE
        </span>
      ) : (
        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono font-bold bg-[#ECEBE8] text-[#141414] border border-[#141414]">
          <XCircle className="w-3 h-3 mr-1 text-[#FF4444]" /> FALSE
        </span>
      );
    }

    if (key === 'shipping_status') {
      const colors: Record<string, string> = {
        DELIVERED: 'bg-[#141414] text-[#E4E3E0]',
        'IN-TRANSIT': 'bg-[#141414] text-[#E4E3E0]',
        LOST: 'bg-[#FF4444] text-white',
        EXCEPTION: 'bg-[#FF4444] text-white',
      };
      return (
        <span className={`px-2 py-0.5 text-xs font-bold font-mono ${colors[value] || 'bg-[#141414] text-[#E4E3E0]'}`}>
          {value}
        </span>
      );
    }

    if (key === 'refund_status') {
      const colors: Record<string, string> = {
        SUCCESS: 'bg-[#0F8246] text-white',
        PENDING: 'bg-[#FF4444] text-white',
        REJECTED: 'bg-[#141414] text-white',
        NONE: 'bg-[#ECEBE8] text-[#141414] border border-[#141414]',
      };
      return (
        <span className={`px-2 py-0.5 text-xs font-bold font-mono ${colors[value] || 'bg-[#ECEBE8] text-[#141414]'}`}>
          {value}
        </span>
      );
    }

    if (typeof value === 'number') {
      return (
        <span className="font-mono text-[#141414] font-black text-xs bg-[#E4E3E0] px-1.5 py-0.5 border border-[#141414]">
          ${value.toFixed(2)}
        </span>
      );
    }

    return (
      <span className="font-mono text-[#141414] font-bold text-xs break-all">
        {String(value)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase text-[#141414] flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-[#141414]" />
            Section 23: Logical State Variables
          </h2>
          <p className="text-xs text-[#141414]/80 mt-0.5 font-mono">
            Internal agent logical state schema preserved throughout the investigation and refund lifecycle.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-[#E4E3E0] border border-[#141414] text-xs font-mono">
            <span className="text-[#141414]/70 mr-2">HARNESS STATUS:</span>
            <span className="text-[#0F8246] font-bold">SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* Decision Tree Component */}
      <DecisionTreeGraph activeNode={activeDecisionNode} />

      {/* State Fields Grid */}
      <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414]">
        <div className="flex items-center justify-between mb-4 border-b-2 border-[#141414] pb-2">
          <h3 className="text-xs sm:text-sm font-black uppercase text-[#141414] flex items-center">
            <Database className="w-4 h-4 mr-2 text-[#141414]" />
            Live State Variables Ledger
          </h3>
          <span className="section-label">15 SCHEMA NODES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#141414] border border-[#141414]">
          {stateFields.map((field) => (
            <div
              key={field.key}
              className="p-3 bg-[#E4E3E0] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-[#141414]">
                    {field.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#141414]/70 mt-0.5 leading-snug font-sans">
                  {field.desc}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#141414]/20 flex items-center justify-between">
                <span className="section-label">State</span>
                <div>{renderValueBadge(field.key, state[field.key])}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
