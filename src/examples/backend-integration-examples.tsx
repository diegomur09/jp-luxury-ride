// Example of how to convert your pages to use the backend API
// This file shows you how to modify your existing components

import { apiClient } from "../lib/api";
import { useState, useEffect } from "react";

// Example: Convert your booking page from localStorage to API
export function ExampleBookingPageWithBackend() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user and bookings from backend instead of localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user profile from backend
        const userProfile = await apiClient.getProfile();
        setUser(userProfile);

        // Get user's bookings from backend
        const userBookings = await apiClient.getBookings(userProfile.id);
        setBookings(userBookings);
      } catch (error) {
        console.error("Error loading data:", error);
        // Handle error (maybe show login form)
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Create booking using backend API instead of localStorage
  const handleCreateBooking = async (bookingData) => {
    try {
      const newBooking = await apiClient.createBooking(bookingData);
      setBookings([...bookings, newBooking]);
      return newBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  };

  // Update booking using backend API
  const handleUpdateBooking = async (bookingId, updateData) => {
    try {
      const updatedBooking = await apiClient.updateBooking(
        bookingId,
        updateData
      );
      setBookings(
        bookings.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
      return updatedBooking;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  };

  // Delete booking using backend API
  const handleDeleteBooking = async (bookingId) => {
    try {
      await apiClient.deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Bookings</h1>
      {/* Your existing JSX here, but using backend data */}
    </div>
  );
}

// Example: Convert authentication from localStorage to backend
export function ExampleAuthenticationWithBackend() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when component loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userProfile = await apiClient.getProfile();
        setUser(userProfile);
      } catch (error) {
        // User not logged in or token expired
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login using backend API
  const handleLogin = async (email, password) => {
    try {
      const { user, token } = await apiClient.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Handle registration using backend API
  const handleRegister = async (userData) => {
    try {
      const { user, token } = await apiClient.register(userData);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Handle logout using backend API
  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Please Login</h1>
          {/* Your login/register form here */}
        </div>
      )}
    </div>
  );
}

// Example: Check backend connection
export async function checkBackendStatus() {
  try {
    const isConnected = await checkBackendConnection();
    if (isConnected) {
      console.log("✅ Backend is running and connected!");
      return true;
    } else {
      console.log("❌ Backend is not responding");
      return false;
    }
  } catch (error) {
    console.log("❌ Error connecting to backend:", error);
    return false;
  }
}
