"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
export default function AddQueForm({
  id,
  name1,
  gender1,
  contact1,
  medical_history1,
  medication1,
  visit_history1,
}) {
  const [name, setName] = useState(name1);
  const [gender, setGender] = useState(gender1);
  const [birthday, setBirthday] = useState();

  const [contact, setContact] = useState({
    phone: contact1.phone,
    email: contact1.email,
    address: {
      street: contact1.address.street,
      city: contact1.address.city,
      province: contact1.address.province,
      zip: contact1.address.zip,
    },
  });

  const [medical_history, setMedicalHistory] = useState({
    allergies: [...medical_history1.allergies],
    conditions: [...medical_history1.conditions],
    surgeries: [...medical_history1.surgeries],
  });
  const [visit_history, setVisitHistory] = useState(
    visit_history1.map((visit) => ({
      visit_date: visit.visit_date || "",
      soap: {
        subjective: visit.soap.subjective || "",
        objective: visit.soap.objective || "",
        assessment: visit.soap.assessment || "",
        plan: visit.soap.plan || "",
      },
      vitals: {
        height: visit.vitals.height || "",
        weight: visit.vitals.weight || "",
        respiratory_rate: visit.vitals.respiratory_rate || "",
        blood_pressure: visit.vitals.blood_pressure || "",
        heart_rate: visit.vitals.heart_rate || "",
        temperature: visit.vitals.temperature || "",
      },
      form: {
        reseta: visit.form.reseta || "",
        labReq: visit.form.labReq || "",
      },
    }))
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const [newVisit, setNewVisit] = useState({
    visit_date: formattedDate,
    soap: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    },
    vitals: {
      height: "",
      weight: "",
      respiratory_rate: "",
      blood_pressure: "",
      heart_rate: "",
      temperature: "",
    },
    form: {
      reseta: "",
      labReq: "",
    },
  });

  const handleInputChange = (e, section, field) => {
    if (section) {
      setNewVisit((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: e.target.value,
        },
      }));
    } else {
      setNewVisit((prevState) => ({
        ...prevState,
        [field]: e.target.value,
      }));
    }
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVisitHistory = [...visit_history, newVisit];

    try {
      const res = await fetch(`/api/patient/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          gender,
          contact,
          medical_history,
          birthday,
          visit_history: updatedVisitHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update patient");
      }

      const response = await fetch("/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referenceId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to queue");
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex gap-4 mx-3">
        <form onSubmit={handleSubmit} className="mt-3 w-fit">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Visit Date
            </label>
            <input
              type="date"
              value={newVisit.visit_date}
              disabled
              onChange={(e) => handleInputChange(e, null, "visit_date")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-row gap-4">
            <fieldset className="border-t border-gray-200 pt-4">
              <legend className="text-lg font-medium text-gray-900">
                Vitals
              </legend>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  value={newVisit.vitals.height}
                  onChange={(e) => handleInputChange(e, "vitals", "height")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  value={newVisit.vitals.weight}
                  onChange={(e) => handleInputChange(e, "vitals", "weight")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Respiratory Rate (bpm)
                </label>
                <input
                  value={newVisit.vitals.respiratory_rate}
                  onChange={(e) =>
                    handleInputChange(e, "vitals", "respiratory_rate")
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Blood Pressure
                </label>
                <input
                  value={newVisit.vitals.blood_pressure}
                  onChange={(e) =>
                    handleInputChange(e, "vitals", "blood_pressure")
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Heart Rate (bpm)
                </label>
                <input
                  value={newVisit.vitals.heart_rate}
                  onChange={(e) => handleInputChange(e, "vitals", "heart_rate")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature (°C)
                </label>
                <input
                  value={newVisit.vitals.temperature}
                  onChange={(e) =>
                    handleInputChange(e, "vitals", "temperature")
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </fieldset>
            <fieldset className="border-t border-gray-200 pt-4">
              <legend className="text-lg font-medium text-gray-900">
                SOAP
              </legend>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subjective
                </label>
                <textarea
                  value={newVisit.soap.subjective}
                  onChange={(e) => handleInputChange(e, "soap", "subjective")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Objective
                </label>
                <textarea
                  value={newVisit.soap.objective}
                  onChange={(e) => handleInputChange(e, "soap", "objective")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Assessment
                </label>
                <textarea
                  value={newVisit.soap.assessment}
                  onChange={(e) => handleInputChange(e, "soap", "assessment")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Plan
                </label>
                <textarea
                  value={newVisit.soap.plan}
                  onChange={(e) => handleInputChange(e, "soap", "plan")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Visit
          </button>
        </form>
      </div>
    </>
  );
}
