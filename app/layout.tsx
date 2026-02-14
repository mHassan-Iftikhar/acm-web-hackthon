import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { SocketProvider } from "@/context/socket-context";
import { ChatWidget } from "@/components/chat/chat-widget";
import { AIChatWidget } from "@/components/chat/ai-chat-widget";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const orenza = localFont({
  src: "../public/font/OrenzaBoldRegular.otf",
  variable: "--font-orenza",
});

const walsheim = localFont({
  src: [
    {
      path: "../public/font/GT-Walsheim-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/GT-Walsheim-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/GT-Walsheim-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-walsheim",
});

export const metadata: Metadata = {
  title: "Taakra - Manage Your Competitions",
  description:
    "Taakra - A comprehensive platform for managing academic competitions",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${orenza.variable} ${walsheim.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <SocketProvider>
            {children}
            <ChatWidget />
            <AIChatWidget />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
