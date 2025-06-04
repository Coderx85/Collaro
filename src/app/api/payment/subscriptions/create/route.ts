import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from "@/lib/razorpay";
import { CreateSubscriptionRequest } from "@/types/razorpay";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createOrGetCustomer,
  createOrGetPlan,
  createSubscriptionInDb,
} from "@/lib/subscriptionDb";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const {
      name,
      email,
      contact,
      planName,
      planDescription,
      amount,
      interval = "monthly",
      // period = 1,
      notes,
    }: CreateSubscriptionRequest = await request.json();

    // Validate the input
    if (!name || !email || !contact || !planName || !amount) {
      console.error("Missing required subscription parameters:", {
        name,
        email,
        contact,
        planName,
        amount,
        interval,
      });
      return NextResponse.json(
        { success: false, error: "Missing required subscription parameters" },
        { status: 400 },
      );
    }

    // Find the user in our database
    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, userId),
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 },
      );
    }

    // 1. Create or get customer in both Razorpay and our database
    const customerDbResponse = await createOrGetCustomer({
      userId: dbUser.id,
      name,
      email,
      contact,
      notes: notes?.customer,
    });

    if (!customerDbResponse.success || !customerDbResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: customerDbResponse.error || "Failed to create customer",
        },
        { status: 500 },
      );
    }

    // Get customer ID for Razorpay API
    const customerId = customerDbResponse.data.razorpayCustomerId; // 2. Create or get plan in our database
    const planDbResponse = await createOrGetPlan({
      name: planName,
      description: planDescription || `Subscription plan for ${name}`,
      amount: amount * 100, // Convert to paise
      interval,
      intervalCount: 1,
      features: [],
    });

    if (!planDbResponse.success || !planDbResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: planDbResponse.error || "Failed to create plan",
        },
        { status: 500 },
      );
    }

    // Extract the Razorpay IDs
    const planId = planDbResponse.data.razorpayPlanId;

    if (!planId || !customerId) {
      return NextResponse.json(
        { success: false, error: "Failed to generate plan or customer ID" },
        { status: 500 },
      );
    } // 3. Create a subscription in Razorpay
    const subscriptionResponse = await createSubscription({
      planId,
      customerId,
      totalCount: 12, // Default to 12 billing cycles
      notes: notes?.subscription,
    });

    if (!subscriptionResponse.success || !subscriptionResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionResponse.error || "Failed to create subscription",
        },
        { status: 500 },
      );
    }

    // 4. Store the subscription in our database
    const subscriptionDbResponse = await createSubscriptionInDb({
      userId: dbUser.id,
      planId: planDbResponse.data.id,
      customerId: customerDbResponse.data.id,
      razorpaySubscriptionId: subscriptionResponse.data.id,
      status: subscriptionResponse.data.status,
      currentPeriodStart: new Date(),
      currentPeriodEnd: subscriptionResponse.data.current_end
        ? new Date(subscriptionResponse.data.current_end * 1000)
        : undefined,
      metadata: { notes: notes?.subscription },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          customer: customerDbResponse.data,
          plan: planDbResponse.data,
          subscription: subscriptionResponse.data,
          dbSubscription: subscriptionDbResponse.data,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
