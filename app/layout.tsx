import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";
import { Toaster } from "@/components/blocks/Toaster";
import { ScrollToTopButton } from "@/components/blocks/ScrollToTopButton/ScrollToTopButton";
import { ThemeModeProvider } from "@/contexts/ThemeModeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reel Shelf",
  description: "Track your physical media collection",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <ThemeModeProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <ScrollToTopButton />
            </AuthProvider>
          </ThemeModeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
