import { AppLayoutContent } from '@/components/app-layout-content';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppLayoutContent>{children}</AppLayoutContent>
    </div>
  );
}
