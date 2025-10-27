"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import Navigation from "../components/Navigation";

function AccountContent() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    preferences: {
      temperature: "comfortable",
      music: "classical",
      refreshments: "water",
      notifications: {
        email: true,
        sms: true,
        marketing: false,
      },
    },
  });

  const [savedAddresses, setSavedAddresses] = useState([
    { id: "1", label: "Home", address: "123 Main St, New York, NY 10001" },
    { id: "2", label: "Work", address: "456 Business Ave, New York, NY 10002" },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "1", type: "card", last4: "4242", brand: "Visa", isDefault: true },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      isDefault: false,
    },
  ]);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileData((prev) => ({
        ...prev,
        name: parsed.name || "",
        email: parsed.email || "",
      }));
    }
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Update user data
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    alert("Profile updated successfully!");
  };

  const addAddress = () => {
    const label = prompt(
      'Enter label for this address (e.g., "Home", "Office"):'
    );
    const address = prompt("Enter the address:");

    if (label && address) {
      const newAddress = {
        id: Math.random().toString(36),
        label,
        address,
      };
      setSavedAddresses((prev) => [...prev, newAddress]);
    }
  };

  const removeAddress = (id: string) => {
    if (confirm("Remove this address?")) {
      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  const addPaymentMethod = () => {
    alert("Payment method integration would connect to Stripe here");
  };

  const removePaymentMethod = (id: string) => {
    if (confirm("Remove this payment method?")) {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "payments", label: "Payment", icon: "💳" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-black mb-6">
            Personal Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={profileData.emergencyContact}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                placeholder="Enter your home address"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">
              Saved Addresses
            </h2>
            <button
              onClick={addAddress}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Add Address
            </button>
          </div>

          <div className="space-y-4">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
              >
                <div>
                  <div className="font-medium text-black">{address.label}</div>
                  <div className="text-sm text-gray-600">{address.address}</div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm text-black hover:text-gray-600">
                    Edit
                  </button>
                  <button
                    onClick={() => removeAddress(address.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">
              Payment Methods
            </h2>
            <button
              onClick={addPaymentMethod}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Add Card
            </button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {method.brand.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      •••• •••• •••• {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.brand} ending in {method.last4}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button className="text-sm text-black hover:text-gray-600">
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => removePaymentMethod(method.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-black mb-6">
            Ride Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature Preference
              </label>
              <select
                value={profileData.preferences.temperature}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      temperature: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
              >
                <option value="cool">Cool (68-70°F)</option>
                <option value="comfortable">Comfortable (70-72°F)</option>
                <option value="warm">Warm (72-75°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music Preference
              </label>
              <select
                value={profileData.preferences.music}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    preferences: { ...prev.preferences, music: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
              >
                <option value="none">No music</option>
                <option value="classical">Classical</option>
                <option value="jazz">Jazz</option>
                <option value="ambient">Ambient</option>
                <option value="ask">Ask driver</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refreshments
              </label>
              <select
                value={profileData.preferences.refreshments}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      refreshments: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
              >
                <option value="water">Water</option>
                <option value="sparkling">Sparkling water</option>
                <option value="none">No refreshments</option>
                <option value="ask">Ask what's available</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Notifications
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            email: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="mr-3 text-black focus:ring-black"
                  />
                  Email notifications for bookings and updates
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications.sms}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            sms: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="mr-3 text-black focus:ring-black"
                  />
                  SMS updates for trip status
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications.marketing}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            marketing: e.target.checked,
                          },
                        },
                      }))
                    }
                    className="mr-3 text-black focus:ring-black"
                  />
                  Marketing emails and promotions
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => alert("Preferences saved!")}
                className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-black mb-6">
            Privacy & Security
          </h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-black mb-2">Data Usage</h3>
              <p className="text-sm text-gray-600 mb-4">
                We collect and use your data to provide our chauffeur services,
                improve our platform, and communicate with you about your
                bookings.
              </p>
              <a
                href="#"
                className="text-sm text-black hover:text-gray-600 font-medium"
              >
                View Privacy Policy →
              </a>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-black mb-2">
                Marketing Communications
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Control how we contact you about promotions, new features, and
                service updates.
              </p>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.preferences.notifications.marketing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: {
                          ...prev.preferences.notifications,
                          marketing: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="mr-3 text-black focus:ring-black"
                />
                I consent to receiving marketing communications
              </label>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-black mb-2">
                Account Security
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Keep your account secure by using a strong password and enabling
                two-factor authentication.
              </p>
              <div className="space-y-2">
                <button className="block text-sm text-black hover:text-gray-600 font-medium">
                  Change Password →
                </button>
                <button className="block text-sm text-black hover:text-gray-600 font-medium">
                  Enable Two-Factor Authentication →
                </button>
              </div>
            </div>

            <div className="border border-red-200 rounded-md p-4">
              <h3 className="font-semibold text-red-600 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Request Account Deletion →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Account() {
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
        <AccountContent />
      </div>
    </AuthCheck>
  );
}
