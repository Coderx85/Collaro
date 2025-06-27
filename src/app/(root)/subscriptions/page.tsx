"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw } from "lucide-react";

export default function SubscriptionsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      // If we have a customerId use it, otherwise let the API try to find it
      const url = customerId
        ? `/api/payment/subscriptions/user?customerId=${customerId}`
        : "/api/payment/subscriptions/user";

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch subscriptions");
      }

      // If the response included a customer ID, save it for future requests
      if (data.data?.customer_id && !customerId) {
        setCustomerId(data.data.customer_id);
      }

      setSubscriptions(data.data.items || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Failed to Load Subscriptions",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
        duration: 5000,
      });
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, toast]);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user, fetchSubscriptions]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancellingId(subscriptionId);
    try {
      const response = await fetch("/api/payment/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully",
        duration: 5000,
      });

      // Update subscriptions list
      fetchSubscriptions();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Failed to Cancel",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    switch (activeTab) {
      case "active":
        return ["active", "authenticated", "pending"].includes(sub.status);
      case "cancelled":
        return ["halted", "cancelled"].includes(sub.status);
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <Button
          onClick={fetchSubscriptions}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="active" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading subscriptions...</span>
        </div>
      ) : filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onCancelSubscription={handleCancelSubscription}
              isLoading={cancellingId === subscription.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-3">No Subscriptions Found</h3>
          <p className="text-gray-500 mb-6">
            You don&ampt have any {activeTab !== "all" && activeTab}{" "}
            subscriptions yet.
          </p>
          <Button
            onClick={() => (window.location.href = "/payment")}
            className="bg-primary hover:bg-primary/90"
          >
            Browse Subscription Plans
          </Button>
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Need Help With Your Subscription?
        </h2>
        <p className="text-gray-500 mb-4">
          If you have any questions or need assistance with your subscriptions,
          please contact our support team.
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  );
}
