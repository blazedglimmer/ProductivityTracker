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

import Link from 'next/link';

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

export const AppSidebar = () => (
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <Link className="font-bold hidden sm:inline-block" href="/">
          <SidebarGroupLabel>FlowSync</SidebarGroupLabel>
        </Link>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);
