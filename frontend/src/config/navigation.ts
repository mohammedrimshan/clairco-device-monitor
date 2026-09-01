import { LayoutDashboard, Server } from "lucide-react";
import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Devices", href: "/devices", icon: Server },
];
