import type { IconType } from "react-icons/lib";

// Razorpay API response types (simplified to avoid type conflicts)
export interface RazorpayBaseEntity {
  id: string;
  entity: string;
  created_at: number;
}

export interface RazorpayOrder extends RazorpayBaseEntity {
  amount: number | string;
  amount_paid: number | string;
  amount_due: number | string;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
}

export interface RazorpayPayment extends RazorpayBaseEntity {
  amount: number | string;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  amount_refunded: number | string;
  refund_status: string | null;
  email: string;
  contact: string;
  fee: number | string;
  tax: number | string;
  error_code: string | null;
  error_description: string | null;
}

export interface RazorpayCustomer extends RazorpayBaseEntity {
  name: string | undefined;
  email: string | undefined;
  contact: string | undefined;
  gstin: string | null | undefined;
  notes: Record<string, any>;
}

export interface RazorpayPlan extends RazorpayBaseEntity {
  interval: number;
  period: string;
  item: {
    id: string;
    active: boolean;
    name: string;
    description: string | undefined;
    amount: number | string;
    currency: string;
    type: string;
  };
  notes: Record<string, any>;
}

export interface RazorpaySubscription extends RazorpayBaseEntity {
  plan_id: string;
  customer_id: string | null;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, any>;
  charge_at: number;
  start_at: number;
  end_at: number | null;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  expire_by: number | null;
  short_url: string | null;
  has_scheduled_changes: boolean;
  change_scheduled_at: number | null;
  remaining_count: number;
}

// Webhook event types
export interface RazorpayWebhookEvent {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPayment;
    };
    subscription?: {
      entity: RazorpaySubscription;
    };
    order?: {
      entity: RazorpayOrder;
    };
  };
  created_at: number;
}

// Request and response types for our API
export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  email: string;
  contact: string;
  planName: string;
  planDescription: string;
  amount: number;
  interval: "daily" | "weekly" | "monthly" | "yearly";
  period?: number;
  notes?: {
    customer?: Record<string, any>;
    subscription?: Record<string, any>;
  };
}

// Additional subscription related types
export interface VerifySubscriptionRequest {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export interface SubscriptionUpdateOptions {
  plan_id?: string;
  quantity?: number;
  remaining_count?: number;
  start_at?: number;
  schedule_change_at?: "now" | "cycle_end";
  customer_notify?: boolean;
  notes?: Record<string, any>;
}

export interface SubscriptionPlanDetails {
  title: string;
  price: number;
  description: string;
  features: string[];
  interval?: "monthly" | "yearly";
}

export interface SubscriptionUserDetails {
  name: string;
  email: string;
  contact: string;
  notes?: Record<string, any>;
}

export interface SubscriptionResponse {
  success: boolean;
  data?: {
    customer: RazorpayCustomer;
    plan: string | RazorpayPlan;
    subscription: RazorpaySubscription;
  };
  error?: string;
}

// Function response types
export interface RazorpayResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// For the getAllSubscriptions endpoint
export interface ListSubscriptionsRequest {
  customerId: string;
  count?: number;
  skip?: number;
}

export interface ListSubscriptionsResponse {
  entity: string;
  count: number;
  items: RazorpaySubscription[];
}

// Define the plan types
export interface Plan {
  id: string;
  icon: IconType;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}
