export interface OrderRecord {
  order_id: string;
  customer_name: string;
  customer_email: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  total_amount: number;
  currency: string;
  purchase_date: string;
  payment_method: string;
  masked_card: string;
  billing_address: string;
  shipping_address: string;
  database_status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
}

export type CarrierStatus = 'DELIVERED' | 'IN-TRANSIT' | 'LOST' | 'EXCEPTION';

export interface TrackingCheckpoint {
  timestamp: string;
  location: string;
  description: string;
  status: CarrierStatus;
}

export interface ShippingRecord {
  order_id: string;
  carrier_name: string;
  tracking_number: string;
  status: CarrierStatus;
  current_location: string;
  estimated_delivery_date: string | null;
  delivery_timestamp: string | null;
  delivery_proof: {
    type: 'signature' | 'photo' | 'doorstep' | 'none';
    details: string;
  } | null;
  exception_details: string | null;
  is_eligible_for_refund: boolean;
  tracking_history: TrackingCheckpoint[];
}

export interface RefundRecord {
  refund_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'FAILED';
  reason: string;
  created_at: string;
  approved_at?: string;
  reference_id?: string;
  failure_reason?: string;
  processed_by: string;
}

export interface AgentLogicalState {
  customer_verified: boolean;
  order_id: string | null;
  order_exists: boolean | null;
  order_amount: number | null;
  currency: string;
  order_status: string | null;
  shipping_status: CarrierStatus | null;
  carrier_details: string | null;
  refund_eligible: boolean | null;
  refund_amount: number | null;
  refund_reason: string | null;
  approval_required: boolean;
  approval_received: boolean | null;
  refund_status: 'NONE' | 'PENDING' | 'SUCCESS' | 'REJECTED' | 'FAILED';
  refund_reference: string | null;
}

export interface ApprovalEvidence {
  order_verified: boolean;
  carrier_status: CarrierStatus;
  carrier_details: string;
  customer_email?: string;
  purchase_date?: string;
  order_amount?: number;
}

export interface ApprovalRequestPayload {
  id: string;
  action: 'REFUND';
  order_id: string;
  amount: number;
  currency: string;
  reason: string;
  evidence: ApprovalEvidence;
  requires_human_approval: boolean;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ToolCallLog {
  id: string;
  tool_name: 'query_database' | 'check_shipping_carrier_api' | 'initiate_stripe_refund';
  input_params: Record<string, any>;
  output_result: Record<string, any>;
  timestamp: string;
  status: 'success' | 'error' | 'paused';
  duration_ms: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ToolCallLog[];
  approvalRequest?: ApprovalRequestPayload;
  isPauseState?: boolean;
  decisionNode?: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  caseType: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  orderId: string;
  badge: string;
  badgeColor: string;
  description: string;
  initialPrompt: string;
  expectedOutcome: string;
}
