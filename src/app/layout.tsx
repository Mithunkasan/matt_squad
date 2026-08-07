import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/pwa-register";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MATT SQUAD - Project Management",
  description: "A premium dashboard for tracking goals, tasks, and project balances.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MATT SQUAD",
  },
};

export const viewport: Viewport = {
  themeColor: "#73a0c8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <PWARegister />
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
