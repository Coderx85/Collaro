import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type {
  SubscriptionPlanDetails,
  SubscriptionUserDetails,
} from "@/types/razorpay";

interface RazorpaySubscriptionProps {
  plan: SubscriptionPlanDetails;
  userDetails: SubscriptionUserDetails;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpaySubscription: React.FC<RazorpaySubscriptionProps> = ({
  plan,
  userDetails,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
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

  const createSubscription = async () => {
    setLoading(true);

    try {
      // Validate user details
      if (!userDetails.name || !userDetails.email || !userDetails.contact) {
        throw new Error("Please provide all required user details");
      }

      // Create subscription on the server
      const response = await fetch("/api/payment/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
          planName: plan.title,
          planDescription: plan.description,
          amount: plan.price,
          interval: plan.interval || "monthly",
          notes: userDetails.notes,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create subscription");
      }
      setProcessingPayment(true);

      // Open Razorpay payment if a hosted URL is available
      if (data.data?.subscription?.short_url) {
        window.open(data.data.subscription.short_url, "_blank");

        toast({
          title: "Subscription Created",
          description: "Please complete the payment in the new tab",
          duration: 5000,
        });

        // Wait a bit before considering it successful
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(data.data);
          }
          setProcessingPayment(false);
        }, 1500);
      } else {
        // Fall back to creating a manual payment link with Razorpay checkout
        handleManualPayment(data.data);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
        variant: "destructive",
        duration: 5000,
      });

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = (subscriptionData: any) => {
    try {
      const subscription = subscriptionData.subscription;

      if (!subscription || !subscription.id) {
        throw new Error("Subscription data is incomplete");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        subscription_id: subscription.id,
        name: plan.title,
        description: plan.description,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        notes: {
          subscription_id: subscription.id,
        },
        handler: async (response: any) => {
          try {
            // Verify subscription payment with our server
            const verifyResponse = await fetch(
              "/api/payment/subscriptions/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error(
                verifyData.error || "Payment verification failed",
              );
            }

            toast({
              title: "Payment Successful",
              description: "Your subscription is now active",
              duration: 5000,
            });

            setProcessingPayment(false);

            if (onSuccess) {
              onSuccess({
                ...subscriptionData,
                payment: response,
                verified: true,
              });
            }
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

            setProcessingPayment(false);

            if (onError) onError(error);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
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
      console.error("Manual payment error:", error);
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
        variant: "destructive",
        duration: 5000,
      });

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Card className="w-[300px] shadow-lg">
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
        <CardDescription>
          ₹{plan.price}/{plan.interval === "yearly" ? "yr" : "mo"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>{" "}
      <CardFooter>
        <Button
          onClick={createSubscription}
          disabled={loading || processingPayment}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Subscription...
            </>
          ) : processingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Subscribe Now`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RazorpaySubscription;
