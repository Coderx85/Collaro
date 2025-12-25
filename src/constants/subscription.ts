import type { Plan } from "@/types/razorpay";
import { FaBolt, FaIndustry, FaSquare } from "react-icons/fa";

// Define the billing interval
const billingInterval = "monthly"; // Change to "yearly" as needed

// Define the subscription plans
export const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    icon: FaSquare,
    price: billingInterval === "monthly" ? 499 : 4999,
    interval: billingInterval === "monthly" ? "/month" : "/year",
    description: "Perfect for individuals and small teams",
    features: [
      "5 meeting rooms",
      "HD video quality",
      "30 mins max duration",
      "Basic support",
      "Screen sharing",
    ],
    buttonText: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    icon: FaBolt,
    price: billingInterval === "monthly" ? 999 : 9999,
    interval: billingInterval === "monthly" ? "/month" : "/year",
    description: "For professional teams with advanced needs",
    features: [
      "Unlimited meeting rooms",
      "Full HD video quality",
      "24-hour meeting duration",
      "Priority support",
      "Recording feature",
      "Custom branding",
      "Advanced analytics",
    ],
    buttonText: "Subscribe",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: FaIndustry,
    price: billingInterval === "monthly" ? 1999 : 19999,
    interval: billingInterval === "monthly" ? "/month" : "/year",
    description: "For large organizations with premium requirements",
    features: [
      "Unlimited everything",
      "4K video quality",
      "Unlimited meeting duration",
      "24/7 dedicated support",
      "Recording & transcription",
      "Custom branding & themes",
      "Advanced analytics & reporting",
      "SSO & advanced security",
      "API access",
    ],
    buttonText: "Contact Sales",
  },
];
