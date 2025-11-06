import { Home, FileText, Building2, BarChart3, Settings, LogOut, Plus, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const citizenItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Complaints", url: "/complaints", icon: FileText },
    { title: "Submit Complaint", url: "/submit-complaint", icon: Plus },
  ];

  const industryItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Industries", url: "/industries", icon: Building2 },
    { title: "Compliance Reports", url: "/compliance", icon: FileText },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "All Complaints", url: "/admin/complaints", icon: FileText },
    { title: "Industries", url: "/admin/industries", icon: Building2 },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Management", url: "/admin/management", icon: Shield },
  ];

  const menuItems = user?.role === 'admin' 
    ? adminItems 
    : user?.role === 'industry' 
    ? industryItems 
    : citizenItems;

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-lg text-primary-foreground">🌿</span>
              </div>
              <h2 className="text-lg font-semibold">EcoComply</h2>
            </div>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="link-settings">
                  <a href="/settings">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || ''} style={{ objectFit: 'cover' }} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" data-testid="text-user-name">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize" data-testid="text-user-role">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
