import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await request.json();

    // Validate the input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment verification parameters",
        },
        { status: 400 },
      );
    }

    // Verify the payment signature
    const verificationResponse = await verifyPaymentSignature({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    if (!verificationResponse.success) {
      return NextResponse.json(
        { success: false, error: verificationResponse.error },
        { status: 500 },
      );
    }

    // Check if signature is valid
    if (!verificationResponse.data?.verified) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed - invalid signature",
        },
        { status: 400 },
      );
    }

    // Signature is valid, payment is successful
    // Here you would update your database to mark the order as paid

    return NextResponse.json(
      { success: true, data: { verified: true } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
