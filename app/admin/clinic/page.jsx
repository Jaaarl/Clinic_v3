"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function ClinicAdminPage() {
  const [clinics, setClinics] = useState([
    {
      name: "",
      addresses: [{ label: "", street: "", city: "", province: "", zip: "" }],
      operatingHours: [{ label: "", schedule: "" }],
      phone: "",
      email: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClinicInfo();
  }, []);

  const fetchClinicInfo = async () => {
    try {
      const res = await fetch("/api/clinic-info");
      const data = await res.json();
      if (data.clinicInfo?.clinics?.length > 0) {
        setClinics(data.clinicInfo.clinics);
      }
    } catch (error) {
      console.error("Error fetching clinic info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/clinic-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinics }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("Clinic info updated successfully!");
        // Refresh data after save
        await fetchClinicInfo();
      } else {
        setMessage("Failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving:", error);
      setMessage("Error saving clinic info.");
    } finally {
      setSaving(false);
    }
  };

  // Clinic handlers
  const addClinic = () => {
    setClinics([
      ...clinics,
      {
        name: "",
        addresses: [{ label: "", street: "", city: "", province: "", zip: "" }],
        operatingHours: [{ label: "", schedule: "" }],
        phone: "",
        email: "",
      },
    ]);
  };

  const removeClinic = (index) => {
    if (clinics.length > 1) {
      const newClinics = clinics.filter((_, i) => i !== index);
      setClinics(newClinics);
    }
  };

  const updateClinicName = (index, value) => {
    const newClinics = [...clinics];
    newClinics[index].name = value;
    setClinics(newClinics);
  };

  // Address handlers
  const addAddress = (clinicIndex) => {
    const newClinics = [...clinics];
    newClinics[clinicIndex].addresses.push({
      label: "",
      street: "",
      city: "",
      province: "",
      zip: "",
    });
    setClinics(newClinics);
  };

  const removeAddress = (clinicIndex, addrIndex) => {
    if (clinics[clinicIndex].addresses.length > 1) {
      const newClinics = [...clinics];
      newClinics[clinicIndex].addresses = newClinics[clinicIndex].addresses.filter(
        (_, i) => i !== addrIndex
      );
      setClinics(newClinics);
    }
  };

  const updateAddress = (clinicIndex, addrIndex, field, value) => {
    const newClinics = [...clinics];
    newClinics[clinicIndex].addresses[addrIndex][field] = value;
    setClinics(newClinics);
  };

  // Operating hours handlers
  const addHours = (clinicIndex) => {
    const newClinics = [...clinics];
    newClinics[clinicIndex].operatingHours.push({ label: "", schedule: "" });
    setClinics(newClinics);
  };

  const removeHours = (clinicIndex, hourIndex) => {
    if (clinics[clinicIndex].operatingHours.length > 1) {
      const newClinics = [...clinics];
      newClinics[clinicIndex].operatingHours = newClinics[
        clinicIndex
      ].operatingHours.filter((_, i) => i !== hourIndex);
      setClinics(newClinics);
    }
  };

  const updateHours = (clinicIndex, hourIndex, field, value) => {
    const newClinics = [...clinics];
    newClinics[clinicIndex].operatingHours[hourIndex][field] = value;
    setClinics(newClinics);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clinic Information</h1>
          <button
            onClick={addClinic}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Clinic
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Clinics */}
        {clinics.map((clinic, clinicIndex) => (
          <div key={clinicIndex} className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Clinic {clinicIndex + 1}</h2>
              {clinics.length > 1 && (
                <button
                  onClick={() => removeClinic(clinicIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Clinic
                </button>
              )}
            </div>

            {/* Clinic Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinic.name}
                onChange={(e) => updateClinicName(clinicIndex, e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Your Clinic Name"
              />
            </div>

            {/* Addresses */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Addresses</h3>
                <button
                  onClick={() => addAddress(clinicIndex)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Address
                </button>
              </div>

              {clinic.addresses.map((addr, addrIndex) => (
                <div key={addrIndex} className="border rounded p-3 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      Address {addrIndex + 1}
                    </span>
                    {clinic.addresses.length > 1 && (
                      <button
                        onClick={() => removeAddress(clinicIndex, addrIndex)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Label (e.g., Main, Branch)
                      </label>
                      <input
                        type="text"
                        value={addr.label}
                        onChange={(e) =>
                          updateAddress(clinicIndex, addrIndex, "label", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Main"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Street
                      </label>
                      <input
                        type="text"
                        value={addr.street}
                        onChange={(e) =>
                          updateAddress(clinicIndex, addrIndex, "street", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={addr.city}
                        onChange={(e) =>
                          updateAddress(clinicIndex, addrIndex, "city", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        value={addr.province}
                        onChange={(e) =>
                          updateAddress(clinicIndex, addrIndex, "province", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Province"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={addr.zip}
                        onChange={(e) =>
                          updateAddress(clinicIndex, addrIndex, "zip", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Operating Hours</h3>
                <button
                  onClick={() => addHours(clinicIndex)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Hours
                </button>
              </div>

              {clinic.operatingHours.map((hours, hourIndex) => (
                <div key={hourIndex} className="border rounded p-3 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      Hours {hourIndex + 1}
                    </span>
                    {clinic.operatingHours.length > 1 && (
                      <button
                        onClick={() => removeHours(clinicIndex, hourIndex)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Label (e.g., Main Hours)
                      </label>
                      <input
                        type="text"
                        value={hours.label}
                        onChange={(e) =>
                          updateHours(clinicIndex, hourIndex, "label", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Main Hours"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Schedule
                      </label>
                      <input
                        type="text"
                        value={hours.schedule}
                        onChange={(e) =>
                          updateHours(clinicIndex, hourIndex, "schedule", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="MWF 9:00AM - 5:00PM"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
