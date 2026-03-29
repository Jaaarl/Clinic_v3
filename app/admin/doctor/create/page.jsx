"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateDoctor = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lic, setLic] = useState("");
  const [ptr, setPtr] = useState("");
  const [s2, setS2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorData = { name, lic, ptr, s2 };

    try {
      const response = await fetch("/api/doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        router.back(); // Redirect to doctor listing page
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      alert("Failed to create doctor");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Create Doctor
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lic" className="block text-gray-700">
            License Number:
          </label>
          <input
            type="text"
            id="lic"
            value={lic}
            onChange={(e) => setLic(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ptr" className="block text-gray-700">
            PTR Number:
          </label>
          <input
            type="text"
            id="ptr"
            value={ptr}
            onChange={(e) => setPtr(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="s2" className="block text-gray-700">
            S2 Number:
          </label>
          <input
            type="text"
            id="s2"
            value={s2}
            onChange={(e) => setS2(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDoctor;
