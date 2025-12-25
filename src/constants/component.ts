import type { SidebarLink } from "@/types";
import {
  IconCalendarTime,
  IconFolder,
  IconHistory,
  IconLayoutDashboard,
  IconSettings,
  IconUserCircle,
  IconUserPentagon,
  IconUsers,
  IconUsersGroup,
  IconVideoFilled,
} from "@tabler/icons-react";

export const sidebarLinks: SidebarLink[] = [
  {
    route: "/workspace-settings",
    label: "Workspace Settings",
    details: "Manage workspace settings (Admin/Owner only)",
    component: IconSettings,
    adminRoute: true,
  },
  {
    component: IconUserPentagon,
    label: "Admin",
    route: "/admin",
    details: "Manage workspace settings and permissions",
    adminRoute: true,
  },
  {
    route: "",
    label: "Home",
    details: "This is the home page",
    component: IconLayoutDashboard,
    adminRoute: false,
  },
  {
    route: "/workspace-details",
    label: "Workspace",
    details: "View and manage workspace details",
    component: IconUsersGroup,
    adminRoute: false,
  },
  {
    route: "/upcoming",
    label: "Scheduled",
    details: "List of upcoming meetings",
    component: IconCalendarTime,
    adminRoute: false,
  },
  {
    route: "/previous",
    label: "History",
    details: "List of previous meetings",
    component: IconHistory,
    adminRoute: false,
  },
  {
    route: "/recordings",
    label: "Recordings",
    details: "List of recordings",
    component: IconVideoFilled,
    adminRoute: false,
  },
  {
    route: "/personal-room",
    label: "User",
    details: "User Personal detail",
    component: IconUserCircle,
    adminRoute: false,
  },
];
