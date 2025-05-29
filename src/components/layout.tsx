import * as React from "react";
import { Sidebar } from "./sidebar";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[256px_1fr] lg:min-h-screen">
        <Sidebar />
        <main className={cn("flex-1", className)}>{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Sidebar />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Gear Bloom</h1>
          </div>
        </header>
        <main className={cn("", className)}>{children}</main>
      </div>
    </div>
  );
};
