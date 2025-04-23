import { FeatureCard } from "@/types";
import {
  FaCalendarAlt,
  FaBolt,
  FaLayerGroup,
  FaUserShield,
  FaMobileAlt,
  FaMoon,
  FaUsersCog,
  FaBell,
} from "react-icons/fa";

export const homeTabs = [
  {
    name: "Home",
    id: "/",
  },
  {
    name: "Features",
    id: "#features",
  },
  {
    name: "FAQs",
    id: "#faq",
  },
  {
    name: "About",
    id: "/about-me",
  },
  {
    name: "Contact",
    id: "#contact",
  },
];

export const faqs = [
  {
    id: 1,
    question: "What is Collaro used for?",
    answer:
      "Collaro helps teams collaborate within workspaces using real-time discussions, task tracking, and community features—all in one place.",
  },
  {
    question: "How do I create a workspace?",
    answer:
      "Click on 'Create Workspace' from the dashboard, give it a name, and invite your team members to join.",
  },
  {
    question: "Is there a way to manage roles and permissions?",
    answer:
      "Workspace admins can manage roles, invite or remove members, and control access to features like settings and integrations.",
  },
  {
    question: "Can I access Collaro on mobile?",
    answer:
      "Yes! Collaro is fully responsive and works well on both desktop and mobile browsers.",
  },
  {
    question: "How do notifications work?",
    answer:
      "You'll receive in-app toasts and updates when you're mentioned, added to a workspace, or a new thread is created.",
  },
  {
    question: "Is there a dark mode available?",
    answer:
      "Yes, Collaro supports dark mode. You can toggle it from the user settings panel.",
  },
  {
    question: "Do I need to sign up to view a workspace?",
    answer:
      "Yes, Collaro uses authentication to ensure workspaces remain private and secure—only invited members can access them.",
  },
];

export const featureCard: FeatureCard[] = [
  {
    icon: FaLayerGroup,
    title: "Workspace Based Structure",
    description:
      "Each workspace acts like its own private collaboration space.",
  },
  {
    icon: FaBolt,
    title: "Instant Meetings",
    description:
      "Need to jump on a quick call? Start an instant meeting with a single click and invite workspace members.",
  },
  {
    icon: FaCalendarAlt,
    title: "Schedule Team Meetings",
    description:
      "Pick a time, choose workspace members, and schedule a virtual meeting with automatic reminders for attendees.",
  },
  {
    icon: FaUserShield,
    title: "Role-Based Access",
    description:
      "Protect sensitive actions—like workspace settings or integrations—by giving access only to workspace admins.",
  },
  {
    icon: FaUsersCog,
    title: "Team-Centric Features",
    description:
      "Everything is centered around the workspace team—from meetings to settings to member roles.",
  },
  {
    icon: FaMobileAlt,
    title: "Mobile-Friendly Interface",
    description:
      "Collaro is built to work beautifully on any device—whether you're on a phone, tablet, or desktop.",
  },
  {
    icon: FaMoon,
    title: "Dark Mode Support",
    description:
      "Reduce eye strain and match your vibe with a clean, distraction-free dark mode experience.",
  },
  {
    icon: FaBell,
    title: "Stay Notified",
    description:
      "Get real-time notifications for messages, mentions, and updates, so you never miss an important conversation.",
  },
];

export const clients = [...new Array(10)].map((click, index: number) => ({
  href: `/home/${index + 1}.png`,
}));
