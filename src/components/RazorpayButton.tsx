import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface RazorpayButtonProps {
  amount: number;
  name: string;
  description: string;
  prefillEmail?: string;
  prefillContact?: string;
  prefillName?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  name,
  description,
  prefillEmail = "",
  prefillContact = "",
  prefillName = "",
  onSuccess,
  onFailure,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create an order on the server
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: name,
        description: description,
        order_id: orderData.data.id,
        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillContact,
        },
        handler: async function (response: any) {
          try {
            // Verify the payment on the server
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error(
                verifyData.error || "Payment verification failed",
              );
            }

            toast({
              title: "Payment Successful",
              description: `Your payment of ₹${amount} was successful.`,
              duration: 5000,
            });

            if (onSuccess) onSuccess(response);
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
              variant: "destructive",
              duration: 5000,
            });

            if (onFailure) onFailure(error);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window",
              duration: 3000,
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
        variant: "destructive",
        duration: 5000,
      });

      if (onFailure) onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className="w-full">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₹${amount}`
      )}
    </Button>
  );
};

export default RazorpayButton;
