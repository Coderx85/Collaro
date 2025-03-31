import Home from "@/components/icons/Home";
import Previous from "@/components/icons/Previous";
import Reccording from "@/components/icons/Reccording";
import Upcoming from "@/components/icons/Upcoming";
import { FaFolder, FaTools, FaUserCircle } from "react-icons/fa";
import { SidebarLink } from "@/types";
import { Users } from "lucide-react";
import { SiAdminer } from "react-icons/si";

export const sidebarLinks: SidebarLink[] = [
  {
    route: "",
    label: "Home",
    details: "This is the home page",
    component: Home,
    adminRoute: false,
  },
  {
    route: "/workspace-room",
    label: "Room",
    details: "Workspace Room detail",
    component: FaFolder,
    adminRoute: true,
  },
  {
    component: Users,
    label: "Members",
    route: "/members",
    details: "View and manage workspace members",
    adminRoute: true,
  },
  {
    component: SiAdminer,
    label: "Admin",
    route: "/admin",
    details: "Manage workspace settings and permissions",
    adminRoute: true,
  },
  {
    route: "/upcoming",
    label: "Upcoming",
    details: "List of upcoming meetings",
    component: Upcoming,
    adminRoute: false,
  },
  {
    route: "/previous",
    label: "Previous",
    details: "List of previous meetings",
    component: Previous,
    adminRoute: false,
  },
  {
    route: "/recordings",
    label: "Recordings",
    details: "List of recordings",
    component: Reccording,
    adminRoute: false,
  },
  {
    route: "/personal-room",
    label: "User",
    details: "User Personal detail",
    component: FaUserCircle,
    adminRoute: false,
  },
  {
    route: "/setting",
    label: "Settings",
    details: "User settings",
    component: FaTools,
    adminRoute: false,
  },
];
