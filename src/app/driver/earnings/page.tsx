"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../../components/AuthCheck";
import Navigation from "../../components/Navigation";

interface EarningsData {
  date: string;
  trips: number;
  miles: number;
  hours: number;
  grossEarnings: number;
  tips: number;
  netEarnings: number;
}

function DriverEarningsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);

  useEffect(() => {
    // Mock earnings data
    const mockData: EarningsData[] = [
      {
        date: new Date().toISOString().split("T")[0],
        trips: 8,
        miles: 125.4,
        hours: 9.5,
        grossEarnings: 485.75,
        tips: 67.5,
        netEarnings: 553.25,
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        trips: 12,
        miles: 156.2,
        hours: 10.2,
        grossEarnings: 642.3,
        tips: 85.2,
        netEarnings: 727.5,
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        trips: 6,
        miles: 89.1,
        hours: 7.5,
        grossEarnings: 324.65,
        tips: 42.0,
        netEarnings: 366.65,
      },
      {
        date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
        trips: 10,
        miles: 134.7,
        hours: 8.8,
        grossEarnings: 567.4,
        tips: 76.3,
        netEarnings: 643.7,
      },
      {
        date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
        trips: 9,
        miles: 112.3,
        hours: 8.2,
        grossEarnings: 445.2,
        tips: 58.75,
        netEarnings: 503.95,
      },
    ];

    setEarningsData(mockData);
  }, []);

  const totalStats = earningsData.reduce(
    (acc, day) => ({
      trips: acc.trips + day.trips,
      miles: acc.miles + day.miles,
      hours: acc.hours + day.hours,
      grossEarnings: acc.grossEarnings + day.grossEarnings,
      tips: acc.tips + day.tips,
      netEarnings: acc.netEarnings + day.netEarnings,
    }),
    { trips: 0, miles: 0, hours: 0, grossEarnings: 0, tips: 0, netEarnings: 0 }
  );

  const averagePerTrip =
    totalStats.trips > 0 ? totalStats.netEarnings / totalStats.trips : 0;
  const averagePerHour =
    totalStats.hours > 0 ? totalStats.netEarnings / totalStats.hours : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Earnings</h1>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400"
              }`}
            >
              This {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-black">
            ${totalStats.netEarnings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Net Earnings</div>
          <div className="text-xs text-green-600 mt-1">+12% vs last week</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-black">
            {totalStats.trips}
          </div>
          <div className="text-sm text-gray-600">Trips Completed</div>
          <div className="text-xs text-green-600 mt-1">+5% vs last week</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-black">
            {totalStats.hours.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Hours Worked</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalStats.miles.toFixed(1)} miles
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-3xl font-bold text-black">
            ${averagePerHour.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Per Hour</div>
          <div className="text-xs text-gray-500 mt-1">
            ${averagePerTrip.toFixed(2)} per trip
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-6">
              Daily Breakdown
            </h2>

            <div className="space-y-4">
              {earningsData.map((day, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-black">
                        {formatDate(day.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.trips} trips • {day.hours.toFixed(1)} hours •{" "}
                        {day.miles.toFixed(1)} miles
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-black">
                        ${day.netEarnings.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Net earnings</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Gross</div>
                      <div className="font-medium text-black">
                        ${day.grossEarnings.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Tips</div>
                      <div className="font-medium text-green-600">
                        ${day.tips.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Per Hour</div>
                      <div className="font-medium text-black">
                        ${(day.netEarnings / day.hours).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="space-y-6">
          {/* Weekly Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Week Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Gross Earnings</span>
                <span className="font-medium text-black">
                  ${totalStats.grossEarnings.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tips</span>
                <span className="font-medium text-green-600">
                  +${totalStats.tips.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium text-red-600">-$0.00</span>
              </div>

              <div className="flex justify-between items-center py-2 font-semibold">
                <span className="text-black">Net Earnings</span>
                <span className="text-black">
                  ${totalStats.netEarnings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Performance</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Customer Rating</span>
                  <span className="text-sm font-medium text-black">4.9/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Acceptance Rate</span>
                  <span className="text-sm font-medium text-black">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "96%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">On-Time Rate</span>
                  <span className="text-sm font-medium text-black">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Next Payout</h3>

            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">
                ${totalStats.netEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Available for payout
              </div>

              <button className="w-full bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors mb-3">
                Cash Out Now
              </button>

              <div className="text-xs text-gray-500">
                Or wait for weekly automatic deposit on Mondays
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-black mb-4">Tax Information</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">YTD Earnings</span>
                <span className="text-sm font-medium text-black">
                  $24,567.32
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">YTD Miles</span>
                <span className="text-sm font-medium text-black">
                  3,247 miles
                </span>
              </div>

              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-2">
                Download 1099 Form →
              </button>

              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-2">
                View Tax Summary →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DriverEarnings() {
  return (
    <AuthCheck requiredRole="driver">
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
        <DriverEarningsContent />
      </div>
    </AuthCheck>
  );
}
