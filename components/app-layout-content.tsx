'use client';

import { MotionDiv } from '@/motion-wrappers';
import { useSidebar } from '@/components/ui/sidebar';

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen flex w-[calc(100vw-28px)] md:w-auto bg-background">
      <main
        className={`flex-1 transition-all duration-300 flex justify-center ${
          isSidebarOpen ? 'w-[calc(100vw-274px)]' : 'w-[calc(100vw-28px)]'
        }
        }`}
        // style={{
        //   width: isSidebarOpen ? 'calc(100vw - 274px)' : 'calc(100vw - 28px)',
        // }}
      >
        <div className="w-full max-w-full px-4 py-8">
          {/* Adjust max width for above div wrapper based on requirement */}
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
