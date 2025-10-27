"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import Navigation from "../components/Navigation";
import { apiClient } from "@/lib/api";

interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  stops: string[];
  date: string;
  time: string;
  vehicleId: string;
  passengers: number;
  notes: string;
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  pricing: {
    total: number;
  };
  route: {
    distance: number;
    duration: number;
  };
  driver?: {
    name: string;
    phone: string;
    vehicle: {
      make: string;
      model: string;
      plate: string;
    };
  };
  rating?: number;
  review?: string;
  createdAt: string;
}

function MyTripsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tip, setTip] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const backendBookings: any[] = await apiClient.getBookings();
        const mapped: Booking[] = backendBookings.map((b: any) => ({
          id: b.id,
          pickup: b.pickup || b.pickupAddress,
          dropoff: b.dropoff || b.dropoffAddress,
          stops: b.stops || [],
          date: b.date || b.scheduledDate || b.createdAt,
          time: b.time || b.scheduledTime || "",
          vehicleId: b.vehicleId || b.vehicleType || "",
          passengers: b.passengers || b.passengerCount || 1,
          notes: b.notes || b.specialNotes || "",
          status: (b.status || "confirmed") as Booking["status"],
          pricing: { total: b.totalAmount ?? b.pricing?.total ?? 0 },
          route: {
            distance: b.route?.distance ?? 0,
            duration: b.route?.duration ?? 0,
          },
          driver: b.driver || undefined,
          rating: b.rating,
          review: b.review,
          createdAt: b.createdAt || new Date().toISOString(),
        }));
        setBookings(mapped);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
      }
    };
    loadBookings();
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleRating = async (bookingId: string) => {
    try {
      await apiClient.updateBooking(bookingId, { rating, review });
      const updatedBookings = bookings.map((b) =>
        b.id === bookingId ? { ...b, rating, review } : b
      );
      setBookings(updatedBookings);

      setShowRatingModal(false);
      setSelectedBooking(null);
      setRating(0);
      setReview("");
      setTip("");
      alert("Thank you for your feedback!");
    } catch (err: any) {
      console.error("Rating failed:", err);
      alert(err?.message || "Failed to submit rating. Please try again.");
    }
  };

  const handleDeleteTrip = async (bookingId: string) => {
    try {
      await apiClient.deleteBooking(bookingId);
      const updated = bookings.filter((b) => b.id !== bookingId);
      setBookings(updated);
      setShowDeleteModal(false);
      setBookingToDelete(null);
      alert("Trip deleted successfully!");
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete trip. Please try again.");
    }
  };

  const handleModifyTrip = (booking: Booking) => {
    // Store the booking data in localStorage for pre-filling the booking form
    localStorage.setItem("modifyBooking", JSON.stringify(booking));
    // Navigate to booking page with modify parameter
    window.location.href = "/book?modify=true";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (bookings.length === 0) {
    return (
      <div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No trips yet
          </h2>
          <p className="text-gray-600 mb-6">
            Book your first luxury ride with LuxRide
          </p>
          <div className="flex justify-center mb-6">
            <img
              src="/GMC.png"
              alt="GMC Luxury Vehicle"
              className="max-w-full h-auto object-cover rounded-[15%] shadow-lg"
              style={{ maxHeight: "300px", width: "auto" }}
            />
          </div>
          <a
            href="/book"
            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Book a Ride
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Trip Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {getStatusText(booking.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(booking.date)} at {booking.time}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-black">
                  ${booking.pricing.total.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.route.distance} miles
                </div>
              </div>
            </div>

            {/* Trip Route */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-black">Pickup</div>
                  <div className="text-sm text-gray-600">{booking.pickup}</div>
                </div>
              </div>

              {booking.stops.map((stop, index) => (
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
                  <div className="text-sm text-gray-600">{booking.dropoff}</div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            {booking.driver && (
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      {booking.driver.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.driver.vehicle.make}{" "}
                      {booking.driver.vehicle.model} •{" "}
                      {booking.driver.vehicle.plate}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <a
                      href={`tel:${booking.driver.phone}`}
                      className="text-black hover:text-gray-600"
                    >
                      📞
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}
            {booking.status === "completed" && (
              <div className="border-t pt-4">
                {booking.rating ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Your Rating:
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= booking.rating!
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    {booking.review && (
                      <p className="text-sm text-gray-600 italic">
                        "{booking.review}"
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowRatingModal(true);
                    }}
                    className="text-sm text-black hover:text-gray-600 font-medium"
                  >
                    Rate this trip
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              {booking.status === "confirmed" && (
                <button
                  onClick={() => handleModifyTrip(booking)}
                  className="flex-1 text-center py-2 px-4 border border-gray-300 text-black rounded-md text-sm font-medium hover:border-gray-400 transition-colors"
                >
                  Modify Trip
                </button>
              )}

              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent(
                  booking.pickup + " to " + booking.dropoff
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 px-4 border border-gray-300 text-black rounded-md text-sm font-medium hover:border-gray-400 transition-colors"
              >
                View Route
              </a>

              <button className="flex-1 text-center py-2 px-4 border border-gray-300 text-black rounded-md text-sm font-medium hover:border-gray-400 transition-colors">
                Receipt
              </button>

              {(booking.status === "confirmed" ||
                booking.status === "cancelled") && (
                <button
                  onClick={() => {
                    setBookingToDelete(booking.id);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 text-center py-2 px-4 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:border-red-400 hover:bg-red-50 transition-colors"
                >
                  Delete Trip
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-black mb-4">
              Rate Your Trip
            </h3>

            {/* Rating Stars */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was your experience?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave a review (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Tip */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add tip for your chauffeur (optional)
              </label>
              <div className="flex space-x-2">
                {["10%", "15%", "20%", "Custom"].map((tipOption) => (
                  <button
                    key={tipOption}
                    onClick={() => setTip(tipOption)}
                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                      tip === tipOption
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {tipOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedBooking(null);
                  setRating(0);
                  setReview("");
                  setTip("");
                }}
                className="flex-1 py-2 px-4 border border-gray-300 text-black rounded-md font-medium hover:border-gray-400 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => handleRating(selectedBooking.id)}
                disabled={rating === 0}
                className="flex-1 py-2 px-4 bg-black text-white rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && bookingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-black mb-4">Delete Trip</h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 text-black rounded-md font-medium hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTrip(bookingToDelete)}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyTrips() {
  return (
    <AuthCheck requiredRole="customer">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4">
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
        <MyTripsContent />
      </div>
    </AuthCheck>
  );
}
