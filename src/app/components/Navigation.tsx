"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getDashboardLink = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "driver":
        return "/driver/schedule";
      case "customer":
      default:
        return "/book";
    }
  };

  const getRoleLinks = (role: string) => {
    switch (role) {
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/bookings", label: "Bookings" },
          { href: "/admin/fleet", label: "Fleet" },
        ];
      case "driver":
        return [
          { href: "/driver/schedule", label: "Schedule" },
          { href: "/driver/earnings", label: "Earnings" },
        ];
      case "customer":
      default:
        return [
          { href: "/book", label: "Book Ride" },
          { href: "/trips", label: "My Trips" },
          { href: "/account", label: "Account" },
        ];
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link
            href={user ? getDashboardLink(user.role) : "/"}
            className="flex items-center space-x-4"
          >
            <Image
              src="/Logo.png"
              alt="JP Luxury Ride Logo"
              width={50}
              height={50}
              className="object-contain rounded-full"
            />
            <span className="text-2xl font-bold text-black">
              DP Luxury Ride
            </span>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center space-x-6">
              {/* Role-based navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {getRoleLinks(user.role).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 hover:text-black font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-black">
                    {user.firstName || user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-black font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden pb-4">
            <div className="flex flex-wrap gap-2">
              {getRoleLinks(user.role).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-black font-medium transition-colors bg-gray-50 px-3 py-2 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
