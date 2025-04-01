import { SignUpForm } from '@/components/auth/signup-form';

export default function SignUpPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/95 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FlowSync. All rights reserved.</p>
      </div>
    </div>
  );
}
