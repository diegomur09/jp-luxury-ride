"use client";

import { useState, useEffect } from "react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
  category: "sedan" | "suv" | "van" | "luxury";
  capacity: number;
  color: string;
  status: "active" | "maintenance" | "out-of-service";
  mileage: number;
  lastService: string;
  nextService: string;
  dailyRate: number;
  features: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    expiry: string;
  };
  registration: {
    expiry: string;
    state: string;
  };
  assignedDriver?: {
    id: string;
    name: string;
  };
}

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Mock vehicles data
    const mockVehicles: Vehicle[] = [
      {
        id: "1",
        make: "Mercedes-Benz",
        model: "S-Class",
        year: 2023,
        plateNumber: "LUX-001",
        vin: "1HGCM82633A004352",
        category: "luxury",
        capacity: 4,
        color: "Black",
        status: "active",
        mileage: 15420,
        lastService: "2024-10-01",
        nextService: "2025-01-01",
        dailyRate: 150,
        features: [
          "Leather seats",
          "Wi-Fi",
          "Climate control",
          "Premium sound",
        ],
        insurance: {
          provider: "State Farm",
          policyNumber: "SF-LUX-001",
          expiry: "2025-06-15",
        },
        registration: {
          expiry: "2025-03-30",
          state: "NY",
        },
        assignedDriver: {
          id: "1",
          name: "James Wilson",
        },
      },
      {
        id: "2",
        make: "Cadillac",
        model: "Escalade",
        year: 2022,
        plateNumber: "LUX-002",
        vin: "1GYS4HKJ9NR123456",
        category: "suv",
        capacity: 7,
        color: "White",
        status: "active",
        mileage: 28750,
        lastService: "2024-09-15",
        nextService: "2024-12-15",
        dailyRate: 200,
        features: [
          "Premium leather",
          "Entertainment system",
          "Privacy partition",
          "Refreshments",
        ],
        insurance: {
          provider: "Allstate",
          policyNumber: "AS-LUX-002",
          expiry: "2025-05-20",
        },
        registration: {
          expiry: "2025-02-28",
          state: "NY",
        },
        assignedDriver: {
          id: "2",
          name: "Michael Chen",
        },
      },
      {
        id: "3",
        make: "Mercedes",
        model: "Sprinter",
        year: 2021,
        plateNumber: "LUX-003",
        vin: "WD3PE8CC5M5123789",
        category: "van",
        capacity: 12,
        color: "Silver",
        status: "maintenance",
        mileage: 45680,
        lastService: "2024-10-20",
        nextService: "2025-01-20",
        dailyRate: 300,
        features: [
          "Conference seating",
          "Wi-Fi",
          "Entertainment",
          "Catering space",
        ],
        insurance: {
          provider: "Progressive",
          policyNumber: "PG-LUX-003",
          expiry: "2025-08-10",
        },
        registration: {
          expiry: "2025-04-15",
          state: "NY",
        },
        assignedDriver: {
          id: "3",
          name: "David Brown",
        },
      },
    ];

    setVehicles(mockVehicles);
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filterStatus !== "all" && vehicle.status !== filterStatus) return false;
    if (filterCategory !== "all" && vehicle.category !== filterCategory)
      return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "out-of-service":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const updateVehicleStatus = (
    vehicleId: string,
    newStatus: Vehicle["status"]
  ) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
      )
    );

    alert(`Vehicle status updated to ${newStatus}`);
  };

  const needsService = (vehicle: Vehicle) => {
    const nextService = new Date(vehicle.nextService);
    const today = new Date();
    const daysUntilService = Math.ceil(
      (nextService.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    return daysUntilService <= 30;
  };

  const isDocumentExpiring = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    return daysUntilExpiry <= 60;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Fleet Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Add Vehicle
        </button>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-black">{vehicles.length}</div>
          <div className="text-sm text-gray-600">Total Vehicles</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {vehicles.filter((v) => v.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {vehicles.filter((v) => v.status === "maintenance").length}
          </div>
          <div className="text-sm text-gray-600">In Maintenance</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {vehicles.filter((v) => needsService(v)).length}
          </div>
          <div className="text-sm text-gray-600">Service Due</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="all">All Categories</option>
              <option value="luxury">Luxury Sedan</option>
              <option value="suv">Premium SUV</option>
              <option value="van">Executive Van</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterCategory("all");
              }}
              className="w-full border border-gray-300 text-black px-4 py-2 rounded-md font-medium hover:border-gray-400 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              {/* Vehicle Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.plateNumber}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-black capitalize">
                    {vehicle.category}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium text-black">
                    {vehicle.capacity} passengers
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium text-black">
                    {vehicle.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-medium text-black">
                    ${vehicle.dailyRate}
                  </span>
                </div>
              </div>

              {/* Driver Assignment */}
              {vehicle.assignedDriver && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-black">
                    Assigned Driver
                  </div>
                  <div className="text-sm text-gray-600">
                    {vehicle.assignedDriver.name}
                  </div>
                </div>
              )}

              {/* Alerts */}
              <div className="space-y-2 mb-4">
                {needsService(vehicle) && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="text-xs font-medium text-yellow-800">
                      Service Due
                    </div>
                    <div className="text-xs text-yellow-700">
                      Next service:{" "}
                      {new Date(vehicle.nextService).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {isDocumentExpiring(vehicle.insurance.expiry) && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-xs font-medium text-red-800">
                      Insurance Expiring
                    </div>
                    <div className="text-xs text-red-700">
                      Expires:{" "}
                      {new Date(vehicle.insurance.expiry).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {isDocumentExpiring(vehicle.registration.expiry) && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-xs font-medium text-red-800">
                      Registration Expiring
                    </div>
                    <div className="text-xs text-red-700">
                      Expires:{" "}
                      {new Date(
                        vehicle.registration.expiry
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="flex-1 text-center py-2 px-3 border border-gray-300 text-black rounded-md text-sm font-medium hover:border-gray-400 transition-colors"
                >
                  View Details
                </button>

                {vehicle.status === "active" && (
                  <button
                    onClick={() =>
                      updateVehicleStatus(vehicle.id, "maintenance")
                    }
                    className="flex-1 text-center py-2 px-3 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Service
                  </button>
                )}

                {vehicle.status === "maintenance" && (
                  <button
                    onClick={() => updateVehicleStatus(vehicle.id, "active")}
                    className="flex-1 text-center py-2 px-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                {selectedVehicle.year} {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Vehicle Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Vehicle Details
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>Make/Model:</strong> {selectedVehicle.make}{" "}
                      {selectedVehicle.model}
                    </div>
                    <div>
                      <strong>Year:</strong> {selectedVehicle.year}
                    </div>
                    <div>
                      <strong>Plate Number:</strong>{" "}
                      {selectedVehicle.plateNumber}
                    </div>
                    <div>
                      <strong>VIN:</strong> {selectedVehicle.vin}
                    </div>
                    <div>
                      <strong>Color:</strong> {selectedVehicle.color}
                    </div>
                    <div>
                      <strong>Category:</strong> {selectedVehicle.category}
                    </div>
                    <div>
                      <strong>Capacity:</strong> {selectedVehicle.capacity}{" "}
                      passengers
                    </div>
                    <div>
                      <strong>Mileage:</strong>{" "}
                      {selectedVehicle.mileage.toLocaleString()} miles
                    </div>
                    <div>
                      <strong>Daily Rate:</strong> ${selectedVehicle.dailyRate}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">Features</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedVehicle.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-green-500">✓</span>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Assigned Driver
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    {selectedVehicle.assignedDriver ? (
                      <div>
                        <div className="font-medium text-black">
                          {selectedVehicle.assignedDriver.name}
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                          Change Driver
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-600 mb-2">
                          No driver assigned
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Assign Driver
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documentation & Service */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Insurance</h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>Provider:</strong>{" "}
                      {selectedVehicle.insurance.provider}
                    </div>
                    <div>
                      <strong>Policy Number:</strong>{" "}
                      {selectedVehicle.insurance.policyNumber}
                    </div>
                    <div>
                      <strong>Expiry:</strong>{" "}
                      {new Date(
                        selectedVehicle.insurance.expiry
                      ).toLocaleDateString()}
                      {isDocumentExpiring(selectedVehicle.insurance.expiry) && (
                        <span className="ml-2 text-red-600 text-sm">
                          ⚠️ Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Registration
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>State:</strong>{" "}
                      {selectedVehicle.registration.state}
                    </div>
                    <div>
                      <strong>Expiry:</strong>{" "}
                      {new Date(
                        selectedVehicle.registration.expiry
                      ).toLocaleDateString()}
                      {isDocumentExpiring(
                        selectedVehicle.registration.expiry
                      ) && (
                        <span className="ml-2 text-red-600 text-sm">
                          ⚠️ Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">Maintenance</h4>
                  <div className="bg-gray-50 rounded-md p-4 space-y-2">
                    <div>
                      <strong>Last Service:</strong>{" "}
                      {new Date(
                        selectedVehicle.lastService
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Next Service:</strong>{" "}
                      {new Date(
                        selectedVehicle.nextService
                      ).toLocaleDateString()}
                      {needsService(selectedVehicle) && (
                        <span className="ml-2 text-yellow-600 text-sm">
                          ⚠️ Due Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Status Management
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Current Status:
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          selectedVehicle.status
                        )}`}
                      >
                        {selectedVehicle.status
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["active", "maintenance", "out-of-service"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateVehicleStatus(
                                selectedVehicle.id,
                                status as Vehicle["status"]
                              )
                            }
                            disabled={selectedVehicle.status === status}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                              selectedVehicle.status === status
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "border border-gray-300 text-black hover:bg-gray-50"
                            }`}
                          >
                            Mark as {status.replace("-", " ")}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📋 Schedule Service
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📄 Update Documents
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      📊 View Usage History
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      💰 Update Pricing
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-6 py-2 border border-gray-300 text-black rounded-md font-medium hover:border-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Mercedes-Benz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="S-Class"
                  />
                </div>
              </div>

              {/* Additional form fields would go here */}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 text-black rounded-md font-medium hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
