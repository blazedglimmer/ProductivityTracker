export type Category = {
  id: string;
  name: string;
  color: string;
};

export type TimeEntry = {
  id: string;
  title: string;
  categoryId: string;
  startTime: Date;
  endTime: Date;
  description?: string;
};

export type TimeStats = {
  totalDuration: number;
  categoryBreakdown: {
    categoryId: string;
    duration: number;
  }[];
};
