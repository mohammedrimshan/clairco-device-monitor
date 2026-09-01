import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 md:border-r md:bg-white">
        <AppSidebar />
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top header — hidden on md and above */}
        <header className="md:hidden sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              C
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">
              Clairco
            </span>
          </div>
          <MobileNav />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
