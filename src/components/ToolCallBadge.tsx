import React, { useState } from 'react';
import { Database, Truck, CreditCard, ChevronDown, ChevronUp, Check, AlertCircle, Clock, Terminal } from 'lucide-react';
import { ToolCallLog } from '../types';

interface ToolCallBadgeProps {
  tool: ToolCallLog;
}

export const ToolCallBadge: React.FC<ToolCallBadgeProps> = ({ tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = () => {
    switch (tool.tool_name) {
      case 'query_database':
        return <Database className="w-3.5 h-3.5 text-[#141414]" />;
      case 'check_shipping_carrier_api':
        return <Truck className="w-3.5 h-3.5 text-[#141414]" />;
      case 'initiate_stripe_refund':
        return <CreditCard className="w-3.5 h-3.5 text-[#FF4444]" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-[#141414]" />;
    }
  };

  const getToolDisplayName = () => {
    switch (tool.tool_name) {
      case 'query_database':
        return 'query_database(order_id)';
      case 'check_shipping_carrier_api':
        return 'check_shipping_carrier_api(order_id)';
      case 'initiate_stripe_refund':
        return 'initiate_stripe_refund(order_id, amount)';
      default:
        return tool.tool_name;
    }
  };

  return (
    <div className="my-1.5 border border-[#141414] bg-[#FFFFFF] overflow-hidden text-xs">
      {/* Header row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between bg-[#ECEBE8] hover:bg-[#E4E3E0] transition text-left cursor-pointer border-b border-[#141414]/15"
      >
        <div className="flex items-center space-x-2">
          {getToolIcon()}
          <span className="font-mono font-bold text-[#141414]">{getToolDisplayName()}</span>
          <span className="text-[10px] text-[#141414]/70 font-mono">
            {tool.input_params.order_id ? `[${tool.input_params.order_id}]` : ''}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {tool.status === 'success' && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#141414] text-[#E4E3E0]">
              <Check className="w-3 h-3 mr-1 text-[#0F8246]" />
              SUCCESS
            </span>
          )}
          {tool.status === 'paused' && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#FF4444] text-white">
              <Clock className="w-3 h-3 mr-1" />
              PAUSED [GATEWAY_LOCK]
            </span>
          )}
          {tool.status === 'error' && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#FF4444] text-white">
              <AlertCircle className="w-3 h-3 mr-1" />
              ERROR
            </span>
          )}

          <span className="text-[10px] text-[#141414]/70 font-mono">{tool.duration_ms}ms</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#141414]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#141414]" />}
        </div>
      </button>

      {/* Expanded Payload view */}
      {isExpanded && (
        <div className="p-3 bg-[#FFFFFF] border-t border-[#141414] space-y-2.5 font-mono text-[11px]">
          <div>
            <div className="section-label mb-1">
              Input Parameters
            </div>
            <pre className="p-2 bg-[#E4E3E0]/50 text-[#141414] border border-[#141414]/30 overflow-x-auto">
              {JSON.stringify(tool.input_params, null, 2)}
            </pre>
          </div>

          <div>
            <div className="section-label mb-1">
              Output Payload
            </div>
            <pre className="p-2 bg-[#141414] text-[#E4E3E0] border border-[#141414] overflow-x-auto max-h-48">
              {JSON.stringify(tool.output_result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
