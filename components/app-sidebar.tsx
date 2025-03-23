import {
  Calendar,
  Timer,
  BarChart3,
  PieChart,
  Settings,
  User,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Timer',
    url: 'timer',
    icon: Timer,
  },
  {
    title: 'Calendar',
    url: 'calendar',
    icon: Calendar,
  },
  {
    title: 'Reports',
    url: 'reports',
    icon: BarChart3,
  },
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: PieChart,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: Settings,
  },
  {
    title: 'Friends',
    url: 'friends',
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
