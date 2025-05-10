import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import { TailwindIndicator } from '@/components/tailwind-indicator';
// import { Sidebar } from '@/components/side-bar/side-bar';
// import { Header } from '@/components/header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FlowSync - Time Tracking Made Simple',
  description:
    'Track your time efficiently and boost your productivity with FlowSync.',
  twitter: {
    card: 'summary_large_image',
    title: 'FlowSync - Time Tracking Made Simple',
    description:
      'Track your time efficiently and boost your productivity with FlowSync.',
    creator: '@flow_sync',
    images: ['https://example.com/image.jpg'],
  },
  openGraph: {
    title: 'FlowSync - Time Tracking Made Simple',
    description:
      'Track your time efficiently and boost your productivity with FlowSync.',
    url: 'https://example.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AppSidebar />
              <ModeToggle className="fixed top-4 right-4" />
              {/* <Header /> */}
              {/* <Sidebar /> */}
              <SidebarTrigger className="z-20" />
              {children}
              <Toaster />
            </ThemeProvider>
            <TailwindIndicator />
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
