"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../../components/AuthCheck";
import Navigation from "../../components/Navigation";

interface Trip {
  id: string;
  pickup: string;
  dropoff: string;
  stops: string[];
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  passengers: number;
  notes: string;
  status:
    | "scheduled"
    | "en-route"
    | "arrived"
    | "in-progress"
    | "completed"
    | "cancelled";
  pricing: {
    total: number;
  };
  route: {
    distance: number;
    duration: number;
  };
}

function DriverScheduleContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // Load trips for driver (in real app, fetch from API)
    const mockTrips: Trip[] = [
      {
        id: "1",
        pickup: "123 Main St, New York, NY",
        dropoff: "456 Business Ave, New York, NY",
        stops: ["Central Park, New York, NY"],
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        customerName: "John Smith",
        customerPhone: "+1 (555) 123-4567",
        passengers: 2,
        notes: "Please wait in hotel lobby",
        status: "scheduled",
        pricing: { total: 125.5 },
        route: { distance: 8.5, duration: 25 },
      },
      {
        id: "2",
        pickup: "789 Airport Rd, New York, NY",
        dropoff: "321 Hotel St, New York, NY",
        stops: [],
        date: new Date().toISOString().split("T")[0],
        time: "14:30",
        customerName: "Sarah Johnson",
        customerPhone: "+1 (555) 987-6543",
        passengers: 1,
        notes: "Flight arriving at 14:15 - Terminal 4",
        status: "scheduled",
        pricing: { total: 95.0 },
        route: { distance: 12.3, duration: 35 },
      },
      {
        id: "3",
        pickup: "555 Conference Center, New York, NY",
        dropoff: "777 Restaurant Row, New York, NY",
        stops: [],
        date: new Date().toISOString().split("T")[0],
        time: "19:00",
        customerName: "Michael Chen",
        customerPhone: "+1 (555) 555-0123",
        passengers: 4,
        notes: "Business dinner - formal attire requested",
        status: "completed",
        pricing: { total: 85.25 },
        route: { distance: 6.2, duration: 18 },
      },
    ];

    setTrips(mockTrips);
  }, []);

  const updateTripStatus = (tripId: string, newStatus: Trip["status"]) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId ? { ...trip, status: newStatus } : trip
      )
    );

    // Send notification to customer (in real app)
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      alert(
        `Status updated: ${newStatus.replace("-", " ")} for ${
          trip.customerName
        }`
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "en-route":
        return "bg-yellow-100 text-yellow-800";
      case "arrived":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusActions = (trip: Trip) => {
    switch (trip.status) {
      case "scheduled":
        return [
          {
            label: "En Route",
            action: () => updateTripStatus(trip.id, "en-route"),
          },
          {
            label: "Cancel",
            action: () => updateTripStatus(trip.id, "cancelled"),
            danger: true,
          },
        ];
      case "en-route":
        return [
          {
            label: "Arrived",
            action: () => updateTripStatus(trip.id, "arrived"),
          },
        ];
      case "arrived":
        return [
          {
            label: "Start Trip",
            action: () => updateTripStatus(trip.id, "in-progress"),
          },
        ];
      case "in-progress":
        return [
          {
            label: "Complete Trip",
            action: () => updateTripStatus(trip.id, "completed"),
          },
        ];
      default:
        return [];
    }
  };

  const todayTrips = trips.filter((trip) => trip.date === selectedDate);
  const totalEarnings = todayTrips.reduce(
    (sum, trip) =>
      trip.status === "completed" ? sum + trip.pricing.total : sum,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">My Schedule</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
          />
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">
            {todayTrips.length}
          </div>
          <div className="text-sm text-gray-600">Total Trips</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">
            {todayTrips.filter((t) => t.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">
            {todayTrips
              .reduce((sum, trip) => sum + trip.route.distance, 0)
              .toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Miles Driven</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-black">
            ${totalEarnings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Earnings</div>
        </div>
      </div>

      {/* Trip List */}
      {todayTrips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No trips scheduled
          </h2>
          <p className="text-gray-600">
            {selectedDate === new Date().toISOString().split("T")[0]
              ? "You have no trips scheduled for today."
              : "You have no trips scheduled for this date."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayTrips
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-semibold text-black">
                        {trip.time}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {trip.passengers} passenger
                      {trip.passengers > 1 ? "s" : ""} • {trip.route.distance}{" "}
                      miles • ~{trip.route.duration} min
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-black">
                      ${trip.pricing.total.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">Trip fare</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {trip.customerName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-black">
                      {trip.customerName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {trip.customerPhone}
                    </div>
                  </div>
                  <a
                    href={`tel:${trip.customerPhone}`}
                    className="bg-black text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Call
                  </a>
                </div>

                {/* Route */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="font-medium text-black">Pickup</div>
                      <div className="text-sm text-gray-600">{trip.pickup}</div>
                    </div>
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(
                        trip.pickup
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Navigate
                    </a>
                  </div>

                  {trip.stops.map((stop, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium text-black">
                          Stop {index + 1}
                        </div>
                        <div className="text-sm text-gray-600">{stop}</div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="font-medium text-black">Dropoff</div>
                      <div className="text-sm text-gray-600">
                        {trip.dropoff}
                      </div>
                    </div>
                    <a
                      href={`https://maps.google.com/maps?daddr=${encodeURIComponent(
                        trip.dropoff
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Navigate
                    </a>
                  </div>
                </div>

                {/* Notes */}
                {trip.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="font-medium text-black text-sm">
                      Special Instructions:
                    </div>
                    <div className="text-sm text-gray-700">{trip.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <a
                      href={`https://maps.google.com/maps?saddr=${encodeURIComponent(
                        trip.pickup
                      )}&daddr=${encodeURIComponent(trip.dropoff)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-black border border-gray-300 px-3 py-1 rounded-md transition-colors"
                    >
                      Full Route
                    </a>

                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="text-sm text-gray-600 hover:text-black border border-gray-300 px-3 py-1 rounded-md transition-colors"
                    >
                      Details
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {getStatusActions(trip).map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          action.danger
                            ? "text-red-600 border border-red-300 hover:bg-red-50"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Trip Details</h3>
              <button
                onClick={() => setSelectedTrip(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer */}
              <div>
                <h4 className="font-semibold text-black mb-2">Customer</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="font-medium text-black">
                    {selectedTrip.customerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedTrip.customerPhone}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedTrip.passengers} passenger
                    {selectedTrip.passengers > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div>
                <h4 className="font-semibold text-black mb-2">
                  Trip Information
                </h4>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedTrip.date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedTrip.time}
                  </div>
                  <div>
                    <strong>Distance:</strong> {selectedTrip.route.distance}{" "}
                    miles
                  </div>
                  <div>
                    <strong>Duration:</strong> ~{selectedTrip.route.duration}{" "}
                    minutes
                  </div>
                  <div>
                    <strong>Fare:</strong> $
                    {selectedTrip.pricing.total.toFixed(2)}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        selectedTrip.status
                      )}`}
                    >
                      {selectedTrip.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div>
                <h4 className="font-semibold text-black mb-2">Route</h4>
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-black">Pickup</div>
                      <div className="text-sm text-gray-600">
                        {selectedTrip.pickup}
                      </div>
                    </div>
                  </div>

                  {selectedTrip.stops.map((stop, index) => (
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
                        {selectedTrip.dropoff}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedTrip.notes && (
                <div>
                  <h4 className="font-semibold text-black mb-2">
                    Special Instructions
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="text-sm text-gray-700">
                      {selectedTrip.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedTrip(null)}
                className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DriverSchedule() {
  return (
    <AuthCheck requiredRole="driver">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4">
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <span className="mr-2">←</span>
            Back
          </button>
        </div>
        <DriverScheduleContent />
      </div>
    </AuthCheck>
  );
}
