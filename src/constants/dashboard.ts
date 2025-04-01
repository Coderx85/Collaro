import { FeatureCard } from "@/types";
import {
  FaVideo,
  FaComments,
  FaUsers,
  FaFileUpload,
  FaBell,
  FaCogs,
  FaShieldAlt,
  FaGlobe,
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
    id: "/contact",
  },
];

export const faqs = [
  {
    question: "How do I start a video call?",
    answer:
      "Click on the 'Start Call' button, select participants, and begin your video session instantly.",
  },
  {
    question: "Is my data secure on this platform?",
    answer:
      "Yes, we use end-to-end encryption to keep your conversations and files safe from unauthorized access.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Absolutely! Our platform is fully responsive and works seamlessly on mobile, tablets, and desktops.",
  },
  {
    question: "How do I share files during a chat?",
    answer:
      "Click on the attachment icon in the chat box, select your file, and send it instantly.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No installation required! You can access everything directly from your web browser.",
  },
  {
    question: "How do I join a developer community?",
    answer:
      "Go to the 'Communities' tab, browse available groups, and click 'Join' to connect with like-minded developers.",
  },
];

export const featureCard: FeatureCard[] = [
  {
    icon: FaVideo,
    title: "Easy Video Calls",
    description:
      "Start high-quality video calls instantly with just one click. No complicated setup required, just connect and talk!",
  },
  {
    icon: FaComments,
    title: "Instant Messaging",
    description:
      "Chat with developers in real-time, share ideas, and keep all conversations in one place for better collaboration.",
  },
  {
    icon: FaUsers,
    title: "Join Developer Communities",
    description:
      "Find and join groups of like-minded developers, work on projects together, and share your expertise with others.",
  },
  {
    icon: FaFileUpload,
    title: "Simple File Sharing",
    description:
      "Easily upload and share files, code snippets, and documents with your team in just a few clicks.",
  },
  {
    icon: FaBell,
    title: "Stay Notified",
    description:
      "Get real-time notifications for messages, mentions, and updates, so you never miss an important conversation.",
  },
  {
    icon: FaCogs,
    title: "Personalized Experience",
    description:
      "Customize your profile, set preferences, and tailor your experience to fit your workflow and communication style.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Private",
    description:
      "End-to-end encryption and privacy settings ensure your conversations and data stay safe and protected.",
  },
  {
    icon: FaGlobe,
    title: "Use Anywhere",
    description:
      "Access your chats, files, and calls from your desktop, tablet, or mobile device—stay connected on the go!",
  },
];
