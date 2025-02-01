export type Category = {
  id: string;
  name: string;
  color: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TimeEntry = {
  id: string;
  title: string;
  categoryId: string;
  startTime: Date;
  endTime: Date;
  description?: string | null;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  category?: Category;
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
