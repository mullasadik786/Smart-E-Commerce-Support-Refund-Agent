import React from 'react';
import { Bot, Shield, CheckCircle2, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'approvals' | 'state' | 'sandbox' | 'policy';
  setActiveTab: (tab: 'chat' | 'approvals' | 'state' | 'sandbox' | 'policy') => void;
  pendingApprovalsCount: number;
  onResetDb: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  onResetDb,
}) => {
  return (
    <header className="bg-[#E4E3E0] border-b-2 border-[#141414] text-[#141414] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-4 sm:py-5 border-b border-[#141414]/20 gap-3">
          {/* Logo & Title */}
          <div className="flex items-baseline space-x-3">
            <div className="w-8 h-8 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-mono font-bold text-sm shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-lg sm:text-2xl uppercase tracking-tighter text-[#141414]">
                  Smart E-Commerce Support / Refund Agent
                </span>
                <span className="font-mono text-[11px] bg-[#141414] text-[#E4E3E0] px-2 py-0.5 uppercase tracking-wider font-semibold">
                  AGENT_STATE: {pendingApprovalsCount > 0 ? 'PAUSED_FOR_APPROVAL' : 'ONLINE_HARNESS'}
                </span>
              </div>
              <div className="section-label mt-1">
                Autonomous sequential tool verification with human-in-the-loop financial safeguard
              </div>
            </div>
          </div>

          {/* Right Action: Reset State */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={onResetDb}
              title="Reset Sandbox Orders & Carrier State"
              className="inline-flex items-center text-xs font-mono uppercase font-bold px-3 py-1.5 border border-[#141414] bg-[#E4E3E0] hover:bg-[#141414] hover:text-[#E4E3E0] transition text-[#141414]"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset DB / Logs
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 pt-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-mono uppercase font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]'
                : 'border-transparent text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5 mr-1.5" />
            Support Terminal
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-mono uppercase font-bold transition border-b-2 whitespace-nowrap relative ${
              activeTab === 'approvals'
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]'
                : 'border-transparent text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Authorization Desk
            {pendingApprovalsCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 rounded-none text-[10px] font-mono font-bold bg-[#FF4444] text-white animate-pulse">
                {pendingApprovalsCount} REQ
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('state')}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-mono uppercase font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'state'
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]'
                : 'border-transparent text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            State & Decision Tree
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-mono uppercase font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]'
                : 'border-transparent text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Sandbox & Carrier Grid
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-mono uppercase font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'policy'
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]'
                : 'border-transparent text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            Policy Rules
          </button>
        </div>
      </div>
    </header>
  );
};
