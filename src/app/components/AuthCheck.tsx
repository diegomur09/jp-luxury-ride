"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function AuthCheck({
  children,
  requiredRole,
  redirectTo = "/",
}: AuthCheckProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      // No user found, redirect to home
      router.push("/");
      return;
    }

    const userData = JSON.parse(savedUser);
    setUser(userData);

    // Check if user has required role
    if (requiredRole && userData.role !== requiredRole) {
      // User doesn't have required role, redirect based on their role
      switch (userData.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "driver":
          router.push("/driver/schedule");
          break;
        case "customer":
        default:
          router.push("/book");
          break;
      }
      return;
    }

    setIsLoading(false);
  }, [requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected
  }

  return <>{children}</>;
}
