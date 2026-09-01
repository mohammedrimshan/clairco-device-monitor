import { NavLink } from "react-router-dom";
import { navigationItems } from "@/config/navigation";

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col py-6 px-4">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
          C
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-gray-900">Clairco</span>
          <span className="text-xs font-medium text-gray-500">
            Device Monitor
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
