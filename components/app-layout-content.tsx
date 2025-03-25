'use client';

import { MotionDiv } from '@/motion-wrappers';
import { useSidebar } from '@/components/ui/sidebar';

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 transition-all duration-300 flex justify-center"
        style={{
          marginLeft: isSidebarOpen ? '64px' : '0',
        }}
      >
        <div className="w-full max-w-5xl px-4 py-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {children}
          </MotionDiv>
        </div>
      </main>
    </div>
  );
}
