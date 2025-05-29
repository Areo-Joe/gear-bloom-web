import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Home, List, Info, Menu, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navItems: NavItem[] = [
  {
    title: "首页",
    href: "/",
    icon: Home,
    description: "回到主页",
  },
  {
    title: "列表",
    href: "/list",
    icon: List,
    description: "查看所有项目",
  },
  {
    title: "关于",
    href: "/about",
    icon: Info,
    description: "了解更多信息",
  },
];

const SidebarContent: React.FC<{ onLinkClick?: () => void }> = ({
  onLinkClick,
}) => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">GB</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Gear Bloom</h2>
            <p className="text-sm text-muted-foreground">Web Application</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              导航
            </h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onLinkClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                      isActive &&
                        "bg-accent text-accent-foreground font-medium",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.title}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Desktop Sidebar
export const DesktopSidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "hidden lg:flex lg:flex-col lg:border-r lg:bg-background",
        className,
      )}
    >
      <SidebarContent />
    </div>
  );
};

// Mobile Sidebar (using Sheet)
export const MobileSidebar: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

// Combined Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <>
      <DesktopSidebar className={className} />
      <MobileSidebar />
    </>
  );
};
