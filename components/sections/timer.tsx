'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square } from 'lucide-react';
import { TimeEntryDialog } from '@/components/time-entry-dialog';
import { toast } from 'sonner';

export function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
    toast.success('Timer started');
  };

  const handlePause = () => {
    setIsRunning(false);
    setEndTime(new Date());
    setShowDialog(true);
    toast.info('Timer paused');
  };

  const handleReset = () => {
    if (seconds > 0) {
      setEndTime(new Date());
      setShowDialog(true);
    }
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
    toast.info('Timer reset');
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEndTime(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
            {formatTime(seconds)}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Square className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {showDialog && startTime && endTime && (
        <TimeEntryDialog
          isOpen={showDialog}
          onClose={handleCloseDialog}
          initialDate={startTime}
          initialTime={startTime}
          initialEndTime={endTime}
        />
      )}
    </div>
  );
}
