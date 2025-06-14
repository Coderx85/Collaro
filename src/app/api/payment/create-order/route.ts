import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/razorpay";
import { APIResponse } from "@/types";
import { RazorpayOrder } from "@/types/razorpay";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<APIResponse<RazorpayOrder>>> {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    // Validate the input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount specified",
        },
        { status: 400 },
      );
    }

    // Create Razorpay order
    const orderResponse = await createOrder({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    });

    if (!orderResponse.success) {
      return NextResponse.json(
        { success: false, error: orderResponse.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: orderResponse.data },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}
