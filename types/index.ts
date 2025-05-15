export type Category = {
  id: string;
  name: string;
  color: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ViewMode = 'day' | 'week' | 'month';

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface Statistics {
  totalHours: number;
  averageHoursPerDay: number;
  mostProductiveDay: string;
  topCategory: {
    name: string;
    hours: number;
    color: string;
  } | null;
}

export type TimeEntry = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  category: Category;
  categoryId: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TimeStats = {
  totalDuration: number;
  categoryBreakdown: {
    categoryId: string;
    duration: number;
  }[];
};

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export interface ChatDialogProps {
  friend: {
    id: string;
    name: string;
    username: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface CustomDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface TimeEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: Date | null;
  initialEndTime?: Date | null;
}

export interface FriendActivityDialogProps {
  friend: {
    id: string;
    name: string;
    username: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface FriendRequest {
  id: string;
  requester: User;
  addressee: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export type Note = {
  title: string;
  description: string;
  done: boolean;
  id: string;
  todoColor: string;
  updatedAt: Date;
  lastModifiedBy: string;
  user: { username: string };
  images: {
    id: string;
    url: string;
  }[];
  collaborators: {
    id: string;
    isOwner: boolean;
    user: {
      id: string;
      username: string;
      name: string | null;
      image: string | null;
      email: string;
    };
  }[];
};
