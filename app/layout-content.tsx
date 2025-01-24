'use client';

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";
import "./globals.css";
import alex from "@/public/alex1.png";
import Image from "next/image";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground h-screen flex flex-col overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex-none border-b border-b-foreground/10 h-16">
            <div className="max-w-5xl mx-auto flex justify-between items-center p-3 px-5 h-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200">
                  <Image src={alex} alt="Alex" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="font-semibold">Chat with Alex</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                  onClick={() => setIsContactOpen(true)}
                >
                  Reach Out in Real Life
                </button>
                <ThemeSwitcher />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
          <ContactDialog 
            open={isContactOpen} 
            onOpenChange={setIsContactOpen}
          />
        </ThemeProvider>
      </body>
    </html>
  );
} 