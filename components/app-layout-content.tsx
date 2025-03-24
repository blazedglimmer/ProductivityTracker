'use client';

import { MotionDiv } from '@/motion-wrappers';
import { useSidebar } from '@/components/ui/sidebar';

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div
      className="flex flex-1 h-full p-4 w-full transition-[margin]"
      style={{
        marginLeft: isSidebarOpen ? '64px' : '0',
      }}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {children}
      </MotionDiv>
    </div>
  );
}
