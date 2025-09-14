'use client';

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import Header from "@components/layout/Header";
import PrintHeaderFooter from "@components/print/PrintHeaderFooter";
import MotionProvider from "@/components/animation/MotionProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering a simple div until client-side rendering is ready
  if (!mounted) {
    return <div className="min-h-screen"></div>;
  }

  // Get theme from cookies on the client side
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] || 'light';
  };

  const initialTheme = getInitialTheme();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div data-theme={initialTheme}>
        <MotionProvider>
          <Header />
          <main className="min-h-screen pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <PrintHeaderFooter />
        </MotionProvider>
      </div>
    </ThemeProvider>
  );
}
