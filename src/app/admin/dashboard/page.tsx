"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../../components/AuthCheck";
import Navigation from "../../components/Navigation";

interface DashboardStats {
  totalBookings: number;
  activeTrips: number;
  totalRevenue: number;
  activeDrivers: number;
  fleetUtilization: number;
  customerSatisfaction: number;
}

interface RecentBooking {
  id: string;
  customer: string;
  pickup: string;
  dropoff: string;
  status: string;
  driver: string;
  amount: number;
  time: string;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeTrips: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    fleetUtilization: 0,
    customerSatisfaction: 0,
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    // Mock dashboard data
    setStats({
      totalBookings: 1247,
      activeTrips: 23,
      totalRevenue: 89750,
      activeDrivers: 12,
      fleetUtilization: 78,
      customerSatisfaction: 4.8,
    });

    setRecentBookings([
      {
        id: "1",
        customer: "John Smith",
        pickup: "JFK Airport",
        dropoff: "Manhattan Hotel",
        status: "in-progress",
        driver: "James Wilson",
        amount: 125.5,
        time: "2 min ago",
      },
      {
        id: "2",
        customer: "Sarah Johnson",
        pickup: "Central Park",
        dropoff: "Brooklyn Bridge",
        status: "completed",
        driver: "Michael Chen",
        amount: 85.0,
        time: "15 min ago",
      },
      {
        id: "3",
        customer: "Robert Davis",
        pickup: "Times Square",
        dropoff: "LaGuardia Airport",
        status: "confirmed",
        driver: "David Brown",
        amount: 95.75,
        time: "22 min ago",
      },
      {
        id: "4",
        customer: "Emily Wilson",
        pickup: "Financial District",
        dropoff: "Upper East Side",
        status: "completed",
        driver: "James Wilson",
        amount: 67.25,
        time: "1 hour ago",
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600 bg-blue-50";
      case "in-progress":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-gray-600 bg-gray-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
            Export Report
          </button>
          <button className="border border-gray-300 text-black px-4 py-2 rounded-md font-medium hover:border-gray-400 transition-colors">
            Settings
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            {stats.totalBookings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Bookings</div>
          <div className="text-xs text-green-600 mt-1">+12% this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            {stats.activeTrips}
          </div>
          <div className="text-sm text-gray-600">Active Trips</div>
          <div className="text-xs text-blue-600 mt-1">Live tracking</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
          <div className="text-xs text-green-600 mt-1">+18% vs last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            {stats.activeDrivers}
          </div>
          <div className="text-sm text-gray-600">Active Drivers</div>
          <div className="text-xs text-gray-500 mt-1">15 total drivers</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            {stats.fleetUtilization}%
          </div>
          <div className="text-sm text-gray-600">Fleet Utilization</div>
          <div className="text-xs text-green-600 mt-1">+5% this week</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">
            {stats.customerSatisfaction}
          </div>
          <div className="text-sm text-gray-600">Avg. Rating</div>
          <div className="text-xs text-green-600 mt-1">⭐⭐⭐⭐⭐</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">
                Recent Bookings
              </h2>
              <a
                href="/admin/bookings"
                className="text-sm text-black hover:text-gray-600 font-medium"
              >
                View All →
              </a>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="font-medium text-black">
                        {booking.customer}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.pickup} → {booking.dropoff}
                    </div>
                    <div className="text-xs text-gray-500">
                      Driver: {booking.driver} • {booking.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black">
                      ${booking.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/bookings?action=create"
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors block"
              >
                <div className="font-medium text-black">📅 Create Booking</div>
                <div className="text-sm text-gray-600">
                  Add new customer booking
                </div>
              </a>

              <a
                href="/admin/drivers?action=add"
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors block"
              >
                <div className="font-medium text-black">👤 Add Driver</div>
                <div className="text-sm text-gray-600">
                  Onboard new chauffeur
                </div>
              </a>

              <a
                href="/admin/fleet?action=add"
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors block"
              >
                <div className="font-medium text-black">🚗 Add Vehicle</div>
                <div className="text-sm text-gray-600">
                  Register new vehicle
                </div>
              </a>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="font-medium text-yellow-800">
                  Vehicle Maintenance
                </div>
                <div className="text-sm text-yellow-700">
                  Mercedes S-Class (LUX-001) due for service
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="font-medium text-green-800">
                  New Driver Application
                </div>
                <div className="text-sm text-green-700">
                  Review pending application from Alex Thompson
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="font-medium text-blue-800">
                  High Demand Alert
                </div>
                <div className="text-sm text-blue-700">
                  Airport pickups +40% this weekend
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Customer Satisfaction
                  </span>
                  <span className="text-sm font-medium text-black">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "96%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    On-Time Performance
                  </span>
                  <span className="text-sm font-medium text-black">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Fleet Utilization
                  </span>
                  <span className="text-sm font-medium text-black">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-black mb-4">Revenue Trends</h3>
        <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm">
              Revenue chart would be integrated here
            </div>
            <div className="text-xs">Chart.js or similar charting library</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AuthCheck requiredRole="admin">
      <Navigation />
      <AdminDashboardContent />
    </AuthCheck>
  );
}
