import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { ApprovalQueueView } from './components/ApprovalQueueView';
import { StateInspectorView } from './components/StateInspectorView';
import { SandboxView } from './components/SandboxView';
import { PolicyRulesView } from './components/PolicyRulesView';
import { ApprovalModal } from './components/ApprovalModal';
import { RecentSearchEntry } from './components/RecentSearchesSidebar';
import {
  ChatMessage,
  OrderRecord,
  ShippingRecord,
  RefundRecord,
  ApprovalRequestPayload,
  AgentLogicalState,
  ScenarioPreset,
} from './types';
import { INITIAL_ORDERS, INITIAL_SHIPPING, DEFAULT_INITIAL_STATE, SCENARIO_PRESETS } from './mockData';

const DEFAULT_RECENT_SEARCHES: RecentSearchEntry[] = [
  { orderId: 'ORD-7734', timestamp: 'Just now' },
  { orderId: 'ORD-8921', timestamp: '5m ago' },
  { orderId: 'ORD-4512', timestamp: '15m ago' },
  { orderId: 'ORD-3390', timestamp: '45m ago' },
  { orderId: 'ORD-5521', timestamp: '2h ago' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'approvals' | 'state' | 'sandbox' | 'policy'>('chat');
  const [orders, setOrders] = useState<OrderRecord[]>(Object.values(INITIAL_ORDERS));
  const [shippingMap, setShippingMap] = useState<Record<string, ShippingRecord>>(INITIAL_SHIPPING);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequestPayload[]>([]);
  
  // Agent State & Dialogue
  const [agentState, setAgentState] = useState<AgentLogicalState>(DEFAULT_INITIAL_STATE);
  const [activeDecisionNode, setActiveDecisionNode] = useState<string>('START');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>('ORD-7734');
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset | null>(SCENARIO_PRESETS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Recent Searches Sidebar State
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntry[]>(() => {
    try {
      const saved = localStorage.getItem('recent_searched_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5);
      }
    } catch (e) {
      console.warn('Could not read recent searches from localStorage:', e);
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const addRecentSearch = (orderId: string) => {
    if (!orderId) return;
    const cleanId = orderId.trim().toUpperCase();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.orderId !== cleanId);
      const updated = [{ orderId: cleanId, timestamp: 'Just now' }, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('recent_searched_orders', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist recent searches:', e);
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recent_searched_orders');
    } catch (e) {
      console.warn('Could not clear recent searches in localStorage:', e);
    }
  };
  
  // Modal for Human Authorization
  const [modalApproval, setModalApproval] = useState<ApprovalRequestPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initial Welcome Chat Message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'agent',
      content: 'Hello! I am your Autonomous Customer Support & Refund Agent. I can help with missing packages, delivery tracking, carrier exceptions, and authorized refund requests.\n\nPlease select one of the test scenarios above or provide your Order ID (e.g. ORD-7734) to begin.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // Load server state on mount
  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const [ordersRes, refundsRes, approvalsRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/refunds').then((r) => r.json()),
        fetch('/api/approvals/pending').then((r) => r.json()),
      ]);

      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (refundsRes.refunds) setRefunds(refundsRes.refunds);
      if (approvalsRes.approvals) setPendingApprovals(approvalsRes.approvals);
    } catch (e) {
      console.warn('Using client-side store sync:', e);
    }
  };

  // Handle Customer Message Sending
  const handleSendMessage = async (text: string) => {
    // Detect Order ID in message to update recent search
    const orderMatch = text.match(/ORD-\d{4}/i);
    if (orderMatch) {
      const detectedId = orderMatch[0].toUpperCase();
      addRecentSearch(detectedId);
      setCurrentOrderId(detectedId);
    }

    const userMsgId = `user_${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...messages, newMsg],
          currentOrderId,
        }),
      });

      const data = await res.json();

      const agentMsgId = `agent_${Date.now()}`;
      const agentMsg: ChatMessage = {
        id: agentMsgId,
        sender: 'agent',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString(),
        toolCalls: data.toolLogs || [],
        approvalRequest: data.approvalRequest || undefined,
        isPauseState: data.isPauseState || false,
        decisionNode: data.decisionNode || 'START',
      };

      setMessages((prev) => [...prev, agentMsg]);

      // Update State Inspector
      if (data.decisionNode) {
        setActiveDecisionNode(data.decisionNode);
      }
      if (data.stateUpdates) {
        setAgentState((prev) => ({
          ...prev,
          ...data.stateUpdates,
        }));
        if (data.stateUpdates.order_id) {
          addRecentSearch(data.stateUpdates.order_id);
          setCurrentOrderId(data.stateUpdates.order_id);
        }
      }

      // If Pause State triggered for Human Approval
      if (data.isPauseState && data.approvalRequest) {
        setPendingApprovals((prev) => {
          const exists = prev.some((a) => a.id === data.approvalRequest.id);
          return exists ? prev : [data.approvalRequest, ...prev];
        });
      }

      // Refresh orders and shipping data
      fetchState();
    } catch (err: any) {
      console.error('Error in agent conversation:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'agent',
          content: 'I apologize, but a communication error occurred with our backend service. Please try again.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Scenario Selection
  const handleSelectScenario = (scenario: ScenarioPreset) => {
    setActiveScenario(scenario);
    setCurrentOrderId(scenario.orderId);
    addRecentSearch(scenario.orderId);
    setAgentState({
      ...DEFAULT_INITIAL_STATE,
      order_id: scenario.orderId,
    });
    setActiveDecisionNode('START');

    // Add user question automatically for the scenario
    handleSendMessage(scenario.initialPrompt);
  };

  // Handle Manual Order Search from Sidebar
  const handleManualSearchOrder = (orderId: string) => {
    addRecentSearch(orderId);
    setCurrentOrderId(orderId);
    handleSendMessage(`Please check the status and details for order ${orderId}.`);
  };

  // Handle Selection of Recent Search item
  const handleSelectRecentOrder = (orderId: string, customPrompt?: string) => {
    addRecentSearch(orderId);
    setCurrentOrderId(orderId);
    handleSendMessage(customPrompt || `Where is my order ${orderId}? Please check the tracking status.`);
  };

  // Human Supervisor Approval Response Handler
  const handleApprovalResponse = async (
    approvalId: string,
    approved: boolean,
    approverName: string
  ) => {
    try {
      const res = await fetch('/api/approvals/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          approved,
          approverName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Remove from pending list
        setPendingApprovals((prev) => prev.filter((a) => a.id !== approvalId));

        if (data.refundRecord) {
          setRefunds((prev) => [data.refundRecord, ...prev]);
        }

        // Add supervisor outcome to chat conversation
        if (approved) {
          setMessages((prev) => [
            ...prev,
            {
              id: `sys_appr_${Date.now()}`,
              sender: 'agent',
              content: `[Human Supervisor Authorization Granted by ${approverName}]\n\n${data.customerConfirmation}`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          setAgentState((prev) => ({
            ...prev,
            approval_received: true,
            refund_status: 'SUCCESS',
            refund_reference: data.refundRecord?.reference_id || null,
          }));
          setActiveDecisionNode('POST_APPROVAL_SUCCESS');
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `sys_rej_${Date.now()}`,
              sender: 'agent',
              content: `[Human Supervisor Review: Refund Request Declined]\n\n${data.customerExplanation}`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          setAgentState((prev) => ({
            ...prev,
            approval_received: false,
            refund_status: 'REJECTED',
          }));
          setActiveDecisionNode('POST_APPROVAL_REJECTED');
        }

        fetchState();
      }
    } catch (e) {
      console.error('Error processing approval response:', e);
    }
  };

  // Reset State in Sandbox
  const handleResetDb = async () => {
    try {
      await fetch('/api/orders/reset', { method: 'POST' });
      setOrders(Object.values(INITIAL_ORDERS));
      setShippingMap(INITIAL_SHIPPING);
      setRefunds([]);
      setPendingApprovals([]);
      setAgentState(DEFAULT_INITIAL_STATE);
      setActiveDecisionNode('START');
      setMessages([
        {
          id: `welcome_${Date.now()}`,
          sender: 'agent',
          content: 'Database records, shipping carrier status, and refund ledgers have been restored to initial state. How can I help you today?',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (e) {
      console.warn('Reset failed, using client state reset');
    }
  };

  // Update Order in Sandbox
  const handleUpdateOrder = async (orderId: string, updates: Partial<OrderRecord>) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, ...updates } : o))
      );
    } catch (e) {
      console.error('Failed to update order:', e);
    }
  };

  // Update Shipping in Sandbox
  const handleUpdateShipping = async (orderId: string, updates: Partial<ShippingRecord>) => {
    try {
      await fetch(`/api/shipping/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setShippingMap((prev) => ({
        ...prev,
        [orderId]: { ...prev[orderId], ...updates },
      }));
    } catch (e) {
      console.error('Failed to update shipping:', e);
    }
  };

  const currentOrder = orders.find((o) => o.order_id === currentOrderId) || null;
  const currentShipping = currentOrderId ? shippingMap[currentOrderId] || null : null;

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovals.length}
        onResetDb={handleResetDb}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSelectScenario={handleSelectScenario}
            activeScenario={activeScenario}
            currentOrder={currentOrder}
            currentShipping={currentShipping}
            onOpenApprovalModal={(approval) => {
              setModalApproval(approval);
              setIsModalOpen(true);
            }}
            onClearChat={() => {
              setMessages([
                {
                  id: `msg_${Date.now()}`,
                  sender: 'agent',
                  content: 'Conversation reset. Please provide an Order ID or choose a test scenario.',
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
              setAgentState(DEFAULT_INITIAL_STATE);
              setActiveDecisionNode('START');
            }}
            recentSearches={recentSearches}
            orders={orders}
            shippingMap={shippingMap}
            onSelectRecentOrder={handleSelectRecentOrder}
            onClearRecentSearches={handleClearRecentSearches}
            onManualSearchOrder={handleManualSearchOrder}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalQueueView
            pendingApprovals={pendingApprovals}
            refunds={refunds}
            onOpenModal={(approval) => {
              setModalApproval(approval);
              setIsModalOpen(true);
            }}
            onRespond={handleApprovalResponse}
          />
        )}

        {activeTab === 'state' && (
          <StateInspectorView
            state={agentState}
            activeDecisionNode={activeDecisionNode}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxView
            orders={orders}
            shippingMap={shippingMap}
            onUpdateOrder={handleUpdateOrder}
            onUpdateShipping={handleUpdateShipping}
            onResetDb={handleResetDb}
          />
        )}

        {activeTab === 'policy' && <PolicyRulesView />}
      </main>

      {/* Human Supervisor Authorization Modal */}
      <ApprovalModal
        request={modalApproval}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRespond={handleApprovalResponse}
      />
    </div>
  );
}
