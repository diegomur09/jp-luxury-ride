'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { apiService } from '../../lib/api'

interface Vehicle {
  id: string
  make: string
  model: string
  type: string
  pricePerHour: number
  features: string[]
}

export default function BookingIntegration() {
  const { user, loading: authLoading } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    vehicleId: '',
    scheduledAt: '',
    notes: '',
    // You'll need to add address selection logic
    pickupAddressId: '',
    dropoffAddressId: ''
  })

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  const loadVehicles = async () => {
    try {
      // This will call your backend /api/vehicles endpoint
      const data = await apiService.getVehicles()
      setVehicles(data.vehicles || [])
    } catch (error: any) {
      setError('Failed to load vehicles: ' + error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please log in to book a ride')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const booking = await apiService.createBooking(formData)
      setSuccess(Booking created successfully! Booking ID: )
      
      // Reset form or redirect to payment
      setFormData({
        vehicleId: '',
        scheduledAt: '',
        notes: '',
        pickupAddressId: '',
        dropoffAddressId: ''
      })
    } catch (error: any) {
      setError('Booking failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Please log in to book a ride</h2>
        <p>You need to be authenticated to access the booking system.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle
          </label>
          <select
            value={formData.vehicleId}
            onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} - /hr
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Any special requests or notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {loading ? 'Creating Booking...' : 'Book Ride'}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  )
}
