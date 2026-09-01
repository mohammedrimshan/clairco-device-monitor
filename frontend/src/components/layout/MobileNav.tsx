import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems } from "@/config/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
