'use server';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Timer, BarChart3, Calendar } from 'lucide-react';

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Track Your Time, Boost Your Productivity
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                FlowSync helps you track your time efficiently, analyze your
                productivity patterns, and collaborate with your team
                seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square relative">
                <Image
                  src="/hero-image.svg"
                  alt="FlowSync Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to stay productive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <Timer className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
              <p className="text-muted-foreground">
                Track your time with ease using our intuitive timer interface.
                Start, pause, and log your activities effortlessly.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
              <p className="text-muted-foreground">
                Visualize your time entries in a calendar format. Plan ahead and
                manage your schedule effectively.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Get insights into your productivity with detailed reports and
                analytics. Make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by productive teams worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            <Image
              src="/company1.svg"
              alt="Company 1"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <Image
              src="/company2.svg"
              alt="Company 2"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <Image
              src="/company3.svg"
              alt="Company 3"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <Image
              src="/company4.svg"
              alt="Company 4"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their time management
            with FlowSync.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
