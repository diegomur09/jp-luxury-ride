// Simple connection test for your frontend
import { apiClient, checkBackendConnection } from "../lib/api";

export async function testBackendConnection() {
  console.log("🔍 Testing backend connection...");

  try {
    // Test 1: Check if backend is reachable
    const isReachable = await checkBackendConnection();
    console.log("Backend reachable:", isReachable);

    // Test 2: Try a simple API call
    const response = await fetch("http://localhost:3001/api/health");
    console.log("Health check response:", response.status);

    // Test 3: Try authentication endpoint
    try {
      await apiClient.getProfile();
      console.log("✅ Backend is connected and working!");
      return true;
    } catch (error) {
      console.log("ℹ️ Backend reachable but not authenticated (normal)");
      return true;
    }
  } catch (error) {
    console.log("❌ Backend connection failed:", error);
    return false;
  }
}

// Add this function to any component to test
export function ConnectionTester() {
  const handleTest = async () => {
    await testBackendConnection();
  };

  return (
    <button
      onClick={handleTest}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Test Backend Connection
    </button>
  );
}
