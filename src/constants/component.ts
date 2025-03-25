import Home from "@/components/icons/Home";
import Personal from "@/components/icons/Personal";
import Previous from "@/components/icons/Previous";
import Reccording from "@/components/icons/Reccording";
import Upcoming from "@/components/icons/Upcoming";
import { FaFolder } from "react-icons/fa";
import { SidebarLink } from "@/types";
import { Users } from "lucide-react";
import { SiAdminer } from "react-icons/si";

export const sidebarLinks: SidebarLink[] = [
  {
    route: "",
    label: "Home",
    details: "This is the home page",
    component: Home,
    allowed: true,
  },
  {
    route: "/upcoming",
    label: "Upcoming",
    details: "List of upcoming meetings",
    component: Upcoming,
    allowed: true,
  },
  {
    route: "/previous",
    label: "Previous",
    details: "List of previous meetings",
    component: Previous,
    allowed: true,
  },
  {
    route: "/recordings",
    label: "Recordings",
    details: "List of recordings",
    component: Reccording,
    allowed: true,
  },
  {
    route: "/personal-room",
    label: "User",
    details: "User Personal detail",
    component: Personal,
    allowed: true,
  },
  {
    route: "/workspace-room",
    label: "Room",
    details: "Workspace Room detail",
    component: FaFolder,
    allowed: true,
  },
  {
    component: Users,
    label: "Members",
    route: "/members",
    details: "View and manage workspace members",
    allowed: false,
  },
  {
    component: SiAdminer,
    label: "Admin",
    route: "/admin",
    details: "Manage workspace settings and permissions",
    allowed: false,
  },
];
