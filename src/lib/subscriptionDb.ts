import { db } from "@/db";
import {
  razorpayCustomersTable,
  subscriptionPlansTable,
  subscriptionsTable,
  subscriptionPaymentsTable,
  usersTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  createCustomer as razorpayCreateCustomer,
  createPlan as razorpayCreatePlan,
  getSubscription,
} from "./razorpay";

// Create or retrieve Razorpay customer
export async function createOrGetCustomer({
  userId,
  name,
  email,
  contact,
  notes,
}: {
  userId: string;
  name: string;
  email: string;
  contact: string;
  notes?: Record<string, any>;
}) {
  try {
    // Check if customer already exists for this user
    const existingCustomer = await db.query.razorpayCustomersTable.findFirst({
      where: eq(razorpayCustomersTable.userId, userId),
    });

    if (existingCustomer) {
      return { success: true, data: existingCustomer };
    }

    // Create new customer in Razorpay
    const razorpayResponse = await razorpayCreateCustomer({
      name,
      email,
      contact,
      notes,
    });

    if (!razorpayResponse.success || !razorpayResponse.data) {
      return {
        success: false,
        error: razorpayResponse.error || "Failed to create customer",
      };
    }

    // Store customer in database
    const newCustomer = await db
      .insert(razorpayCustomersTable)
      .values({
        userId,
        razorpayCustomerId: razorpayResponse.data.id,
        name,
        email,
        contact,
        notes,
      })
      .returning();

    return { success: true, data: newCustomer[0] };
  } catch (error) {
    console.error("Error creating or getting customer:", error);
    return { success: false, error: "Failed to process customer data" };
  }
}

// Create or retrieve subscription plan
export async function createOrGetPlan({
  name,
  description,
  amount,
  interval = "monthly",
  intervalCount = 1,
  features = [],
}: {
  name: string;
  description: string;
  amount: number;
  interval?: "daily" | "weekly" | "monthly" | "yearly";
  intervalCount?: number;
  features?: string[];
}) {
  try {
    // Check if plan already exists
    const existingPlan = await db.query.subscriptionPlansTable.findFirst({
      where: and(
        eq(subscriptionPlansTable.name, name),
        eq(subscriptionPlansTable.amount, amount),
        eq(subscriptionPlansTable.interval, interval),
      ),
    });

    if (existingPlan) {
      return { success: true, data: existingPlan };
    }

    // Create new plan in Razorpay
    const razorpayResponse = await razorpayCreatePlan({
      name,
      description,
      amount,
      interval,
      period: intervalCount,
    });

    if (!razorpayResponse.success || !razorpayResponse.data) {
      return {
        success: false,
        error: razorpayResponse.error || "Failed to create plan",
      };
    }

    // Store plan in database
    const newPlan = await db
      .insert(subscriptionPlansTable)
      .values({
        razorpayPlanId: razorpayResponse.data.id,
        name,
        description,
        amount,
        interval,
        intervalCount,
        features,
      })
      .returning();

    return { success: true, data: newPlan[0] };
  } catch (error) {
    console.error("Error creating or getting plan:", error);
    return { success: false, error: "Failed to process plan data" };
  }
}

// Create a subscription
export async function createSubscriptionInDb({
  userId,
  planId,
  customerId,
  razorpaySubscriptionId,
  status,
  currentPeriodStart,
  currentPeriodEnd,
  metadata,
}: {
  userId: string;
  planId: string;
  customerId: string;
  razorpaySubscriptionId: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  metadata?: Record<string, any>;
}) {
  try {
    const newSubscription = await db
      .insert(subscriptionsTable)
      .values({
        userId,
        planId,
        customerId,
        razorpaySubscriptionId,
        status: status as any,
        currentPeriodStart,
        currentPeriodEnd,
        metadata,
      })
      .returning();

    return { success: true, data: newSubscription[0] };
  } catch (error) {
    console.error("Error creating subscription in DB:", error);
    return { success: false, error: "Failed to store subscription data" };
  }
}

// Update subscription status
export async function updateSubscriptionStatus(
  razorpaySubscriptionId: string,
  status: string,
  endDate?: Date,
) {
  try {
    const updatedData: any = {
      status: status as any,
      updatedAt: new Date(),
    };

    if (status === "cancelled" || status === "halted") {
      updatedData.cancelledAt = new Date();
    }

    if (endDate) {
      updatedData.currentPeriodEnd = endDate;
    }

    const updatedSubscription = await db
      .update(subscriptionsTable)
      .set(updatedData)
      .where(
        eq(subscriptionsTable.razorpaySubscriptionId, razorpaySubscriptionId),
      )
      .returning();

    return { success: true, data: updatedSubscription[0] };
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return { success: false, error: "Failed to update subscription status" };
  }
}

// Record a subscription payment
export async function recordSubscriptionPayment({
  subscriptionId,
  razorpayPaymentId,
  amount,
  currency = "INR",
  status,
  invoiceId,
  paymentMethod,
  metadata,
}: {
  subscriptionId: string;
  razorpayPaymentId: string;
  amount: number;
  currency?: string;
  status: string;
  invoiceId?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const payment = await db
      .insert(subscriptionPaymentsTable)
      .values({
        subscriptionId,
        razorpayPaymentId,
        amount,
        currency,
        status,
        invoiceId,
        paymentMethod,
        metadata,
      })
      .returning();

    return { success: true, data: payment[0] };
  } catch (error) {
    console.error("Error recording subscription payment:", error);
    return { success: false, error: "Failed to record payment data" };
  }
}

// Get user subscriptions
export async function getUserSubscriptions(userId: string) {
  try {
    const subscriptions = await db.query.subscriptionsTable.findMany({
      where: eq(subscriptionsTable.userId, userId),
      with: {
        plan: true,
      },
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
    });

    // Enrich with latest data from Razorpay
    const enrichedSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const razorpayData = await getSubscription(
            subscription.razorpaySubscriptionId,
          );
          if (razorpayData.success && razorpayData.data) {
            // Update the subscription in DB if status has changed
            if (razorpayData.data.status !== subscription.status) {
              await updateSubscriptionStatus(
                subscription.razorpaySubscriptionId,
                razorpayData.data.status,
                razorpayData.data.current_end
                  ? new Date(razorpayData.data.current_end * 1000)
                  : undefined,
              );
            }
            return {
              ...subscription,
              razorpayData: razorpayData.data,
            };
          }
          return subscription;
        } catch (error) {
          console.error(
            `Error fetching Razorpay data for subscription ${subscription.id}:`,
            error,
          );
          return subscription;
        }
      }),
    );

    return { success: true, data: enrichedSubscriptions };
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return { success: false, error: "Failed to fetch subscriptions" };
  }
}

// Get user subscriptions by Clerk ID
export async function getUserSubscriptionsByClerkId(clerkId: string) {
  try {
    // First, find the user by Clerk ID
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Then fetch subscriptions for that user
    return getUserSubscriptions(user.id);
  } catch (error) {
    console.error("Error fetching user subscriptions by Clerk ID:", error);
    return { success: false, error: "Failed to fetch subscriptions" };
  }
}

// Get customer by Clerk ID
export async function getCustomerByClerkId(clerkId: string) {
  try {
    // Find the user by Clerk ID
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the customer record for this user
    const customer = await db.query.razorpayCustomersTable.findFirst({
      where: eq(razorpayCustomersTable.userId, user.id),
    });

    if (!customer) {
      return { success: false, error: "Customer record not found" };
    }

    return { success: true, data: customer };
  } catch (error) {
    console.error("Error fetching customer by Clerk ID:", error);
    return { success: false, error: "Failed to fetch customer data" };
  }
}

// Get subscription by ID
export async function getSubscriptionById(subscriptionId: string) {
  try {
    const subscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.id, subscriptionId),
      with: {
        plan: true,
      },
    });

    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }

    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    return { success: false, error: "Failed to fetch subscription details" };
  }
}
