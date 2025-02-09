'use client';

import {
  Timer,
  BarChart3,
  Calendar,
  Settings,
  PieChart,
  User,
  Menu,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
// import Link from 'next/link';

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
  { icon: Timer, label: 'Timer', path: 'timer' },
  { icon: Calendar, label: 'Calendar', path: 'calendar' },
  { icon: BarChart3, label: 'Reports', path: 'reports' },
  { icon: PieChart, label: 'Dashboard', path: 'dashboard' },
  { icon: Settings, label: 'Settings', path: 'settings' },
  { icon: User, label: 'Friends', path: 'friends' },
];
export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };
  return (
    <section>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
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
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* Mobile Menu - Slide Over */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-4">
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-8">
              <Timer className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">TimeTracker</h1>
            </div>

            <nav className="space-y-2">
              {navItems.map(item => (
                <div
                  key={item.path}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                    pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};
