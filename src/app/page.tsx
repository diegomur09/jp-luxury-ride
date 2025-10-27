"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      // Route user to appropriate page based on their role
      setTimeout(() => {
        routeUserByRole(userData.role);
      }, 1000);
    }
    setIsLoading(false);
  }, []);

  const routeUserByRole = (role: string) => {
    switch (role) {
      case "admin":
        window.location.href = "/admin/dashboard";
        break;
      case "driver":
        window.location.href = "/driver/schedule";
        break;
      case "customer":
      default:
        window.location.href = "/book";
        break;
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = (formData.get("role") as string) || "customer";

    // Mock authentication - in real app, use proper auth service
    const userData = {
      id: Math.random().toString(36),
      email,
      name: name || email.split("@")[0],
      role,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Show success message and redirect
    alert(`Welcome ${userData.name}! Redirecting to your dashboard...`);

    // Route user to appropriate page based on role
    setTimeout(() => {
      routeUserByRole(userData.role);
    }, 1500);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading JP Luxury Ride...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if user is logged in
  if (user && !showLogin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            You're being redirected to your {user.role} dashboard...
          </p>
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <Image
                  src="/Logo.png"
                  alt="JP Luxury Ride Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <span className="text-2xl font-bold text-black">
                  JP Luxury Ride
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                {isSignUp ? "Create your account" : "Sign in to your account"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isSignUp
                  ? "Join JP Luxury Ride for premium chauffeur service"
                  : "Welcome back to JP Luxury Ride"}
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-6" onSubmit={handleAuth}>
                {isSignUp && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={isSignUp}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Enter your password"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Type
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-black focus:border-black"
                    >
                      <option value="customer">Customer</option>
                      <option value="driver">Driver</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Image/Branding */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative h-full flex items-center justify-center p-12">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <span className="text-3xl">🚗</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  Premium Chauffeur Service
                </h1>
                <p className="text-xl text-gray-200 max-w-md">
                  Experience luxury travel with our professional chauffeurs and
                  premium fleet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 p-2"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/Logo.png"
                alt="JP Luxury Ride Logo"
                width={65}
                height={65}
                className="object-contain rounded-full"
              />
              <span className="text-3xl font-bold text-black">
                JP Luxury Ride
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-600 hover:text-black font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setShowLogin(true);
                }}
                className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white min-h-[80vh]">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20 h-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 h-full">
            {/* Left side - Giant GMC Image */}
            <div className="flex-shrink-0 lg:w-1/2 flex justify-center h-full items-center">
              <Image
                src="/GMC.png"
                alt="GMC Luxury Vehicle"
                width={800}
                height={800}
                className="w-full h-auto max-w-[400px] lg:max-w-[750px] max-h-[400px] lg:max-h-[750px] object-contain rounded-[15%]"
              />
            </div>

            {/* Right side - Content */}
            <div className="text-center lg:text-left lg:w-1/2 flex flex-col justify-center items-center lg:items-start pl-4 py-8 lg:py-16">
              <div className="lg:mt-12">
                <h2 className="text-4xl md:text-6xl font-bold text-black mb-4 leading-tight">
                  Experience Luxury
                  <br />
                  <span className="text-gray-600">Beyond Compare</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl lg:max-w-none">
                  Elevate every mile with our elite chauffeur service,where
                  sophistication meets seamless travel. Experience the comfort
                  of premium vehicles, the assurance of highly professional
                  drivers, and the luxury of personalized attention tailored to
                  your every need. Whether for business or leisure, arrive in
                  style, on time, and effortlessly
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setShowLogin(true);
                    }}
                    className="bg-black text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Book Your Luxury Ride
                  </button>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="border-2 border-gray-300 text-black px-10 py-4 rounded-full text-lg font-semibold hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Discover More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why Choose JP Luxury Ride
            </h2>
            <p className="text-gray-600 text-lg">
              Premium service that exceeds expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Premium Fleet
              </h3>
              <p className="text-gray-600">
                Luxury vehicles maintained to the highest standards for your
                comfort and safety.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Professional Chauffeurs
              </h3>
              <p className="text-gray-600">
                Experienced, licensed drivers committed to providing exceptional
                service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book instantly or schedule in advance with real-time pricing and
                confirmations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              Our Premium Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From airport transfers to special events, we provide luxury
              transportation solutions for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-5 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">✈️</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Airport Transfers
              </h3>
              <p className="text-gray-600 text-sm">
                Professional meet & greet service with flight monitoring
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Corporate Travel
              </h3>
              <p className="text-gray-600 text-sm">
                Executive transportation for business meetings and events
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💍</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Special Events
              </h3>
              <p className="text-gray-600 text-sm">
                Weddings, proms, and celebrations with style
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                City Tours
              </h3>
              <p className="text-gray-600 text-sm">
                Guided luxury tours with knowledgeable chauffeurs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              Our Luxury Fleet
            </h2>
            <p className="text-gray-600 text-lg">
              Choose from our collection of premium vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Luxury Sedan
              </h3>
              <p className="text-gray-600 mb-4">
                Mercedes-Benz S-Class, BMW 7 Series
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Up to 3 passengers</li>
                <li>• Premium leather interior</li>
                <li>• Advanced climate control</li>
                <li>• Complimentary WiFi & water</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                <span className="text-4xl">🚙</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Premium SUV
              </h3>
              <p className="text-gray-600 mb-4">
                Cadillac Escalade, Lincoln Navigator
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Up to 6 passengers</li>
                <li>• Extra luggage space</li>
                <li>• Premium sound system</li>
                <li>• Privacy partition available</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                <span className="text-4xl">🚐</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Executive Van
              </h3>
              <p className="text-gray-600 mb-4">
                Mercedes Sprinter, Chevrolet Express
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Up to 12 passengers</li>
                <li>• Group travel comfort</li>
                <li>• Entertainment systems</li>
                <li>• Conference seating</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg">
              Trusted by executives, celebrities, and discerning travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Exceptional service from start to finish. The chauffeur was
                punctual, professional, and the vehicle was immaculate. Will
                definitely use again."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">RS</span>
                </div>
                <div>
                  <p className="font-semibold text-black">Robert Smith</p>
                  <p className="text-sm text-gray-600">CEO, Tech Corp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Made our wedding day perfect! The luxury sedan was spotless and
                the chauffeur made us feel like royalty. Highly recommend JP
                Luxury Ride."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">MJ</span>
                </div>
                <div>
                  <p className="font-semibold text-black">Maria Johnson</p>
                  <p className="text-sm text-gray-600">Event Planner</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Reliable airport transfers every time. Never missed a flight
                thanks to their flight monitoring service. Professional and
                courteous staff."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">DL</span>
                </div>
                <div>
                  <p className="font-semibold text-black">David Lee</p>
                  <p className="text-sm text-gray-600">Business Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Area Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              Service Coverage
            </h2>
            <p className="text-gray-600 text-lg">
              Premium chauffeur service across major metropolitan areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏙️</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                City Centers
              </h3>
              <p className="text-gray-600 text-sm">
                Downtown areas and business districts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✈️</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                All Airports
              </h3>
              <p className="text-gray-600 text-sm">
                Major international and regional airports
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏨</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Hotels</h3>
              <p className="text-gray-600 text-sm">Luxury hotels and resorts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎭</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Events</h3>
              <p className="text-gray-600 text-sm">
                Theaters, stadiums, and venues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for a Premium Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust JP Luxury Ride for
            their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setIsSignUp(true);
                setShowLogin(true);
              }}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/Logo.png"
                alt="JP Luxury Ride Logo"
                width={35}
                height={35}
                className="object-contain"
              />
              <span className="text-xl font-bold text-black">
                JP Luxury Ride
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 JP Luxury Ride. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
