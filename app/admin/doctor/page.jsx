"use client";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch("/api/doctor", {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setDoctors(data.doctors);
      } else {
        alert("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 border shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Doctor Management
        </h1>
        {doctors.length < 1 && (
          <Link
            href="./doctor/create"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6"
          >
            Create New Doctor
          </Link>
        )}
        <div className="space-y-4">
          {doctors.length === 1 &&
            doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center"
              >
                <div className="sm:w-2/3">
                  <p className="font-semibold text-2xl text-gray-800">
                    {doctor.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    License: {doctor.lic}
                  </p>
                  <p className="text-sm text-gray-600">S2: {doctor.s2}</p>
                  <p className="text-sm text-gray-600">PTR: {doctor.ptr}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <Link
                    href={`./doctor/edit/${doctor._id}`}
                    className="inline-block text-blue-500 hover:text-blue-700 font-medium 
                    text-lg border border-blue-500 hover:border-blue-700 rounded px-4 
                    py-2"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
