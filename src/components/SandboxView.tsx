import React, { useState } from 'react';
import { OrderRecord, ShippingRecord, CarrierStatus } from '../types';
import { Database, Truck, RefreshCw, Save, Package } from 'lucide-react';

interface SandboxViewProps {
  orders: OrderRecord[];
  shippingMap: Record<string, ShippingRecord>;
  onUpdateOrder: (orderId: string, updates: Partial<OrderRecord>) => Promise<void>;
  onUpdateShipping: (orderId: string, updates: Partial<ShippingRecord>) => Promise<void>;
  onResetDb: () => void;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  orders,
  shippingMap,
  onUpdateOrder,
  onUpdateShipping,
  onResetDb,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.order_id || 'ORD-8921');
  const [editingShippingStatus, setEditingShippingStatus] = useState<CarrierStatus>('DELIVERED');
  const [editingExceptionDetails, setEditingExceptionDetails] = useState('');
  const [editingAmount, setEditingAmount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const selectedOrder = orders.find((o) => o.order_id === selectedOrderId);
  const selectedShipping = shippingMap[selectedOrderId];

  React.useEffect(() => {
    if (selectedShipping) {
      setEditingShippingStatus(selectedShipping.status);
      setEditingExceptionDetails(selectedShipping.exception_details || '');
    }
    if (selectedOrder) {
      setEditingAmount(selectedOrder.total_amount);
    }
  }, [selectedOrderId, selectedOrder, selectedShipping]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (selectedOrder) {
        await onUpdateOrder(selectedOrderId, { total_amount: editingAmount });
      }
      if (selectedShipping) {
        await onUpdateShipping(selectedOrderId, {
          status: editingShippingStatus,
          exception_details: editingExceptionDetails || null,
          is_eligible_for_refund: editingShippingStatus === 'LOST' || (editingShippingStatus === 'EXCEPTION' && editingExceptionDetails.toLowerCase().includes('damage')),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase text-[#141414] flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#141414]" />
            Backend Sandbox & Carrier Simulation Manager
          </h2>
          <p className="text-xs text-[#141414]/80 mt-0.5 font-mono">
            Dynamically adjust database entries and carrier status to test agent tool querying and sequential decision execution.
          </p>
        </div>

        <button
          onClick={onResetDb}
          className="inline-flex items-center text-xs font-mono uppercase font-bold px-3.5 py-2 bg-[#E4E3E0] hover:bg-[#141414] text-[#141414] hover:text-[#E4E3E0] border border-[#141414] transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Reset Records
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Selector */}
        <div className="bg-[#FFFFFF] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2">
            <h3 className="text-xs font-black uppercase text-[#141414] flex items-center">
              <Package className="w-4 h-4 mr-1.5 text-[#141414]" />
              Database Orders
            </h3>
            <span className="section-label">{orders.length} TOTAL</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {orders.map((order) => {
              const ship = shippingMap[order.order_id];
              const isSelected = order.order_id === selectedOrderId;
              return (
                <button
                  key={order.order_id}
                  onClick={() => setSelectedOrderId(order.order_id)}
                  className={`w-full text-left p-3 border-2 transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-[2px_2px_0px_#FF4444]'
                      : 'bg-[#E4E3E0] text-[#141414] border-[#141414]/30 hover:border-[#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">
                      {order.order_id}
                    </span>
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-[#0F8246]'}`}>
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  <div className={`text-xs font-medium truncate mt-1 ${isSelected ? 'text-[#E4E3E0]/80' : 'text-[#141414]/80'}`}>
                    {order.customer_name}
                  </div>

                  <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] font-mono ${isSelected ? 'border-white/20' : 'border-[#141414]/20'}`}>
                    <span className={isSelected ? 'text-[#E4E3E0]/70' : 'text-[#141414]/60'}>{order.database_status}</span>
                    {ship && (
                      <span className={`px-1.5 py-0.5 font-bold ${
                        ship.status === 'DELIVERED' ? 'bg-[#0F8246] text-white' :
                        ship.status === 'IN-TRANSIT' ? (isSelected ? 'bg-white text-[#141414]' : 'bg-[#141414] text-white') :
                        ship.status === 'LOST' ? 'bg-[#FF4444] text-white' :
                        'bg-[#FF4444] text-white'
                      }`}>
                        {ship.status}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle & Right: Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder && (
            <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-black text-[#141414]">
                    {selectedOrder.order_id}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-mono">
                    {selectedOrder.customer_email}
                  </span>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#141414] hover:bg-[#0F8246] text-[#E4E3E0] hover:text-white font-mono uppercase font-bold text-xs transition shadow flex items-center disabled:opacity-50 cursor-pointer border border-[#141414]"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isSaving ? 'Saving Changes...' : 'Save Simulation State'}
                </button>
              </div>

              {/* Order Information & Amount modification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="section-label block">Customer Name</label>
                  <div className="p-2.5 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-mono font-bold">
                    {selectedOrder.customer_name}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="section-label block">Order Total Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAmount}
                    onChange={(e) => setEditingAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="section-label block">Items in Order</label>
                  <div className="p-2.5 bg-[#E4E3E0] border border-[#141414] text-[#141414] space-y-1">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-mono text-xs">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-bold">${it.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carrier API Simulation Editor */}
              {selectedShipping && (
                <div className="p-4 bg-[#ECEBE8] border border-[#141414] space-y-4">
                  <h4 className="text-xs font-mono font-black uppercase text-[#141414] flex items-center border-b border-[#141414]/20 pb-1">
                    <Truck className="w-4 h-4 mr-1.5 text-[#141414]" />
                    Physical Carrier API Simulation
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="section-label block">Carrier Status</label>
                      <select
                        value={editingShippingStatus}
                        onChange={(e) => setEditingShippingStatus(e.target.value as CarrierStatus)}
                        className="w-full p-2.5 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] font-mono focus:outline-none font-bold"
                      >
                        <option value="DELIVERED">DELIVERED (Case A - No Refund)</option>
                        <option value="IN-TRANSIT">IN-TRANSIT (Case B - ETA Only)</option>
                        <option value="LOST">LOST (Case C - Triggers Refund Pause)</option>
                        <option value="EXCEPTION">EXCEPTION (Case D - Evaluates Damage)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="section-label block">Carrier & Tracking #</label>
                      <div className="p-2.5 bg-[#FFFFFF] border border-[#141414] font-mono text-[#141414]">
                        {selectedShipping.carrier_name} • {selectedShipping.tracking_number}
                      </div>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="section-label block">
                        Exception Details / Location Notes (Investigated by Agent)
                      </label>
                      <textarea
                        rows={2}
                        value={editingExceptionDetails}
                        onChange={(e) => setEditingExceptionDetails(e.target.value)}
                        placeholder="e.g. Critical freight damage / liquid leak in transit terminal"
                        className="w-full p-2.5 bg-[#FFFFFF] border-2 border-[#141414] text-[#141414] font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
