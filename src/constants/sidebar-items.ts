import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Settings,
  HelpCircle,
  Search,
  FileText,
  PieChart,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarData {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItem[];
  navSecondary: NavItem[];
}

export const data: SidebarData = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderOpen,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
  ],
};
