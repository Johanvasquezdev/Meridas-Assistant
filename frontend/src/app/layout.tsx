import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MERIDAS — AI Support Intelligence",
  description: "Evidence first. Answer second. Grounded, precise, intelligent, and trustworthy AI support platform.",
  icons: {
    icon: "/meridas-icon.svg",
    shortcut: "/meridas-icon.svg",
    apple: "/meridas-icon.svg",
  },
};

import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ClerkProvider appearance={clerkAppearance}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
