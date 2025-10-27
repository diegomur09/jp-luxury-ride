"use client";

import { useState, useEffect } from "react";

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: string;
  dropoff: string;
  stops: string[];
  date: string;
  time: string;
  passengers: number;
  vehicle: {
    id: string;
    name: string;
    plate: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  pricing: {
    total: number;
    distance: number;
    duration: number;
  };
  notes: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: "1",
        customer: {
          name: "John Smith",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
        },
        pickup: "123 Main St, New York, NY",
        dropoff: "456 Business Ave, New York, NY",
        stops: ["Central Park, New York, NY"],
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        passengers: 2,
        vehicle: {
          id: "1",
          name: "Mercedes S-Class",
          plate: "LUX-001",
        },
        driver: {
          id: "1",
          name: "James Wilson",
          phone: "+1 (555) 111-2222",
        },
        status: "in-progress",
        pricing: {
          total: 125.5,
          distance: 8.5,
          duration: 25,
        },
        notes: "VIP client - extra attention required",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        customer: {
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1 (555) 987-6543",
        },
        pickup: "JFK Airport Terminal 4",
        dropoff: "Manhattan Hotel",
        stops: [],
        date: new Date().toISOString().split("T")[0],
        time: "14:30",
        passengers: 1,
        vehicle: {
          id: "2",
          name: "Cadillac Escalade",
          plate: "LUX-002",
        },
        driver: {
          id: "2",
          name: "Michael Chen",
          phone: "+1 (555) 333-4444",
        },
        status: "confirmed",
        pricing: {
          total: 95.0,
          distance: 12.3,
          duration: 35,
        },
        notes: "Flight AA 1234 arriving at 14:15",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        customer: {
          name: "Robert Davis",
          email: "robert@example.com",
          phone: "+1 (555) 555-0123",
        },
        pickup: "Times Square",
        dropoff: "LaGuardia Airport",
        stops: ["5th Avenue Shopping"],
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        time: "19:00",
        passengers: 4,
        vehicle: {
          id: "3",
          name: "Mercedes Sprinter",
          plate: "LUX-003",
        },
        driver: {
          id: "3",
          name: "David Brown",
          phone: "+1 (555) 777-8888",
        },
        status: "completed",
        pricing: {
          total: 145.75,
          distance: 15.2,
          duration: 45,
        },
        notes: "Corporate account - invoice required",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((booking) => booking.date === filterDate);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.customer.name.toLowerCase().includes(query) ||
          booking.customer.email.toLowerCase().includes(query) ||
          booking.pickup.toLowerCase().includes(query) ||
          booking.dropoff.toLowerCase().includes(query) ||
          booking.driver.name.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filterStatus, filterDate, searchQuery]);

  const updateBookingStatus = (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );

    const booking = bookings.find((b) => b.id === bookingId);
    alert(`Booking status updated: ${newStatus} for ${booking?.customer.name}`);
  };

  const assignDriver = (
    bookingId: string,
    driverId: string,
    driverName: string
  ) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              driver: { ...booking.driver, id: driverId, name: driverName },
            }
          : booking
      )
    );

    alert(`Driver ${driverName} assigned to booking`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "in-progress":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Booking Management</h1>
        <button className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Create Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Search by customer, driver, or location..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterDate("");
                setSearchQuery("");
              }}
              className="w-full border border-gray-300 text-black px-4 py-2 rounded-md font-medium hover:border-gray-400 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">
            Bookings ({filteredBookings.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver & Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      #{booking.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.date)} at {booking.time}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {booking.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.customer.phone}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-black max-w-xs">
                      <div className="truncate">{booking.pickup}</div>
                      <div className="text-gray-500">→</div>
                      <div className="truncate">{booking.dropoff}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {booking.driver.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.vehicle.name} • {booking.vehicle.plate}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      ${booking.pricing.total.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.pricing.distance} mi
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-black hover:text-gray-600 mr-3"
                    >
                      View
                    </button>
                    <button className="text-black hover:text-gray-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or create a new booking.
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                Booking #{selectedBooking.id}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Trip Details
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-3">
                    <div>
                      <strong>Date & Time:</strong>{" "}
                      {formatDate(selectedBooking.date)} at{" "}
                      {selectedBooking.time}
                    </div>
                    <div>
                      <strong>Passengers:</strong> {selectedBooking.passengers}
                    </div>
                    <div>
                      <strong>Distance:</strong>{" "}
                      {selectedBooking.pricing.distance} miles
                    </div>
                    <div>
                      <strong>Duration:</strong> ~
                      {selectedBooking.pricing.duration} minutes
                    </div>
                    <div>
                      <strong>Total:</strong> $
                      {selectedBooking.pricing.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>Name:</strong> {selectedBooking.customer.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedBooking.customer.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedBooking.customer.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Driver & Vehicle
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>Driver:</strong> {selectedBooking.driver.name}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedBooking.driver.phone}
                    </div>
                    <div>
                      <strong>Vehicle:</strong> {selectedBooking.vehicle.name}
                    </div>
                    <div>
                      <strong>Plate:</strong> {selectedBooking.vehicle.plate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Route and Actions */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Route</h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-black">Pickup</div>
                        <div className="text-sm text-gray-600">
                          {selectedBooking.pickup}
                        </div>
                      </div>
                    </div>

                    {selectedBooking.stops.map((stop, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-black">
                            Stop {index + 1}
                          </div>
                          <div className="text-sm text-gray-600">{stop}</div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-black">Dropoff</div>
                        <div className="text-sm text-gray-600">
                          {selectedBooking.dropoff}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-semibold text-black mb-3">
                      Special Instructions
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="text-sm text-gray-700">
                        {selectedBooking.notes}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Status Management
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Current Status:
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          selectedBooking.status
                        )}`}
                      >
                        {selectedBooking.status
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "confirmed",
                        "in-progress",
                        "completed",
                        "cancelled",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateBookingStatus(
                              selectedBooking.id,
                              status as Booking["status"]
                            )
                          }
                          disabled={selectedBooking.status === status}
                          className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                            selectedBooking.status === status
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : status === "cancelled"
                              ? "border border-red-300 text-red-600 hover:bg-red-50"
                              : "border border-gray-300 text-black hover:bg-gray-50"
                          }`}
                        >
                          Mark as {status.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📞 Call Customer
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📞 Call Driver
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📧 Send Email
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      🧾 Generate Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 border border-gray-300 text-black rounded-md font-medium hover:border-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
