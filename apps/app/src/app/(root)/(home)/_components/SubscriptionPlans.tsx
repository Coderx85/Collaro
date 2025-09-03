"use client";

import { useState } from "react";
import { Button } from "@repo/design/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaRupeeSign } from "react-icons/fa";
import { plans } from "@/constants/subscription";

export default function SubscriptionPlans() {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-lg sm:text-xl flex md:text-4xl font-bold text-center mb-4 sm:mb-6 justify-center">
        <FaRupeeSign className="text-4xl mr-3 dark:text-yellow text-black p-1 bg-white/50 rounded-full" />{" "}
        Frequently Asked Questions
      </h2>
      {/* Billing toggle */}
      <div className="flex justify-center mb-8 gap-2 border-2 w-fit mx-auto p-1 rounded-lg text-black dark:text-white">
        <Button
          className={`rounded-r-none ${billingInterval === "monthly" ? "bg-primary dark:bg-primary hover:bg-primary/90 text-white" : ""}`}
          onClick={() => setBillingInterval("monthly")}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setBillingInterval("yearly")}
          className={`rounded-l-none ${billingInterval === "yearly" ? "bg-primary dark:bg-primary hover:bg-primary/90 text-white" : ""}`}
        >
          Yearly
          {/* <span className="ml-1 text-xs opacity-80">Save 15%</span> */}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col border-2 bg-black/5 dark:bg-gradient-to-b dark:from-primary/50 dark:to-primary/25 ${
              plan.highlighted
                ? "border-yellow dark:border-yellow shadow-lg shadow-primary/20"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-3xl font-semibold text-primary">
                <plan.icon className="size-5 mr-2" />
                {plan.name}
              </CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold text-black dark:text-white">
                  ₹{plan.price}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {plan.interval}
                </span>
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-black dark:text-white"
                  >
                    <FaCheck className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${plan.highlighted ? "bg-primary dark:bg-primary hover:bg-primary/90" : ""}`}
                variant={"outline"}
                onClick={() => {
                  if (plan.id === "enterprise") {
                    router.push("/contact-us");
                  } else {
                    router.push("/payment");
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Need a custom plan? Have specific requirements?
        </p>
        <Link href="/contact-us">
          <Button variant="outline">Contact Our Sales Team</Button>
        </Link>
      </div>
    </div>
  );
}
