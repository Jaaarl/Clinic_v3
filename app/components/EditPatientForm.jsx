"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";

export default function EditPatientForm({
  id,
  name1,
  gender1,
  contact1,
  medical_history1,
  medication1,
  birthday1,
}) {
  const [name, setName] = useState(name1);
  const [gender, setGender] = useState(gender1);
  const [birthday, setBirthday] = useState(
    birthday1 ? birthday1.split("T")[0] : ""
  );

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

  const [medications, setMedications] = useState(
    medication1.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.freq,
    }))
  );

  const handleInputChange = (index, category, value) => {
    const newMedicalHistory = { ...medical_history };
    newMedicalHistory[category][index] = value;
    setMedicalHistory(newMedicalHistory);
  };

  const handleAddField = (category) => {
    const newMedicalHistory = { ...medical_history };
    newMedicalHistory[category].push("");
    setMedicalHistory(newMedicalHistory);
  };

  const handleRemoveField = (index, category) => {
    const newMedicalHistory = { ...medical_history };
    newMedicalHistory[category].splice(index, 1);
    setMedicalHistory(newMedicalHistory);
  };

  const handleChange = (e, field, subfield = null) => {
    const value = e.target.value;
    setContact((prevState) => ({
      ...prevState,
      [field]: subfield ? { ...prevState[field], [subfield]: value } : value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleMedicationChange = (e, index) => {
    const { name, value } = e.target;
    const newMedications = [...medications];
    newMedications[index][name] = value;
    setMedications(newMedications);
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          medications,
          birthday,
        }),
      });
      if (!res.ok) {
        throw new Error("failed to update patient");
      }
      alert("Patient information updated successfully.");
      // Navigate to queue page then refresh to show updated data
      router.push(`/queue`);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
            className="border border-slate-500 px-3 py-2 rounded-md w-full"
            type="text"
            placeholder="Name"
          />
          <div>
            <label htmlFor="day" className="block text-gray-700 font-bold mb-2">
              Birthday
            </label>
            <div className="mb-4">
              <input
                className="border border-slate-500 px-3 py-2 rounded-md w-full"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>

          <label
            htmlFor="gender"
            className="block text-gray-700 font-bold mb-2"
          >
            Gender
          </label>
          <select
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            name="gender"
            className="border border-slate-500 px-3 py-2 rounded-md w-full"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 font-bold mb-2"
            >
              Phone Number
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => handleChange(e, "phone")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />

            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="text"
              value={contact.email}
              onChange={(e) => handleChange(e, "email")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />

            <label
              htmlFor="street"
              className="block text-gray-700 font-bold mb-2"
            >
              Street
            </label>
            <input
              type="text"
              value={contact.address.street}
              onChange={(e) => handleChange(e, "address", "street")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />

            <label
              htmlFor="city"
              className="block text-gray-700 font-bold mb-2"
            >
              City
            </label>
            <input
              type="text"
              value={contact.address.city}
              onChange={(e) => handleChange(e, "address", "city")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />

            <label
              htmlFor="province"
              className="block text-gray-700 font-bold mb-2"
            >
              Province
            </label>
            <input
              type="text"
              value={contact.address.province}
              onChange={(e) => handleChange(e, "address", "province")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />

            <label htmlFor="zip" className="block text-gray-700 font-bold mb-2">
              Zip
            </label>
            <input
              type="text"
              value={contact.address.zip}
              onChange={(e) => handleChange(e, "address", "zip")}
              className="border border-slate-500 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <h2 className="block text-gray-700 font-bold mb-2">Allergies</h2>
            {medical_history.allergies.map((allergy, index) => (
              <div key={index}>
                <input
                  className="mb-2 border border-slate-500 px-2 py-1 rounded-md mr-2"
                  type="text"
                  value={allergy}
                  onChange={(e) =>
                    handleInputChange(index, "allergies", e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                  type="button"
                  onClick={() => handleRemoveField(index, "allergies")}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm"
              onClick={() => handleAddField("allergies")}
            >
              Add Allergy
            </button>
          </div>

          <div>
            <h2 className="block text-gray-700 font-bold mb-2">Conditions</h2>
            {medical_history.conditions.map((condition, index) => (
              <div key={index}>
                <input
                  className="mb-2 border border-slate-500 px-2 py-1 rounded-md mr-2"
                  type="text"
                  value={condition}
                  onChange={(e) =>
                    handleInputChange(index, "conditions", e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                  type="button"
                  onClick={() => handleRemoveField(index, "conditions")}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm"
              onClick={() => handleAddField("conditions")}
            >
              Add Condition
            </button>
          </div>

          <div>
            <h2 className="block text-gray-700 font-bold mb-2">Surgeries</h2>
            {medical_history.surgeries.map((surgery, index) => (
              <div key={index}>
                <input
                  className="mb-2 border border-slate-500 px-2 py-1 rounded-md mr-2"
                  type="text"
                  value={surgery}
                  onChange={(e) =>
                    handleInputChange(index, "surgeries", e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                  type="button"
                  onClick={() => handleRemoveField(index, "surgeries")}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm"
              onClick={() => handleAddField("surgeries")}
            >
              Add Surgery
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Patient
          </button>
        </form>
      </div>
    </div>
  );
}
