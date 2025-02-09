import { MotionDiv } from '@/motion-wrappers';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </MotionDiv>
      </div>
    </div>
  );
}
