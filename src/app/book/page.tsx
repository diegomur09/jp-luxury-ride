"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import Navigation from "../components/Navigation";
import { apiClient } from "@/lib/api";
import GoogleMap from "../components/GoogleMap";

function BookRideContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupStreet: "",
    pickupCity: "",
    dropoffStreet: "",
    dropoffCity: "",
    stops: [] as { street: string; city: string; latitude: number; longitude: number; order: number }[],
    scheduledAt: "",
    vehicleId: "",
    notes: "",
    specialRequests: "",
  });
  const [routePolyline, setRoutePolyline] = useState<string>("");
  const [pricing, setPricing] = useState({
    perMile: 5.2,
    totalDistance: 0,
    totalTime: 0,
    total: 0,
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
      features: ["Extra space", "Premium sound", "Privacy partition", "Refreshments"],
    },
    {
      id: "3",
      name: "Executive Van",
      description: "Mercedes Sprinter or similar",
      capacity: 12,
      price: 300,
      image: "🚐",
      features: ["Group seating", "Conference setup", "Entertainment system", "Catering space"],
    },
  ]);

  // Error state for user-friendly messages
  const [error, setError] = useState<string | null>(null);
  // Debug info for troubleshooting
  const [debugInfo, setDebugInfo] = useState<{user: any, token: string | null} | null>(null);

  // On mount, show user/token for debugging
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      setDebugInfo({
        user: user ? JSON.parse(user) : null,
        token: token || null,
      });
    } catch {
      setDebugInfo(null);
    }
  }, []);

  function addStop() {
    setBookingData((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        { street: "", city: "", latitude: 0, longitude: 0, order: prev.stops.length + 1 },
      ],
    }));
  }

  function updateStop(index: number, street: string, city: string) {
    setBookingData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop, i) =>
        i === index ? { ...stop, street, city } : stop
      ),
    }));
  }

  function removeStop(index: number) {
    setBookingData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  }


  // Example booking submission with error handling
  async function handleBooking() {
    setError(null);
    try {
      await apiClient.createBooking(bookingData);
      setError(null);
      // Optionally show a success message or redirect
    } catch (err: any) {
      if (err.message && err.message.includes("401")) {
        setError("Your session has expired or you are not authorized. Please log in again.");
      } else if (err.message) {
        setError("Sorry, something went wrong: " + err.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  // Calculate route distance using Google Maps Directions API
  useEffect(() => {
    const fetchRouteDistance = async () => {
      const pickup = `${bookingData.pickupStreet}, ${bookingData.pickupCity}`;
      const dropoff = `${bookingData.dropoffStreet}, ${bookingData.dropoffCity}`;
      const stops = bookingData.stops.filter(s => s.street && s.city).map(s => `${s.street}, ${s.city}`);
      if (!pickup.trim() || !dropoff.trim()) {
        setPricing(p => ({ ...p, totalDistance: 0, totalTime: 0 }));
        return;
      }
      try {
        // Use Google Maps Directions API via backend proxy (recommended for API key security)
        const res = await fetch("/api/calculate-route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pickup, dropoff, stops }),
        });
        if (!res.ok) throw new Error("Failed to calculate route");
        const data = await res.json();
            setPricing(p => ({
              ...p,
              totalDistance: data.distance || 0,
              totalTime: data.duration || 0,
            }));
        if (data.polyline) setRoutePolyline(data.polyline);
      } catch {
        setPricing(p => ({ ...p, totalDistance: 0, totalTime: 0 }));
      }
    };
    fetchRouteDistance();
  }, [bookingData.pickupStreet, bookingData.pickupCity, bookingData.dropoffStreet, bookingData.dropoffCity, bookingData.stops]);

  // Render multi-step form with error handling
  return (
  <div className="bg-white p-6 rounded shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong> <span>{error}</span>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {["Ride Details", "Vehicle", "Review", "Confirm"].map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${currentStep === idx + 1 ? "bg-black" : "bg-gray-300"}`}>{idx + 1}</div>
            <span className={`text-xs ${currentStep === idx + 1 ? "font-bold text-black" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Ride Details */}
      {currentStep === 1 && (
        <form
          onSubmit={e => {
            e.preventDefault();
            setCurrentStep(2);
          }}
          className="space-y-4"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-black">Pickup Street</label>
              <input type="text" className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" required value={bookingData.pickupStreet} onChange={e => setBookingData(b => ({ ...b, pickupStreet: e.target.value }))} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-black">Pickup City</label>
              <input type="text" className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" required value={bookingData.pickupCity} onChange={e => setBookingData(b => ({ ...b, pickupCity: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-black">Dropoff Street</label>
              <input type="text" className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" required value={bookingData.dropoffStreet} onChange={e => setBookingData(b => ({ ...b, dropoffStreet: e.target.value }))} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-black">Dropoff City</label>
              <input type="text" className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" required value={bookingData.dropoffCity} onChange={e => setBookingData(b => ({ ...b, dropoffCity: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Stops (optional)</label>
            {bookingData.stops.map((stop, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input type="text" placeholder="Street" className="border rounded px-2 py-1 flex-1 bg-white text-black border-gray-300 placeholder-gray-400" value={stop.street} onChange={e => updateStop(idx, e.target.value, stop.city)} />
                <input type="text" placeholder="City" className="border rounded px-2 py-1 flex-1 bg-white text-black border-gray-300 placeholder-gray-400" value={stop.city} onChange={e => updateStop(idx, stop.street, e.target.value)} />
                <button type="button" className="text-red-500 text-xs ml-2" onClick={() => removeStop(idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="text-xs text-blue-600 mt-1" onClick={addStop}>+ Add Stop</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Scheduled At</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" required value={bookingData.scheduledAt} onChange={e => setBookingData(b => ({ ...b, scheduledAt: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Notes</label>
            <textarea className="w-full border rounded px-3 py-2 bg-white text-black border-gray-300 placeholder-gray-400" value={bookingData.notes} onChange={e => setBookingData(b => ({ ...b, notes: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded">Next</button>
          </div>
        </form>
      )}

      {/* Step 2: Vehicle Selection */}
      {currentStep === 2 && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2 text-black">Select a Vehicle</h3>
            <div className="grid grid-cols-1 gap-4">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className={`border rounded p-4 flex items-center gap-4 cursor-pointer ${bookingData.vehicleId === vehicle.id ? "border-black bg-gray-100" : "border-gray-200"}`} onClick={() => setBookingData(b => ({ ...b, vehicleId: vehicle.id }))}>
                  <span className="text-3xl mr-2">{vehicle.image}</span>
                  <div className="flex-1">
                    <div className="font-bold text-black">{vehicle.name}</div>
                    <div className="text-xs text-black mb-1">{vehicle.description}</div>
                    <div className="text-xs text-black">Capacity: {vehicle.capacity}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vehicle.features.map(f => <span key={f} className="bg-gray-200 text-xs px-2 py-0.5 rounded text-black">{f}</span>)}
                    </div>
                  </div>
                  {bookingData.vehicleId === vehicle.id && <span className="text-green-600 font-bold ml-2">Selected</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button className="px-4 py-2 rounded border border-black text-black" onClick={() => setCurrentStep(1)}>Back</button>
            <button className="bg-black text-white px-6 py-2 rounded" disabled={!bookingData.vehicleId} onClick={() => setCurrentStep(3)}>Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-black">Review Your Booking</h3>
          <div className="mb-2 text-black"><b>Pickup:</b> {bookingData.pickupStreet}, {bookingData.pickupCity}</div>
          <div className="mb-2 text-black"><b>Dropoff:</b> {bookingData.dropoffStreet}, {bookingData.dropoffCity}</div>
          {bookingData.stops.length > 0 && (
            <div className="mb-2 text-black"><b>Stops:</b> {bookingData.stops.map((s, i) => `${s.street}, ${s.city}`).join(" | ")}</div>
          )}
          <div className="mb-2 text-black"><b>Scheduled At:</b> {bookingData.scheduledAt}</div>
          <div className="mb-2 text-black"><b>Vehicle:</b> {vehicles.find(v => v.id === bookingData.vehicleId)?.name || "-"}</div>
          <div className="mb-2 text-black"><b>Notes:</b> {bookingData.notes || "-"}</div>
          {bookingData.pickupStreet && bookingData.pickupCity && bookingData.dropoffStreet && bookingData.dropoffCity && (
            <div className="mb-4">
              <a
                className="text-blue-600 underline text-sm"
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(bookingData.pickupStreet + ', ' + bookingData.pickupCity)}&destination=${encodeURIComponent(bookingData.dropoffStreet + ', ' + bookingData.dropoffCity)}${bookingData.stops.length > 0 ? `&waypoints=${encodeURIComponent(bookingData.stops.map(s => s.street + ', ' + s.city).join('|'))}` : ''}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Route in Google Maps
              </a>
            </div>
          )}
          {/* Pricing calculation and display */}
          <div className="my-4 p-4 bg-gray-100 rounded">
            <div className="text-black mb-1"><b>Miles:</b> {pricing.totalDistance.toFixed(2)}</div>
            <div className="text-black mb-1"><b>Duration:</b> {pricing.totalTime} min</div>
            <div className="text-black text-lg font-bold"><b>Total Price:</b> ${ (pricing.totalDistance * pricing.perMile).toFixed(2) }</div>
          </div>

          <div className="flex justify-between gap-2 mt-6">
            <button className="px-4 py-2 rounded border border-black text-black" onClick={() => setCurrentStep(2)}>Back</button>
            <button className="bg-black text-white px-6 py-2 rounded" onClick={() => setCurrentStep(4)}>Confirm</button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm & Submit */}
      {currentStep === 4 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Confirm & Submit</h3>
          <div className="mb-4">Please review your booking details and submit your request.</div>
          <div className="flex justify-between gap-2">
            <button className="px-4 py-2 rounded border" onClick={() => setCurrentStep(3)}>Back</button>
            <button className="bg-green-600 text-white px-6 py-2 rounded" onClick={handleBooking}>Submit Booking</button>
          </div>
        </div>
      )}
    </div>
  );
}
// Default export for Next.js page
export default function BookRidePage() {
  return (
    <AuthCheck>
      <Navigation />
      <main className="max-w-3xl mx-auto py-8 px-2">
        <BookRideContent />
      </main>
    </AuthCheck>
  );
}
