"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatBot from "./components/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Auth hook that stores user and JWT token separately
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const userData = localStorage.getItem("user");
          const token = localStorage.getItem("token");
          if (userData && token) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (e) {
        // Ignore localStorage errors
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Call this after successful login API call
  const login = (userData: any, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, logout };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <html lang="en">
        <head>
          <title>LuxRide - Premium Chauffeur Service</title>
          <meta
            name="description"
            content="Book luxury rides with professional chauffeurs"
          />
        </head>
        <body className={`${inter.variable} antialiased`}>
          <div className="flex h-screen items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
          </div>
        </body>
      </html>
    );
  }

  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <head>
        <title>JP Luxury Ride - Premium Chauffeur Service</title>
        <meta
          name="description"
          content="Experience luxury travel with JP Luxury Ride's professional chauffeur service"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-white text-gray-900 font-sans`}
      >
        {user && !isHomePage ? (
          <div className="min-h-screen bg-gray-50">
            {/* Main Content - Navigation is now handled by individual pages */}
            <main className="min-h-screen">{children}</main>

            {/* ChatBot for authenticated users */}
            <ChatBot />
          </div>
        ) : (
          // Public layout for home page or unauthenticated users
          <div>{children}</div>
        )}
      </body>
    </html>
  );
}
