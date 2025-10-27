#  Your Next.js Frontend Integration

##  What's Done:

1. **Dependencies Installed:** 
   - @supabase/supabase-js
   - @stripe/stripe-js  
   - @stripe/react-stripe-js
   - axios

2. **Integration Files Created:** 
   - src/lib/supabase.ts (Supabase client)
   - src/lib/api.ts (Backend API service)
   - src/hooks/useAuth.ts (Authentication hook)
   - src/app/components/PaymentForm.tsx (Stripe payments)
   - src/app/components/BookingIntegration.tsx (Example integration)

3. **Environment Variables Added:** 
   - NEXT_PUBLIC_API_URL=http://localhost:3001
   - Supabase and Stripe placeholders

##  What You Need to Do:

### Step 1: Update Environment Variables

Edit your .env.local file with real values:

`env
# Backend Integration  
NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase Configuration (get these from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key

# Stripe Configuration (get these from your Stripe dashboard) 
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-actual-stripe-key
`

### Step 2: Start Both Servers

Terminal 1 - Backend:
`powershell
cd ..\lux-ride_backend
npm run dev
`

Terminal 2 - Frontend (this folder):
`powershell
npm run dev
`

### Step 3: Update Your Existing Components

You can now integrate the backend into your existing pages:

#### A. Add Authentication to Your Layout

Update src/app/layout.tsx:
`	ypescript
import { useAuth } from '../hooks/useAuth'

// Add authentication context to your layout
`

#### B. Update Your Book Page

In src/app/book/page.tsx, import and use:
`	ypescript
import { useAuth } from '../../hooks/useAuth'
import { apiService } from '../../lib/api'
import BookingIntegration from '../components/BookingIntegration'

// Replace your existing booking form with integrated version
`

#### C. Update Your Account Page

In src/app/account/page.tsx:
`	ypescript
import { useAuth } from '../../hooks/useAuth'

export default function AccountPage() {
  const { user, login, logout } = useAuth()
  
  // Use real authentication instead of mock data
}
`

### Step 4: Test Integration

1. **Start both servers** (backend on :3001, frontend on :3000)
2. **Go to your frontend** http://localhost:3000
3. **Test registration/login** in your account page
4. **Test booking creation** in your book page
5. **Test payment processing** with test cards

### Step 5: Replace Mock Data

Look for these in your existing components and replace with API calls:

`	ypescript
// Replace this:
const mockBookings = [...]

// With this:
const { data } = await apiService.getBookings()
`

##  Integration Examples:

### Login Component (for your account page):
`	ypescript
'use client'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm() {
  const { login, user, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      // Redirect or show success
    } catch (error) {
      alert('Login failed: ' + error.message)
    }
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.firstName}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return <form onSubmit={handleLogin}>...</form>
}
`

### Booking List (for your trips page):
`	ypescript
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { apiService } from '../../lib/api'

export default function BookingsList() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    try {
      const data = await apiService.getBookings()
      setBookings(data.bookings)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.vehicle.make} {booking.vehicle.model}
          Status: {booking.status}
        </div>
      ))}
    </div>
  )
}
`

##  Important Notes:

1. **Backend Must Be Running**: Make sure your backend is running on port 3001
2. **Environment Variables**: Update .env.local with real Supabase and Stripe keys
3. **CORS**: Backend and frontend run on different ports (3001 vs 3000)
4. **Authentication**: Users must be logged in to make API calls
5. **Error Handling**: All API calls include proper error handling

##  Testing Your Integration:

1. Open browser console (F12)
2. Check for any errors
3. Test API calls:
   `javascript
   // In browser console after login
   fetch('http://localhost:3001/api/bookings', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('sb-access-token') }
   }).then(r => r.json()).then(console.log)
   `

##  Ready to Use:

Your frontend now has:
-  Real authentication with Supabase
-  Backend API integration 
-  Stripe payment processing
-  Booking management
-  User management
-  Error handling

Just update your existing components to use the new hooks and services!
