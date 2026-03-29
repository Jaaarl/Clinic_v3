"use client";
import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const FREQUENCY_OPTIONS = [
  { value: "OD", label: "Once a day (OD)" },
  { value: "BID", label: "Twice a day (BID)" },
  { value: "TID", label: "Three times a day (TID)" },
  { value: "QID", label: "Four times a day (QID)" },
  { value: "Q4H", label: "Every 4 hours" },
  { value: "Q6H", label: "Every 6 hours" },
  { value: "Q8H", label: "Every 8 hours" },
  { value: "Q12H", label: "Every 12 hours" },
  { value: "PRN", label: "As needed (PRN)" },
  { value: "STAT", label: "Immediately (STAT)" }
];

export default function MedicinePrescriptionForm({ patientId, doctorInfo, onPrescriptionCreated }) {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
  ]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate
    const validMeds = medicines.filter(m => m.name && m.dosage && m.frequency && m.duration);
    if (validMeds.length === 0) {
      setError("At least one complete medicine entry is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorName: doctorInfo?.name || "",
          doctorLicense: doctorInfo?.lic || "",
          doctorPtr: doctorInfo?.ptr || "",
          doctorS2: doctorInfo?.s2 || "",
          medicines: validMeds,
          notes
        })
      });

      if (!res.ok) throw new Error("Failed to create prescription");

      const data = await res.json();
      
      // Reset form
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
      setNotes("");

      if (onPrescriptionCreated) {
        onPrescriptionCreated(data.prescription);
      }

      alert("Prescription created successfully!");
    } catch (err) {
      setError("Failed to save prescription. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Prescription</h3>
      
      <form onSubmit={handleSubmit}>
        {medicines.map((medicine, index) => (
          <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-600">Medicine #{index + 1}</span>
              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                  placeholder="e.g., Amoxicillin"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Dosage *</label>
                <input
                  type="text"
                  value={medicine.dosage}
                  onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                  placeholder="e.g., 500mg"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Frequency *</label>
                <select
                  value={medicine.frequency}
                  onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="">Select frequency</option>
                  {FREQUENCY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Duration *</label>
                <input
                  type="text"
                  value={medicine.duration}
                  onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                  placeholder="e.g., 5 days"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Instructions</label>
                <input
                  type="text"
                  value={medicine.instructions}
                  onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                  placeholder="e.g., Take after meals"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMedicine}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-4"
        >
          <FaPlus /> Add Another Medicine
        </button>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the patient..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            rows={2}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Save Prescription"}
        </button>
      </form>
    </div>
  );
}
