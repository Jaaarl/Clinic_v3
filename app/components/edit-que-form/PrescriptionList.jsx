"use client";

import { useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { generateResetaText } from "@/lib/utils/prescriptionUtils";

export default function PrescriptionList({
  prescriptions = [],
  onPrescriptionsChange,
  reseta = "",
}) {
  const previewRef = useRef(null);

  const handleChange = (index, field, value) => {
    const updated = prescriptions.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    onPrescriptionsChange(updated);
  };

  const handleAdd = () => {
    onPrescriptionsChange([
      ...prescriptions,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const handleRemove = (index) => {
    onPrescriptionsChange(prescriptions.filter((_, i) => i !== index));
  };

  const generatedText = generateResetaText(prescriptions);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.style.height = "auto";
      previewRef.current.style.height = previewRef.current.scrollHeight + "px";
    }
  }, [generatedText]);

  return (
    <div className="space-y-3">
      {prescriptions.map((p, index) => (
        <div key={index} className="border border-gray-300 rounded-md p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Prescription #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove"
            >
              <FaTrash size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="e.g. Paracetamol"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Dosage</label>
              <input
                type="text"
                value={p.dosage}
                onChange={(e) => handleChange(index, "dosage", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="e.g. 500mg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Frequency</label>
              <input
                type="text"
                value={p.frequency}
                onChange={(e) => handleChange(index, "frequency", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="e.g. 3x daily"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Duration</label>
              <input
                type="text"
                value={p.duration}
                onChange={(e) => handleChange(index, "duration", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="e.g. 7 days"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Instructions</label>
            <input
              type="text"
              value={p.instructions}
              onChange={(e) => handleChange(index, "instructions", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="e.g. take with food"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
      >
        + Add Prescription
      </button>

      {generatedText && (
        <div className="mt-3">
          <label className="block text-xs text-gray-600 mb-1 font-medium">
            Prescription Preview:
          </label>
          <textarea
            ref={previewRef}
            readOnly
            value={generatedText}
            className="w-full border border-gray-200 rounded bg-gray-50 px-2 py-1 text-sm text-gray-700 resize-none overflow-hidden"
            rows={generatedText.split("\n").length || 1}
          />
        </div>
      )}
    </div>
  );
}
