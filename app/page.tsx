'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer, BarChart3, Calendar, Settings, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
          <h1 className="text-xl font-bold">TimeFlow</h1>
        </motion.div>

        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {[
            { icon: Timer, label: 'Timer' },
            { icon: Calendar, label: 'Calendar' },
            { icon: BarChart3, label: 'Reports' },
            { icon: PieChart, label: 'Dashboard' },
            { icon: Settings, label: 'Settings' },
          ].map(item => (
            <motion.div
              key={item.label}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, User</h1>
              <p className="text-muted-foreground">
                Track your time efficiently
              </p>
            </div>
            <Button size="lg">Start Timer</Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Today', value: '5h 23m' },
              { title: 'This Week', value: '32h 40m' },
              { title: 'This Month', value: '142h 15m' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Time Entries</h2>
            <div className="space-y-4">
              {[
                {
                  project: 'Website Redesign',
                  duration: '2h 15m',
                  time: '9:00 AM - 11:15 AM',
                },
                {
                  project: 'Client Meeting',
                  duration: '1h 00m',
                  time: '11:30 AM - 12:30 PM',
                },
                {
                  project: 'Bug Fixes',
                  duration: '2h 45m',
                  time: '2:00 PM - 4:45 PM',
                },
              ].map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                >
                  <div>
                    <h3 className="font-medium">{entry.project}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.time}
                    </p>
                  </div>
                  <span className="font-semibold">{entry.duration}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
