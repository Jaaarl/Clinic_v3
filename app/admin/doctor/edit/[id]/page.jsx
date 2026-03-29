"use client";
import Navbar from "@/app/components/Navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function EditDoctorPage({ params }) {
  const { id } = params;

  const [doctor, setDoctor] = useState({
    name: "",
    lic: "",
    ptr: "",
    s2: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctor/${id}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await response.json();
        setDoctor(data.doctor);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/doctor/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor information");
      }

      window.location.href = "/admin/doctor";
      alert("Doctor information updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        {loading && (
          <p className="text-center text-gray-500">
            Loading doctor information...
          </p>
        )}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              Edit Doctor Information
            </h1>

            <div>
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={doctor.name}
                onChange={handleChange}
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
                name="lic"
                value={doctor.lic}
                onChange={handleChange}
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
                name="ptr"
                value={doctor.ptr}
                onChange={handleChange}
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
                name="s2"
                value={doctor.s2}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Doctor
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
