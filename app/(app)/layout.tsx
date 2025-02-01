'use client';

import {
  Timer,
  BarChart3,
  Calendar,
  Settings,
  PieChart,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const navItems = [
    { icon: Timer, label: 'Timer', path: '/timer' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: PieChart, label: 'Dashboard', path: '/dashboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Friends', path: '/friends' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <Timer className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">TimeTracker</h1>
        </motion.div>

        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {navItems.map(item => (
            <motion.div
              key={item.path}
              variants={variants}
              whileHover={{ x: 5 }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
