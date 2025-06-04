"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import RazorpayButton from "@/components/RazorpayButton";
import RazorpaySubscription from "@/components/RazorpaySubscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<"onetime" | "subscription">(
    "onetime",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log("Active Tab:", activeTab);

  // Set up loading states based on user auth
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      if (!user) {
        setError("Please sign in to access payment options");
        toast({
          title: "Authentication Required",
          description: "Please sign in to access payment options",
          variant: "destructive",
        });
      }
    }
  }, [isLoaded, user, toast]);

  const userDetails = user
    ? {
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        contact: user.phoneNumbers[0]?.phoneNumber || "",
      }
    : {
        name: "Guest User",
        email: "guest@example.com",
        contact: "9876543210",
      };

  // Razorpay subscription plans
  const subscriptionPlans = [
    {
      title: "Basic Plan",
      price: 499,
      description: "Perfect for individuals",
      interval: "monthly" as const,
      features: [
        "5 meeting rooms",
        "HD video quality",
        "30 mins max duration",
        "Basic support",
      ],
    },
    {
      title: "Pro Plan",
      price: 999,
      description: "For professionals and teams",
      interval: "monthly" as const,
      features: [
        "Unlimited meeting rooms",
        "Full HD video quality",
        "24-hour meeting duration",
        "Priority support",
        "Recording feature",
      ],
    },
    {
      title: "Enterprise Plan",
      price: 1999,
      description: "For larger organizations",
      interval: "monthly" as const,
      features: [
        "Unlimited everything",
        "4K video quality",
        "Unlimited meeting duration",
        "24/7 dedicated support",
        "Recording & transcription",
        "Custom branding",
      ],
    },
  ];
  const handleSubscriptionSuccess = (data: any) => {
    console.log("Subscription created successfully:", data);

    // Redirect to the subscriptions page to show the active subscription
    setTimeout(() => {
      window.location.href = "/subscriptions";
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payment Options</h1>
        <Link href="/subscriptions">
          <Button variant="outline" className="flex items-center gap-2">
            Manage Subscriptions <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="onetime" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="onetime" onClick={() => setActiveTab("onetime")}>
            One-time Payment
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            onClick={() => setActiveTab("subscription")}
          >
            Subscription
          </TabsTrigger>
        </TabsList>
        <TabsContent value="onetime">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic Plan</CardTitle>
                <CardDescription>One-time payment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">₹499</p>
                <p className="mb-4">Access to basic features for 30 days</p>
                <RazorpayButton
                  amount={499}
                  name="Collaro Basic Plan"
                  description="One-time payment for basic access"
                  prefillEmail={userDetails.email}
                  prefillName={userDetails.name}
                  prefillContact={userDetails.contact}
                  onSuccess={(response) =>
                    console.log("Payment successful", response)
                  }
                  onFailure={(error) => console.error("Payment failed", error)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>One-time payment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">₹999</p>
                <p className="mb-4">Access to premium features for 30 days</p>
                <RazorpayButton
                  amount={999}
                  name="Collaro Pro Plan"
                  description="One-time payment for premium access"
                  prefillEmail={userDetails.email}
                  prefillName={userDetails.name}
                  prefillContact={userDetails.contact}
                  onSuccess={(response) =>
                    console.log("Payment successful", response)
                  }
                  onFailure={(error) => console.error("Payment failed", error)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise Plan</CardTitle>
                <CardDescription>One-time payment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">₹1,999</p>
                <p className="mb-4">Access to all features for 30 days</p>
                <RazorpayButton
                  amount={1999}
                  name="Collaro Enterprise Plan"
                  description="One-time payment for full access"
                  prefillEmail={userDetails.email}
                  prefillName={userDetails.name}
                  prefillContact={userDetails.contact}
                  onSuccess={(response) =>
                    console.log("Payment successful", response)
                  }
                  onFailure={(error) => console.error("Payment failed", error)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="subscription">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.map((plan, index) => (
              <RazorpaySubscription
                key={index}
                plan={plan}
                userDetails={userDetails}
                onSuccess={handleSubscriptionSuccess}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Already Subscribed?</h2>
        <p className="mb-4">
          Manage your existing subscriptions, check usage, or cancel anytime.
        </p>
        <Link href="/subscriptions">
          <Button>View My Subscriptions</Button>
        </Link>
      </div>
    </div>
  );
}
