import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  User,
  GraduationCap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Opportunities", url: "/opportunities", icon: Briefcase },
  { title: "Preparation", url: "/preparation", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const u = localStorage.getItem('user');
      if (u) {
        setUser(JSON.parse(u));
      } else {
        setUser({ name: "Student", branch: "", cgpa: "" });
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('user-updated', handleUpdate);
    handleUpdate();

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('user-updated', handleUpdate);
    };
  }, []);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-primary tracking-tight">Placement Tracker</h1>
            <p className="text-[11px] text-sidebar-foreground leading-none mt-0.5">Campus 2026</p>
          </div>
        </div>
      </SidebarHeader>

      <div className="px-4">
        <Separator className="bg-sidebar-border" />
      </div>

      <SidebarContent className="pt-4 px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-medium px-3 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = item.url === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          }`}
                        activeClassName=""
                      >
                        <item.icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/40">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
            {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || 'ST'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user?.name || 'Student'}</p>
            <p className="text-[11px] text-sidebar-foreground truncate">
              {user?.branch || 'Branch N/A'} · {user?.cgpa || 'N/A'} CGPA
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
