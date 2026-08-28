import React, { useState } from 'react';
import { OrderRecord, ShippingRecord } from '../types';
import { History, Search, ArrowRight, Trash2, Package, Clock, CheckCircle, AlertTriangle, XCircle, Truck } from 'lucide-react';

export interface RecentSearchEntry {
  orderId: string;
  timestamp: string;
}

interface RecentSearchesSidebarProps {
  recentSearches: RecentSearchEntry[];
  orders: OrderRecord[];
  shippingMap: Record<string, ShippingRecord>;
  currentOrderId: string | null;
  onSelectOrder: (orderId: string, customPrompt?: string) => void;
  onClearRecent: () => void;
  onManualSearch: (orderId: string) => void;
  isLoading: boolean;
}

export const RecentSearchesSidebar: React.FC<RecentSearchesSidebarProps> = ({
  recentSearches,
  orders,
  shippingMap,
  currentOrderId,
  onSelectOrder,
  onClearRecent,
  onManualSearch,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim() || isLoading) return;
    const cleanId = searchInput.trim().toUpperCase();
    onManualSearch(cleanId);
    setSearchInput('');
  };

  const getOrderStatusBadge = (orderId: string) => {
    const shipping = shippingMap[orderId];
    if (shipping) {
      switch (shipping.status) {
        case 'DELIVERED':
          return (
            <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#0F8246] text-white">
              <CheckCircle className="w-2.5 h-2.5 mr-1" />
              DELIVERED
            </span>
          );
        case 'IN-TRANSIT':
          return (
            <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#141414] text-[#E4E3E0]">
              <Truck className="w-2.5 h-2.5 mr-1" />
              IN-TRANSIT
            </span>
          );
        case 'LOST':
          return (
            <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#FF4444] text-white">
              <XCircle className="w-2.5 h-2.5 mr-1" />
              LOST (REFUND)
            </span>
          );
        case 'EXCEPTION':
          return (
            <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#FF4444] text-white">
              <AlertTriangle className="w-2.5 h-2.5 mr-1" />
              EXCEPTION
            </span>
          );
      }
    }
    const order = orders.find((o) => o.order_id === orderId);
    if (order) {
      return (
        <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#E4E3E0] text-[#141414] border border-[#141414]">
          {order.database_status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#E4E3E0] text-[#141414]/70 border border-[#141414]/30">
        UNKNOWN ID
      </span>
    );
  };

  return (
    <div id="recent-searches-sidebar" className="bg-[#FFFFFF] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] space-y-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#141414]">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#141414]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#141414] font-mono">
            Recent Searches
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="section-label text-[10px] bg-[#E4E3E0] px-1.5 py-0.5 border border-[#141414]">
            {recentSearches.length}/5 QUERIED
          </span>
          {recentSearches.length > 0 && (
            <button
              id="clear-recent-searches-btn"
              onClick={onClearRecent}
              title="Clear search history"
              className="text-[#141414]/60 hover:text-[#FF4444] p-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Lookup Input */}
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
          <input
            id="recent-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Quick search (e.g. ORD-7734)..."
            disabled={isLoading}
            className="w-full pl-8 pr-2 py-1.5 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] placeholder-[#141414]/50 font-mono text-xs focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          id="recent-search-submit-btn"
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="px-3 py-1.5 bg-[#141414] hover:bg-[#FF4444] text-[#E4E3E0] hover:text-white font-mono uppercase font-bold text-xs transition disabled:opacity-50 cursor-pointer border border-[#141414] whitespace-nowrap"
        >
          Query
        </button>
      </form>

      {/* List of Last 5 Queried Orders */}
      <div className="space-y-2">
        {recentSearches.length === 0 ? (
          <div className="p-3 bg-[#ECEBE8] border border-dashed border-[#141414]/40 text-center text-xs font-mono text-[#141414]/60">
            No recent order searches recorded yet.
          </div>
        ) : (
          recentSearches.map((item) => {
            const isSelected = currentOrderId === item.orderId;
            const order = orders.find((o) => o.order_id === item.orderId);
            const shipping = shippingMap[item.orderId];

            return (
              <div
                key={item.orderId}
                id={`recent-item-${item.orderId}`}
                className={`p-2.5 border-2 transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-[2px_2px_0px_#FF4444]'
                    : 'bg-[#E4E3E0] text-[#141414] border-[#141414]/30 hover:border-[#141414]'
                }`}
              >
                {/* Top Row: Order ID & Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Package className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E4E3E0]' : 'text-[#141414]'}`} />
                    <span className="font-mono font-black text-xs">
                      {item.orderId}
                    </span>
                  </div>
                  <div>
                    {getOrderStatusBadge(item.orderId)}
                  </div>
                </div>

                {/* Middle Row: Customer Info / Price / Carrier */}
                <div className={`text-[11px] font-mono flex items-center justify-between ${
                  isSelected ? 'text-[#E4E3E0]/80' : 'text-[#141414]/80'
                }`}>
                  <span className="truncate max-w-[140px]">
                    {order ? order.customer_name : 'External Query'}
                  </span>
                  <span className="font-bold">
                    {order ? `$${order.total_amount.toFixed(2)}` : '--'}
                  </span>
                </div>

                {/* Bottom Row: Timestamp & Quick Action Buttons */}
                <div className={`flex items-center justify-between pt-1.5 border-t text-[10px] font-mono ${
                  isSelected ? 'border-white/20' : 'border-[#141414]/20'
                }`}>
                  <span className={`flex items-center ${isSelected ? 'text-[#E4E3E0]/60' : 'text-[#141414]/60'}`}>
                    <Clock className="w-2.5 h-2.5 mr-1" />
                    {item.timestamp}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      id={`btn-query-status-${item.orderId}`}
                      onClick={() => onSelectOrder(item.orderId, `Where is my order ${item.orderId}? Please check status.`)}
                      disabled={isLoading}
                      className={`px-2 py-0.5 font-bold transition uppercase flex items-center cursor-pointer border ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-[#141414] hover:bg-[#FF4444] hover:text-white border-white'
                          : 'bg-[#141414] text-[#E4E3E0] hover:bg-[#0F8246] hover:text-white border-[#141414]'
                      }`}
                    >
                      <span>Check</span>
                      <ArrowRight className="w-2.5 h-2.5 ml-1" />
                    </button>

                    {shipping && (shipping.status === 'LOST' || shipping.status === 'EXCEPTION') && (
                      <button
                        id={`btn-refund-${item.orderId}`}
                        onClick={() => onSelectOrder(item.orderId, `I need a refund for order ${item.orderId} due to shipping issue.`)}
                        disabled={isLoading}
                        className="px-2 py-0.5 font-bold bg-[#FF4444] hover:bg-[#141414] text-white border border-[#FF4444] transition uppercase cursor-pointer"
                      >
                        Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
