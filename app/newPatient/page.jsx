"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function NewPatient() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      province: "",
      zip: "",
    },
  });
  const [medical_history, setMedicalHistory] = useState({
    allergies: [],
    conditions: [],
    surgeries: [],
  });
  const [medications, setMedications] = useState([
    {
      name: "",
      dosage: "",
      frequency: "",
    },
  ]);

  const handleInputChange = (index, category, value) => {
    const newMedicalHistory = { ...medical_history };
    newMedicalHistory[category][index] = value;
    setMedicalHistory(newMedicalHistory);
  };

  // Handle adding new input fields
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
    if (!name || !gender) {
      alert("Fill Out all input");
      return;
    }
    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "content-type": "application/json",
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
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        new Error("Failed to create a Patient");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <form onSubmit={handleSubmit} className="w-full">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-slate-500 px-3 py-2 rounded-md w-full"
                type="text"
                placeholder="Name"
              />
              <div>
                <label
                  htmlFor="birthday"
                  className="block text-gray-700 font-bold mb-2"
                >
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
                <div>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="male"
                    className="mr-4 text-gray-700 font-bold"
                  >
                    Male
                  </label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="female" className="text-gray-700 font-bold">
                    Female
                  </label>
                </div>
              </div>
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
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
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
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
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
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
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
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
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
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
                />
                <label
                  htmlFor="zip"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Zip
                </label>
                <input
                  type="text"
                  value={contact.address.zip}
                  onChange={(e) => handleChange(e, "address", "zip")}
                  className="border border-slate-500 px-3 py-2 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <h2 className="block text-gray-700 font-bold mb-2">
                  Allergies
                </h2>
                {medical_history.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      className="border border-slate-500 px-2 py-1 rounded-md mr-2 w-full"
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
                      <FaRegTrashAlt color="white" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField("allergies")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                >
                  Add Alergy
                </button>
              </div>
              <div className="mb-4">
                <h2 className="block text-gray-700 font-bold mb-2">
                  Conditions
                </h2>
                {medical_history.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      className="border border-slate-500 px-2 py-1 rounded-md mr-2 w-full"
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
                      <FaRegTrashAlt color="white" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                  type="button"
                  onClick={() => handleAddField("conditions")}
                >
                  Add Condition
                </button>
              </div>
              <div className="mb-4">
                <h2 className="block text-gray-700 font-bold mb-2">
                  Surgeries
                </h2>
                {medical_history.surgeries.map((surgery, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      className="border border-slate-500 px-2 py-1 rounded-md mr-2 w-full"
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
                      <FaRegTrashAlt color="white" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-sm"
                  type="button"
                  onClick={() => handleAddField("surgeries")}
                >
                  Add Surgery
                </button>
              </div>
              <button
                type="submit"
                className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
