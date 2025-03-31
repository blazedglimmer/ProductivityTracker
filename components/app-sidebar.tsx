'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Timer,
  BarChart3,
  PieChart,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

// Menu items with categories
const menuItems = [
  {
    category: 'Time Management',
    items: [
      {
        title: 'Timer',
        url: '/timer',
        icon: Timer,
      },
      {
        title: 'Calendar',
        url: '/calendar',
        icon: Calendar,
      },
    ],
  },
  {
    category: 'Analytics',
    items: [
      {
        title: 'Reports',
        url: '/reports',
        icon: BarChart3,
      },
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: PieChart,
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
      },
      {
        title: 'Friends',
        url: '/friends',
        icon: User,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme: isDarkMode } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PieChart className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FlowSync
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {menuItems.map((section, index) => (
          <SidebarGroup key={section.category} className="mb-4">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-1 px-2">
              {section.category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="transition-all duration-200 group"
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={`h-4 w-4 ${
                              isActive
                                ? 'text-primary'
                                : 'group-hover:text-primary/80'
                            }`}
                          />
                          <span>{item.title}</span>
                          {isActive && (
                            <div className="absolute left-0 top-0 h-full w-1 rounded-r-md bg-primary" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {index < menuItems.length - 1 && (
              <SidebarSeparator className="my-2" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center justify-between p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 w-full justify-start p-2 h-auto hover:bg-sidebar-accent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session?.user.name
                      ?.split(' ')
                      .map(name => name[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {session?.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session?.user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <Link href={'/profile'}>Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button
                  onClick={() =>
                    document.documentElement.classList.toggle('dark')
                  }
                  className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                >
                  {isDarkMode === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
