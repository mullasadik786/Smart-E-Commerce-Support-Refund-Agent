import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScenarioPreset, OrderRecord, ShippingRecord } from '../types';
import { SCENARIO_PRESETS } from '../mockData';
import { ToolCallBadge } from './ToolCallBadge';
import { RecentSearchesSidebar, RecentSearchEntry } from './RecentSearchesSidebar';
import { Send, Bot, User, Lock, Sparkles, RefreshCw, ChevronRight, Package } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  activeScenario: ScenarioPreset | null;
  currentOrder: OrderRecord | null;
  currentShipping: ShippingRecord | null;
  onOpenApprovalModal: (approval: any) => void;
  onClearChat: () => void;
  recentSearches: RecentSearchEntry[];
  orders: OrderRecord[];
  shippingMap: Record<string, ShippingRecord>;
  onSelectRecentOrder: (orderId: string, customPrompt?: string) => void;
  onClearRecentSearches: () => void;
  onManualSearchOrder: (orderId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectScenario,
  activeScenario,
  currentOrder,
  currentShipping,
  onOpenApprovalModal,
  onClearChat,
  recentSearches,
  orders,
  shippingMap,
  onSelectRecentOrder,
  onClearRecentSearches,
  onManualSearchOrder,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Terminal Chat Area (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col bg-[#FFFFFF] border-2 border-[#141414] shadow-[4px_4px_0px_#141414] overflow-hidden h-[740px]">
        {/* Scenario Selection Header Bar */}
        <div className="p-3 bg-[#E4E3E0] border-b-2 border-[#141414]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141414] flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#141414]" />
              Scenario Testbed // Quick Presets
            </span>
            <button
              onClick={onClearChat}
              className="text-[11px] font-mono uppercase font-bold text-[#141414]/80 hover:text-[#141414] hover:underline transition flex items-center cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset Terminal
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SCENARIO_PRESETS.map((sc) => {
              const isSelected = activeScenario?.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc)}
                  className={`px-2.5 py-1 text-xs font-mono uppercase font-bold whitespace-nowrap transition flex items-center border ${
                    isSelected
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                      : 'bg-[#FFFFFF] hover:bg-[#141414]/10 text-[#141414] border-[#141414]/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 mr-1.5 ${
                    sc.caseType === 'C' ? 'bg-[#FF4444]' :
                    sc.caseType === 'A' ? 'bg-[#0F8246]' :
                    sc.caseType === 'B' ? 'bg-[#1D4ED8]' :
                    sc.caseType === 'D' ? 'bg-[#B45309]' : 'bg-[#141414]'
                  }`} />
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FFFFFF]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#141414] text-[#E4E3E0] border border-[#141414]'
                    : msg.sender === 'system'
                    ? 'bg-[#B45309] text-white border border-[#141414]'
                    : 'bg-[#E4E3E0] text-[#141414] border border-[#141414]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble Container */}
              <div className="max-w-[85%] sm:max-w-[78%] space-y-2">
                <div
                  className={`p-3.5 text-xs sm:text-sm leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                      : 'bg-[#ECEBE8] text-[#141414] border-[#141414]/30 font-sans'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono opacity-70 mb-1 border-b border-current/10 pb-0.5">
                    <span>{msg.sender === 'user' ? 'CUSTOMER_INPUT' : 'AGENT_DISPATCH'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-line font-sans">{msg.content}</div>
                </div>

                {/* Inline Tool Execution Visualizer */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="space-y-1">
                    <div className="section-label px-1 flex items-center justify-between">
                      <span>Sequential Tool Execution Chain</span>
                      <span className="font-mono text-[10px]">{msg.toolCalls.length} CALLS</span>
                    </div>
                    {msg.toolCalls.map((tool) => (
                      <ToolCallBadge key={tool.id} tool={tool} />
                    ))}
                  </div>
                )}

                {/* TrueForge Pause State Notification Card */}
                {msg.approvalRequest && msg.isPauseState && (
                  <div className="p-4 bg-[#E4E3E0] border-2 border-[#141414] shadow-[3px_3px_0px_#141414] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#141414] font-black text-xs uppercase tracking-tight">
                        <Lock className="w-4 h-4 text-[#FF4444]" />
                        <span>TrueForge Safeguard: Financial Execution Pause</span>
                      </div>
                      <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#FF4444] text-white uppercase">
                        Action Locked
                      </span>
                    </div>

                    <p className="text-xs text-[#141414] leading-relaxed font-sans">
                      Autonomous refund execution halted. High-risk irreversible refund of{' '}
                      <strong className="font-mono text-[#141414] bg-[#FFFFFF] px-1 border border-[#141414]">
                        ${Number(msg.approvalRequest.amount).toFixed(2)}
                      </strong> for order <strong className="font-mono text-[#141414]">{msg.approvalRequest.order_id}</strong> is ready for supervisor review.
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[#141414]/20">
                      <span className="text-[11px] text-[#141414]/80 font-mono">
                        Evidence: {msg.approvalRequest.evidence.carrier_status}
                      </span>
                      <button
                        onClick={() => onOpenApprovalModal(msg.approvalRequest)}
                        className="px-3 py-1.5 bg-[#141414] hover:bg-[#FF4444] text-[#E4E3E0] hover:text-white font-mono uppercase font-bold text-xs transition flex items-center cursor-pointer"
                      >
                        <span>Supervisor Review Desk</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 bg-[#141414] text-[#E4E3E0] flex items-center justify-center flex-shrink-0 font-mono text-xs">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 bg-[#ECEBE8] border border-[#141414]/30 text-xs text-[#141414] font-mono flex items-center space-x-2">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#141414] animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#141414] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#141414] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Executing verification tools in sequence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-3.5 bg-[#E4E3E0] border-t-2 border-[#141414] space-y-2">
          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-[#141414]/80 scrollbar-none">
            <span className="font-mono text-[#141414] font-bold whitespace-nowrap">PROMPTS:</span>
            <button
              onClick={() => handleQuickPrompt("I didn't get order ORD-7734. Please refund me.")}
              className="px-2 py-0.5 bg-[#FFFFFF] hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] font-mono whitespace-nowrap transition cursor-pointer text-xs"
            >
              "Lost ORD-7734 refund"
            </button>
            <button
              onClick={() => handleQuickPrompt("Where is my package ORD-8921?")}
              className="px-2 py-0.5 bg-[#FFFFFF] hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] font-mono whitespace-nowrap transition cursor-pointer text-xs"
            >
              "Check ORD-8921"
            </button>
            <button
              onClick={() => handleQuickPrompt("Is my order ORD-4512 delayed?")}
              className="px-2 py-0.5 bg-[#FFFFFF] hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] font-mono whitespace-nowrap transition cursor-pointer text-xs"
            >
              "Status ORD-4512"
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter customer message or inquire about order (e.g. ORD-7734)..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] placeholder-[#141414]/50 text-xs sm:text-sm font-sans focus:outline-none focus:bg-[#FFFFFF] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-[#141414] hover:bg-[#FF4444] text-[#E4E3E0] hover:text-white font-mono uppercase font-bold text-xs sm:text-sm transition flex items-center justify-center disabled:opacity-50 cursor-pointer border border-[#141414]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar: Recent Searches & Active Order Dossier (4 Cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Recent Searches Sidebar Panel */}
        <RecentSearchesSidebar
          recentSearches={recentSearches}
          orders={orders}
          shippingMap={shippingMap}
          currentOrderId={currentOrder?.order_id || null}
          onSelectOrder={onSelectRecentOrder}
          onClearRecent={onClearRecentSearches}
          onManualSearch={onManualSearchOrder}
          isLoading={isLoading}
        />

        {/* Scenario description card */}
        {activeScenario && (
          <div className="bg-[#FFFFFF] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#141414]/20 pb-2">
              <span className="section-label">Active Test Scenario</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0]">
                {activeScenario.badge}
              </span>
            </div>
            <h4 className="font-black text-sm uppercase text-[#141414]">{activeScenario.title}</h4>
            <p className="text-xs text-[#141414]/80 leading-relaxed font-sans">{activeScenario.description}</p>
            <div className="p-2.5 bg-[#E4E3E0] border border-[#141414] text-[11px] text-[#141414] font-mono">
              <strong className="block text-[#141414] uppercase mb-0.5">POLICY EXPECTATION:</strong>
              {activeScenario.expectedOutcome}
            </div>
          </div>
        )}

        {/* Order Details Preview Card */}
        {currentOrder ? (
          <div className="bg-[#FFFFFF] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#141414]">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#141414]" />
                <span className="font-mono font-black text-sm text-[#141414]">
                  {currentOrder.order_id}
                </span>
              </div>
              <span className="font-mono font-black text-sm text-[#141414] bg-[#E4E3E0] px-2 py-0.5 border border-[#141414]">
                ${currentOrder.total_amount.toFixed(2)} {currentOrder.currency}
              </span>
            </div>

            {/* Structured Stats Grid */}
            <div className="grid grid-cols-2 gap-[1px] bg-[#141414] border border-[#141414]">
              <div className="bg-[#E4E3E0] p-2">
                <div className="section-label">Customer</div>
                <div className="font-mono font-bold text-xs text-[#141414] truncate">{currentOrder.customer_name}</div>
              </div>
              <div className="bg-[#E4E3E0] p-2">
                <div className="section-label">Date</div>
                <div className="font-mono font-bold text-xs text-[#141414]">{currentOrder.purchase_date}</div>
              </div>
              <div className="bg-[#E4E3E0] p-2 col-span-2">
                <div className="section-label">Email Account</div>
                <div className="font-mono text-xs text-[#141414] truncate">{currentOrder.customer_email}</div>
              </div>
            </div>

            {/* Items */}
            <div className="p-2.5 bg-[#ECEBE8] border border-[#141414]/30 space-y-1.5 text-xs">
              <div className="section-label">Ordered Items</div>
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#141414] font-mono">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-bold">${it.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Carrier Status Display Callout */}
            {currentShipping && (
              <div className="p-3 bg-[#E4E3E0] border border-[#141414] space-y-2">
                <div className="section-label">Carrier Verification Stream</div>
                <div className="carrier-status-callout text-2xl sm:text-3xl text-[#141414]">
                  {currentShipping.status}
                </div>

                <div className="text-[11px] text-[#141414] font-mono border-t border-[#141414]/20 pt-1.5">
                  CARRIER: {currentShipping.carrier_name} // TRK: {currentShipping.tracking_number}
                </div>

                {currentShipping.delivery_proof && (
                  <div className="text-[11px] text-[#141414] bg-[#FFFFFF] p-2 border border-[#141414] font-mono">
                    <span className="font-bold block text-[#0F8246]">DELIVERY PROOF:</span>
                    {currentShipping.delivery_proof.details}
                  </div>
                )}

                {currentShipping.exception_details && (
                  <div className="text-[11px] text-[#141414] bg-[#FFFFFF] p-2 border border-[#FF4444] font-mono">
                    <span className="font-bold block text-[#FF4444]">EXCEPTION NOTICE:</span>
                    {currentShipping.exception_details}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border-2 border-[#141414] p-6 text-center text-[#141414]/60 font-mono text-xs shadow-[4px_4px_0px_#141414]">
            [NO ACTIVE ORDER LOADED]
          </div>
        )}
      </div>
    </div>
  );
};
