'use client';

import { useState } from 'react';
import { Timer, BarChart3, Calendar, Settings, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { Timer as TimerSection } from '@/components/sections/timer';
import { Calendar as CalendarSection } from '@/components/sections/calendar';
import { Reports } from '@/components/sections/reports';
import { Dashboard } from '@/components/sections/dashboard';
import { Settings as SettingsSection } from '@/components/sections/settings';

export default function Home() {
  const [activeSection, setActiveSection] = useState('timer');

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

  const renderSection = () => {
    switch (activeSection) {
      case 'timer':
        return <TimerSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'reports':
        return <Reports />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <TimerSection />;
    }
  };

  const navItems = [
    { icon: Timer, label: 'Timer', id: 'timer' },
    { icon: Calendar, label: 'Calendar', id: 'calendar' },
    { icon: BarChart3, label: 'Reports', id: 'reports' },
    { icon: PieChart, label: 'Dashboard', id: 'dashboard' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <Timer className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">TimeFlow</h1>
        </motion.div>

        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {navItems.map(item => (
            <motion.div
              key={item.id}
              variants={variants}
              whileHover={{ x: 5 }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
              onClick={() => setActiveSection(item.id)}
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
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}
