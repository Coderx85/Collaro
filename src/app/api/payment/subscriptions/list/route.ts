import { NextRequest, NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpay";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 },
      );
    }

    // Fetch all subscriptions for the customer
    const subscriptions = await razorpayInstance.subscriptions.all({
      customer_id: customerId,
    });

    return NextResponse.json(
      { success: true, data: subscriptions },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
