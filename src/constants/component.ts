import { SidebarLink } from "@/types";
import {
  IconCalendarTime,
  IconFolder,
  IconHistory,
  IconLayoutDashboard,
  IconSettings,
  IconUserCircle,
  IconUserPentagon,
  IconUsers,
  IconVideoFilled,
} from "@tabler/icons-react";

export const sidebarLinks: SidebarLink[] = [
  {
    route: "",
    label: "Home",
    details: "This is the home page",
    component: IconLayoutDashboard,
    adminRoute: false,
  },
  {
    route: "/workspace-room",
    label: "Room",
    details: "Workspace Room detail",
    component: IconFolder,
    adminRoute: true,
  },
  {
    component: IconUsers,
    label: "Members",
    route: "/members",
    details: "View and manage workspace members",
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
  {
    route: "/setting",
    label: "Settings",
    details: "User settings",
    component: IconSettings,
    adminRoute: false,
  },
];
