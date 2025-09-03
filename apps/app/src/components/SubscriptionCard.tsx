import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import { Badge } from "@repo/design/components/ui/badge";
import { Button } from "@repo/design/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubscriptionCardProps {
  subscription: any;
  onCancelSubscription?: (subscriptionId: string) => Promise<void>;
  isLoading?: boolean;
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseInt(amount, 10) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(numAmount / 100);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600";
    case "authenticated":
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "halted":
    case "cancelled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onCancelSubscription,
  isLoading = false,
}) => {
  const handleCancel = async () => {
    if (onCancelSubscription && !isLoading) {
      await onCancelSubscription(subscription.id);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{subscription.plan_id}</CardTitle>
            <CardDescription>ID: {subscription.id}</CardDescription>
          </div>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Period</p>
            <p className="font-medium">
              {formatDate(subscription.current_start)} -{" "}
              {formatDate(subscription.current_end)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Billing Cycles</p>
            <p className="font-medium">
              {subscription.paid_count} / {subscription.total_count}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Next Charge</p>
          <p className="font-medium">
            {subscription.charge_at
              ? formatDate(subscription.charge_at)
              : "N/A"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-xl font-semibold">
            {subscription.plan_id && subscription.plan_id.amount
              ? formatCurrency(subscription.plan_id.amount)
              : "Contact support"}
          </p>
        </div>
        {subscription.status !== "cancelled" && onCancelSubscription && (
          <Button
            onClick={handleCancel}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
