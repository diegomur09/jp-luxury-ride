# 🔌 Connecting Your Frontend to Backend

## Current Status:

✅ **Frontend API Client**: Created and updated (`src/lib/api.ts`)  
✅ **Backend Available**: Found at `../lux-ride_backend`  
✅ **Environment Variables**: Updated in `.env.local`

---

## 🚀 How to Start Everything

### Step 1: Start Your Backend (First)

Open a new terminal and run:

```powershell
cd ..\lux-ride_backend
npm install
npm run dev
```

**Backend will run on:** `http://localhost:3001`

### Step 2: Keep Your Frontend Running

In your current terminal:

```powershell
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## 🔄 How to Convert Your Pages

### Replace localStorage with API calls:

#### BEFORE (localStorage):

```javascript
// Old way in your components
const savedBookings = localStorage.getItem("bookings");
const bookings = JSON.parse(savedBookings || "[]");
```

#### AFTER (Backend API):

```javascript
// New way using backend
import { apiClient } from "../lib/api";

const [bookings, setBookings] = useState([]);

useEffect(() => {
  const loadBookings = async () => {
    try {
      const userBookings = await apiClient.getBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };
  loadBookings();
}, []);
```

---

## 🎯 Convert These Files:

### 1. **Homepage** (`src/app/page.tsx`)

**Replace:**

```javascript
// Line 14: const savedUser = localStorage.getItem("user");
// Line 58: localStorage.setItem("user", JSON.stringify(userData));
```

**With:**

```javascript
// Login with backend
const handleLogin = async (userData) => {
  try {
    const { user, token } = await apiClient.login(
      userData.email,
      userData.password
    );
    setUser(user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### 2. **Book Page** (`src/app/book/page.tsx`)

**Replace:**

```javascript
// Line 310: JSON.parse(localStorage.getItem("bookings") || "[]")
// Line 329: localStorage.setItem("bookings", JSON.stringify(updatedBookings));
```

**With:**

```javascript
// Create booking with backend
const handleSubmit = async () => {
  try {
    const newBooking = await apiClient.createBooking(bookingData);
    console.log("Booking created:", newBooking);
  } catch (error) {
    console.error("Booking failed:", error);
  }
};
```

### 3. **Trips Page** (`src/app/trips/page.tsx`)

**Replace:**

```javascript
// Line 51: const savedBookings = localStorage.getItem("bookings");
// Line 107: localStorage.setItem("bookings", JSON.stringify(updatedBookings));
```

**With:**

```javascript
// Load and manage bookings with backend
const [bookings, setBookings] = useState([]);

useEffect(() => {
  const loadBookings = async () => {
    try {
      const userBookings = await apiClient.getBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };
  loadBookings();
}, []);

const handleDeleteTrip = async (id) => {
  try {
    await apiClient.deleteBooking(id);
    setBookings(bookings.filter((b) => b.id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
```

---

## 🔧 Testing the Connection

### 1. Start Both Servers

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

### 2. Test API Connection

Add this to any component to test:

```javascript
import { checkBackendConnection } from "../lib/api";

const testConnection = async () => {
  const isConnected = await checkBackendConnection();
  console.log("Backend connected:", isConnected);
};
```

### 3. Check Browser Console

- Look for API calls in Network tab
- Check for any CORS errors
- Verify authentication tokens

---

## 🛠️ Common Issues & Solutions

### Problem: CORS Errors

**Solution:** Make sure backend has CORS enabled for `http://localhost:3000`

### Problem: "Network Error"

**Solution:** Check if backend is running on port 3001

### Problem: Authentication Failed

**Solution:** Make sure you have valid user accounts in your backend database

---

## 📋 Next Steps

1. **Start the backend server**
2. **Test the connection**
3. **Convert one page at a time** (start with homepage login)
4. **Test each conversion** before moving to the next

**Would you like me to help you convert any specific page first?**
