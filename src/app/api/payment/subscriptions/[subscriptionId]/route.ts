import { NextRequest, NextResponse } from "next/server";
import { getSubscription, cancelSubscription } from "@/lib/razorpay";

// GET route to fetch subscription details
export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } },
) {
  try {
    const subscriptionId = params.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 },
      );
    }

    const subscriptionResponse = await getSubscription(subscriptionId);

    if (!subscriptionResponse.success) {
      return NextResponse.json(
        { success: false, error: subscriptionResponse.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: subscriptionResponse.data },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription details" },
      { status: 500 },
    );
  }
}

// DELETE route to cancel subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } },
) {
  try {
    const subscriptionId = params.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 },
      );
    }

    const cancelResponse = await cancelSubscription(subscriptionId);

    if (!cancelResponse.success) {
      return NextResponse.json(
        { success: false, error: cancelResponse.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: cancelResponse.data },
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
