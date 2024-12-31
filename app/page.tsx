'use client';

import { Card } from '@/components/ui/card';
import { Timer, BarChart3, Calendar, Settings, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimeEntryDialog } from '@/components/time-entry-dialog';
import { TimeChart } from '@/components/analytics/time-chart';
import { useTimeTrackingStore } from '@/lib/store';
import { format } from 'date-fns';

export default function Home() {
  const { timeEntries, categories } = useTimeTrackingStore();

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
              variants={variants}
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
            <TimeEntryDialog />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <TimeChart />
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recent Time Entries
              </h2>
              <div className="space-y-4">
                {timeEntries.slice(-3).map(entry => {
                  const category = categories.find(
                    c => c.categoryId === entry.categoryId
                  );
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                    >
                      <div>
                        <h3 className="font-medium">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(entry.startTime, 'h:mm a')} -{' '}
                          {format(entry.endTime, 'h:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category?.color }}
                        />
                        <span className="font-semibold">
                          {Math.round(
                            (entry.endTime.getTime() -
                              entry.startTime.getTime()) /
                              (1000 * 60)
                          )}
                          m
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
