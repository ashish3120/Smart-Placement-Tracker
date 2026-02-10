import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/opportunities": "Opportunities",
  "/preparation": "Preparation Hub",
  "/profile": "Profile & Settings",
};

export function AppLayout() {
  const location = useLocation();
  const baseRoute = "/" + (location.pathname.split("/")[1] || "");
  const title = pageTitles[baseRoute] || "Detail";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0 sticky top-0 z-10 backdrop-blur-sm bg-card/80">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-urgent))]" />
            </Button>
          </header>
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
