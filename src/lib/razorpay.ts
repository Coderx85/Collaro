// Razorpay integration utility
import Razorpay from "razorpay";
import crypto from "crypto";
import { RazorpayResponse } from "@/types/razorpay";

// Initialize Razorpay with API keys from environment variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createOrder = async ({
  amount,
  currency = "INR",
  receipt,
}: {
  amount: number; // in smallest currency unit (paise for INR)
  currency?: string;
  receipt: string;
}): Promise<RazorpayResponse<any>> => {
  try {
    const options = {
      amount, // amount in smallest currency unit
      currency,
      receipt, // unique identifier for your system
    };

    const order = await razorpayInstance.orders.create(options);
    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error: "Failed to create payment order" };
  }
};

export const verifyPaymentSignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): RazorpayResponse<{ verified: boolean }> => {
  try {
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET || "");

    const generatedSignature = hmac
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Check if the signatures match
    return {
      success: generatedSignature === razorpay_signature,
      data: { verified: generatedSignature === razorpay_signature },
    };
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return { success: false, error: "Failed to verify payment signature" };
  }
};

// Create a subscription plan
export const createPlan = async ({
  name,
  description,
  amount,
  interval = "monthly",
  period = 1,
}: {
  name: string;
  description: string;
  amount: number;
  interval?: "daily" | "weekly" | "monthly" | "yearly";
  period?: number;
}): Promise<RazorpayResponse<any>> => {
  try {
    // Convert interval and period as per Razorpay API requirements
    const apiInterval = period;
    const apiPeriod = interval;

    const planOptions = {
      period: apiPeriod,
      interval: apiInterval,
      item: {
        name,
        description,
        amount,
        currency: "INR",
      },
    };

    const plan = await razorpayInstance.plans.create(planOptions);

    return { success: true, data: plan };
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return { success: false, error: "Failed to create subscription plan" };
  }
};

// Create a subscription for a customer
export const createSubscription = async ({
  planId,
  customerId,
  totalCount = 12, // Default to 12 billing cycles
  startAt,
  notes,
}: {
  planId: string;
  customerId: string;
  totalCount?: number;
  startAt?: number; // Timestamp
  notes?: Record<string, any>;
}): Promise<RazorpayResponse<any>> => {
  try {
    const subscriptionOptions: any = {
      plan_id: planId,
      customer_id: customerId,
      total_count: totalCount,
      notify_info: {
        notify_phone: true,
        notify_email: true,
      },
    };

    // Add optional parameters if provided
    if (startAt) {
      subscriptionOptions.start_at = startAt;
    }

    if (notes) {
      subscriptionOptions.notes = notes;
    }

    const subscription =
      await razorpayInstance.subscriptions.create(subscriptionOptions);

    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { success: false, error: "Failed to create subscription" };
  }
};

// Create a customer
export const createCustomer = async ({
  name,
  email,
  contact,
  notes,
}: {
  name: string;
  email: string;
  contact: string;
  notes?: Record<string, any>;
}): Promise<RazorpayResponse<any>> => {
  try {
    const customerOptions: any = {
      name,
      email,
      contact,
    };

    if (notes) {
      customerOptions.notes = notes;
    }

    const customer = await razorpayInstance.customers.create(customerOptions);

    return { success: true, data: customer };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Failed to create customer" };
  }
};

// Get subscription details
export const getSubscription = async (
  subscriptionId: string,
): Promise<RazorpayResponse<any>> => {
  try {
    const subscription =
      await razorpayInstance.subscriptions.fetch(subscriptionId);
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return { success: false, error: "Failed to fetch subscription details" };
  }
};

// Cancel a subscription
export const cancelSubscription = async (
  subscriptionId: string,
  cancelAtCycleEnd = false,
): Promise<RazorpayResponse<any>> => {
  try {
    const subscription = await razorpayInstance.subscriptions.cancel(
      subscriptionId,
      cancelAtCycleEnd,
    );
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
};

// Update a subscription
export const updateSubscription = async (
  subscriptionId: string,
  options: any,
): Promise<RazorpayResponse<any>> => {
  try {
    const subscription = await razorpayInstance.subscriptions.update(
      subscriptionId,
      options,
    );
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error: "Failed to update subscription" };
  }
};

// Pause a subscription
export const pauseSubscription = async (
  subscriptionId: string,
  pauseAt: "now",
): Promise<RazorpayResponse<any>> => {
  try {
    const subscription = await razorpayInstance.subscriptions.pause(
      subscriptionId,
      { pause_at: pauseAt },
    );
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error pausing subscription:", error);
    return { success: false, error: "Failed to pause subscription" };
  }
};

// Resume a subscription
export const resumeSubscription = async (
  subscriptionId: string,
): Promise<RazorpayResponse<any>> => {
  try {
    const subscription =
      await razorpayInstance.subscriptions.resume(subscriptionId);
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return { success: false, error: "Failed to resume subscription" };
  }
};

export default razorpayInstance;
