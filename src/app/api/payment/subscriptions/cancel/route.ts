import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cancelSubscription } from "@/lib/razorpay";
import { db } from "@/db";
import { subscriptionsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateSubscriptionStatus } from "@/lib/subscriptionDb";

export async function POST(request: NextRequest) {
  try {
    const user = await auth();
    const userId = user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { subscriptionId, cancelAtCycleEnd = false } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 },
      );
    }

    // Cancel the subscription using Razorpay
    const result = await cancelSubscription(subscriptionId, cancelAtCycleEnd);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to cancel subscription",
        },
        { status: 500 },
      );
    }
    // Update subscription status in our database
    try {
      if (result.data && result.data.id) {
        const subscriptionId = result.data.id;

        // Get the subscription from our database to find the user
        const subscription = await db.query.subscriptionsTable.findFirst({
          where: eq(subscriptionsTable.razorpaySubscriptionId, subscriptionId),
          with: {
            user: true,
          },
        });

        // Update the subscription status
        await updateSubscriptionStatus(subscriptionId, "cancelled");

        // Update user role if we have a user associated with this subscription
        if (subscription?.userId) {
          await db
            .update(usersTable)
            .set({
              role: "member", // Reset to basic member role
              updatedAt: new Date(),
            })
            .where(eq(usersTable.id, subscription.userId));
        }
      }
    } catch (dbError) {
      console.error("Failed to update subscription in database:", dbError);
      // Continue anyway, as the Razorpay cancellation was successful
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
