import * as React from "react";
import { Sidebar, MobileSidebar } from "./sidebar";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <MobileSidebar />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Gear Bloom</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn("flex-1", className)}>{children}</main>
      </div>
    </div>
  );
};
