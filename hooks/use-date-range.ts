import { TimeRange, CustomDateRange } from '@/types';

export const useDateRange = ({
  timeRange,
  customDateRange,
}: {
  timeRange: TimeRange;
  customDateRange: CustomDateRange;
}) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timeRange) {
    case 'today':
      return {
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      };
    case 'week': {
      const weekStart = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return { startDate: weekStart, endDate: weekEnd };
    }
    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { startDate: monthStart, endDate: monthEnd };
    }
    case 'year': {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      return { startDate: yearStart, endDate: yearEnd };
    }
    case 'custom':
      return {
        startDate: customDateRange.from,
        endDate: customDateRange.to,
      };
    default:
      return { startDate: today, endDate: new Date() };
  }
};
