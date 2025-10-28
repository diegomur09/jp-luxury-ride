"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import Navigation from "../components/Navigation";
import { apiClient } from "@/lib/api";

function BookRideContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupAddressId: "", // UUID
    dropoffAddressId: "", // UUID
    stops: [] as {
      address: string;
      latitude: number;
      longitude: number;
      order: number;
    }[],
    scheduledAt: "", // ISO datetime
    vehicleId: "", // UUID
    notes: "",
    specialRequests: "",
  });

  const [vehicles] = useState([
    {
      id: "1",
      name: "Luxury Sedan",
      description: "Mercedes-Benz S-Class or similar",
      capacity: 3,
      price: 150,
      image: "🚗",
      features: ["Leather seats", "Climate control", "Wi-Fi", "Water bottles"],
    },
    {
      id: "2",
      name: "Premium SUV",
      description: "Cadillac Escalade or similar",
      capacity: 6,
      price: 200,
      image: "🚙",
      features: [
        "Extra space",
        "Premium sound",
        "Privacy partition",
        "Refreshments",
      ],
    },
    {
      id: "3",
      name: "Executive Van",
      description: "Mercedes Sprinter or similar",
      capacity: 12,
      price: 300,
      image: "🚐",
      features: [
        "Group seating",
        "Conference setup",
        "Entertainment system",
        "Catering space",
      ],
    },
  ]);

  const [pricing, setPricing] = useState({
    baseFare: 50,
    perMile: 3,
    perMinute: 0.5,
    totalDistance: 0,
    totalTime: 0,
    vehicleRate: 0,
    total: 0,
  });

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [originalBookingId, setOriginalBookingId] = useState<string | null>(
    null
  );

  // Check if we're in modify mode and pre-fill data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isModify = urlParams.get("modify") === "true";

    if (isModify) {
      const modifyBookingData = localStorage.getItem("modifyBooking");
      if (modifyBookingData) {
        const booking = JSON.parse(modifyBookingData);
        setIsModifyMode(true);
        setOriginalBookingId(booking.id);
        setBookingData({
          pickup: booking.pickup,
          dropoff: booking.dropoff,
          stops: booking.stops,
          date: booking.date,
          time: booking.time,
          vehicleId: booking.vehicleId,
          passengers: booking.passengers,
          notes: booking.notes,
          route: booking.route,
        });

        // Set pricing if available
        if (booking.pricing) {
          setPricing({
            baseFare: 50,
            perMile: 3,
            perMinute: 0.5,
            totalDistance: booking.route?.distance || 0,
            totalTime: booking.route?.duration || 0,
            vehicleRate:
              booking.pricing.total -
              50 -
              (booking.route?.distance || 0) * 3 -
              (booking.route?.duration || 0) * 0.5,
            total: booking.pricing.total,
          });
        }

        // Clear the modify booking data from localStorage
        localStorage.removeItem("modifyBooking");
      }
    }
  }, []);

  // Calculate route using Google Maps data
  const calculateRoute = async () => {
    if (!bookingData.pickup || !bookingData.dropoff) {
      alert("Please enter both pickup and dropoff locations");
      return;
    }

    setIsCalculatingRoute(true);

    try {
      // This simulates calling Google Maps API through your backend or AI service
      const routeData = await getRouteFromGoogleMaps(
        bookingData.pickup,
        bookingData.dropoff,
        bookingData.stops
      );

      setBookingData((prev) => ({ ...prev, route: routeData }));

      // Update pricing based on real route data
      const selectedVehicle = vehicles.find(
        (v) => v.id === bookingData.vehicleId
      );
      const vehicleRate = selectedVehicle ? selectedVehicle.price : 0;

      const newPricing = {
        baseFare: 50,
        perMile: 3,
        perMinute: 0.5,
        totalDistance: routeData.distance,
        totalTime: routeData.duration,
        vehicleRate,
        total:
          50 + routeData.distance * 3 + routeData.duration * 0.5 + vehicleRate,
      };

      setPricing(newPricing);
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Error calculating route. Please try again.");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Helper function to calculate more realistic distances
  const calculateRealisticDistance = (location1: string, location2: string) => {
    // In a real implementation, you could use geocoding to get coordinates
    // and calculate more accurate estimates

    // For now, simulate based on location names
    const loc1 = location1.toLowerCase();
    const loc2 = location2.toLowerCase();

    // Check if locations seem to be in same area (similar street names, etc.)
    const sameArea =
      loc1.includes(loc2.split(" ")[0]) || loc2.includes(loc1.split(" ")[0]);

    if (sameArea) {
      return Math.random() * 3 + 1; // 1-4 miles for nearby locations
    } else {
      // Check for cross-town patterns
      const crossTown =
        (loc1.includes("north") && loc2.includes("south")) ||
        (loc1.includes("east") && loc2.includes("west")) ||
        (loc1.includes("downtown") &&
          (loc2.includes("suburb") || loc2.includes("airport")));

      if (crossTown) {
        return Math.random() * 15 + 8; // 8-23 miles for cross-town
      } else {
        return Math.random() * 10 + 3; // 3-13 miles for typical city travel
      }
    }
  };

  // Real Google Maps route calculation using server-side API
  const getRouteFromGoogleMaps = async (
    pickup: string,
    dropoff: string,
    stops: string[]
  ) => {
    try {
      console.log(
        "Calculating route from:",
        pickup,
        "to:",
        dropoff,
        "with stops:",
        stops
      );

      // Call our server-side API route
      const response = await fetch("/api/calculate-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup,
          dropoff,
          stops: stops.filter((s) => s.trim() !== ""),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Route calculation result:", data);

      if (data.status === "success" || data.status === "fallback") {
        return {
          distance: data.distance,
          duration: data.duration,
          summary: data.summary,
          polyline: data.polyline,
          waypoints: data.waypoints,
        };
      } else {
        throw new Error(data.error || "Route calculation failed");
      }
    } catch (error) {
      console.error("Route calculation error:", error);

      // Enhanced fallback calculation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const locations = [
        pickup,
        ...stops.filter((s) => s.trim() !== ""),
        dropoff,
      ];
      let totalDistance = 0;

      // More realistic distance calculation
      for (let i = 0; i < locations.length - 1; i++) {
        const segmentDistance = calculateRealisticDistance(
          locations[i],
          locations[i + 1]
        );
        totalDistance += segmentDistance;
      }

      // Add realistic routing overhead for actual roads
      totalDistance *= 1.4; // 40% overhead for road routing vs straight line

      // Calculate duration with traffic and stops
      let duration = totalDistance * 3.2; // ~3.2 minutes per mile with traffic
      duration += stops.filter((s) => s.trim() !== "").length * 3; // 3 minutes per stop

      return {
        distance: Math.round(totalDistance * 10) / 10,
        duration: Math.round(duration),
        summary: `Estimated route with ${
          stops.filter((s) => s.trim() !== "").length
        } stops (network error)`,
        polyline: "fallback_polyline",
        waypoints: locations,
      };
    }
  };

  const addStop = () => {
    setBookingData((prev) => ({
      ...prev,
      stops: [...prev.stops, ""],
    }));
  };

  const updateStop = (index: number, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop, i) => (i === index ? value : stop)),
    }));
  };

  const removeStop = (index: number) => {
    setBookingData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleBooking = async () => {
    try {
      const payload: any = {
        vehicleId: bookingData.vehicleId, // UUID
        pickupAddressId: bookingData.pickupAddressId, // UUID
        dropoffAddressId: bookingData.dropoffAddressId, // UUID
        scheduledAt: bookingData.scheduledAt, // ISO datetime
        stops: bookingData.stops, // array of {address, latitude, longitude, order}
        notes: bookingData.notes,
        specialRequests: bookingData.specialRequests,
      };

      if (isModifyMode && originalBookingId) {
        await apiClient.updateBooking(originalBookingId, payload);
        alert("Trip updated successfully! Redirecting to your trips...");
      } else {
        await apiClient.createBooking(payload);
        alert("Booking confirmed! Redirecting to your trips...");
      }

      window.location.href = "/trips";
    } catch (error: any) {
      console.error("Booking error:", error);
      alert(error?.message || "Failed to submit booking. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-0.5 ml-2 ${
                    currentStep > step ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Locations & Time */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Trip Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                value={bookingData.pickup}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    pickup: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                placeholder="Enter pickup address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dropoff Location
              </label>
              <input
                type="text"
                value={bookingData.dropoff}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    dropoff: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                placeholder="Enter destination address"
              />
            </div>

            {/* Additional Stops */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Stops (Optional)
                </label>
                <button
                  onClick={addStop}
                  className="text-sm text-black hover:text-gray-600 font-medium"
                >
                  + Add Stop
                </button>
              </div>

              {bookingData.stops.map((stop, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => updateStop(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                    placeholder={`Stop ${index + 1} address`}
                  />
                  <button
                    onClick={() => removeStop(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Passengers
              </label>
              <select
                value={bookingData.passengers}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    passengers: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} passenger{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Route Calculation */}
            <div className="border-t pt-4">
              <button
                onClick={calculateRoute}
                disabled={
                  isCalculatingRoute ||
                  !bookingData.pickup ||
                  !bookingData.dropoff
                }
                className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculatingRoute
                  ? "Calculating Route..."
                  : "Calculate Route & Pricing"}
              </button>

              {bookingData.route && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-semibold text-black mb-2">
                    Route Summary
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Distance:</strong> {bookingData.route.distance}{" "}
                      miles
                    </p>
                    <p>
                      <strong>Duration:</strong> {bookingData.route.duration}{" "}
                      minutes
                    </p>
                    <p>
                      <strong>Route:</strong> {bookingData.route.summary}
                    </p>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(
                        bookingData.pickup + " to " + bookingData.dropoff
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View in Google Maps
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                      href={`http://maps.apple.com/?q=${encodeURIComponent(
                        bookingData.pickup + " to " + bookingData.dropoff
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View in Apple Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!bookingData.route}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle Selection */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Select Vehicle</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => {
                  setBookingData((prev) => ({
                    ...prev,
                    vehicleId: vehicle.id,
                  }));
                  const newPricing = {
                    ...pricing,
                    vehicleRate: vehicle.price,
                    total:
                      pricing.baseFare +
                      pricing.totalDistance * pricing.perMile +
                      pricing.totalTime * pricing.perMinute +
                      vehicle.price,
                  };
                  setPricing(newPricing);
                }}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  bookingData.vehicleId === vehicle.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{vehicle.image}</div>
                  <h3 className="font-semibold text-black mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {vehicle.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Up to {vehicle.capacity} passengers
                  </p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    {vehicle.features.map((feature, index) => (
                      <div key={index}>• {feature}</div>
                    ))}
                  </div>
                  <div className="font-semibold text-black">
                    ${vehicle.price} base rate
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="border border-gray-300 text-black px-6 py-2 rounded-md font-medium hover:border-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!bookingData.vehicleId}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Pricing */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">
            Review Your Booking
          </h2>

          <div className="space-y-6">
            {/* Trip Summary */}
            <div>
              <h3 className="font-semibold text-black mb-3">Trip Details</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-2 text-black">
                <div>
                  <strong>From:</strong> {bookingData.pickup}
                </div>
                <div>
                  <strong>To:</strong> {bookingData.dropoff}
                </div>
                {bookingData.stops.length > 0 && (
                  <div>
                    <strong>Stops:</strong> {bookingData.stops.join(", ")}
                  </div>
                )}
                <div>
                  <strong>Date & Time:</strong> {bookingData.date} at{" "}
                  {bookingData.time}
                </div>
                <div>
                  <strong>Passengers:</strong> {bookingData.passengers}
                </div>
                <div>
                  <strong>Vehicle:</strong>{" "}
                  {vehicles.find((v) => v.id === bookingData.vehicleId)?.name}
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h3 className="font-semibold text-black mb-3">Pricing</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-2 text-black">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>${pricing.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Distance ({pricing.totalDistance} miles × ${pricing.perMile}
                    /mile)
                  </span>
                  <span>
                    ${(pricing.totalDistance * pricing.perMile).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Time ({pricing.totalTime} min × ${pricing.perMinute}/min)
                  </span>
                  <span>
                    ${(pricing.totalTime * pricing.perMinute).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle rate</span>
                  <span>${pricing.vehicleRate}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg text-black">
                  <span>Total</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                placeholder="Any special requests or instructions for your chauffeur..."
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="border border-gray-300 text-black px-6 py-2 rounded-md font-medium hover:border-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Payment</h2>

          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-black mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="text-black"
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" className="text-black" />
                  <span>📱 Apple Pay</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" className="text-black" />
                  <span>🎯 Google Pay</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            <div>
              <h3 className="font-semibold text-black mb-3">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(3)}
              className="border border-gray-300 text-black px-6 py-2 rounded-md font-medium hover:border-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleBooking}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              {isModifyMode ? "Update Trip" : "Complete Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookRide() {
  return (
    <AuthCheck requiredRole="customer">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
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
        <BookRideContent />
      </div>
    </AuthCheck>
  );
}
