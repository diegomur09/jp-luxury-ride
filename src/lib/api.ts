// API client to connect to the lux-ride_backend
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// API client class for making requests to the backend
export class ApiClient {
  private baseUrl: string;
  constructor() {
    this.baseUrl = API_BASE_URL;
  }


  // Make HTTP request with authentication
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Always get the latest token from localStorage
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  }

  async register(userData: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data;
  }

  async logout() {
    await this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // User profile methods
  async getProfile() {
    return this.request<any>('/api/auth/profile');
  }

  async getUserByEmail(email: string) {
    return this.request<any>(`/api/users?email=${encodeURIComponent(email)}`);
  }
  async updateProfile(profileData: any) {
    return this.request<any>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Booking methods
  async createBooking(bookingData: any) {
    return this.request<any>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(userId?: string) {
    const endpoint = userId ? `/api/bookings?userId=${userId}` : '/api/bookings';
    return this.request<any[]>(endpoint);
  }

  async getBooking(bookingId: string) {
    return this.request<any>(`/api/bookings/${bookingId}`);
  }

  async updateBooking(bookingId: string, updateData: any) {
    return this.request<any>(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async cancelBooking(bookingId: string, reason?: string) {
    return this.request<any>(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async deleteBooking(bookingId: string) {
    return this.request<any>(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async createPaymentIntent(amount: number, bookingId: string) {
    return this.request<{ clientSecret: string }>('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, bookingId }),
    });
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    return this.request<any>('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, paymentMethodId }),
    });
  }

  async getPaymentHistory() {
    return this.request<any[]>('/api/payments/history');
  }

  // Driver methods (if user is a driver)
  async getDriverTrips() {
    return this.request<any[]>('/api/driver/trips');
  }

  async updateDriverStatus(status: string) {
    return this.request<any>('/api/driver/status', {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getDriverEarnings() {
    return this.request<any>('/api/driver/earnings');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Helper function to check if backend is running
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Export types for frontend use
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'driver' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  pickupAddress: string;
  dropoffAddress: string;
  stops: string[];
  scheduledDate: string;
  scheduledTime: string;
  passengerCount: number;
  vehicleType: string;
  specialNotes?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

// Legacy export for backward compatibility
export const apiService = apiClient;