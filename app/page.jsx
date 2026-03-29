"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import RemoveBtn from "./components/RemoveBtn";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import Navbar from "./components/Navbar";
import { calculateAge } from "@/lib/utils/dateUtils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [hoveredPatient, setHoveredPatient] = useState(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    if (isSearched && patients.length == 0) {
      alert("No patients found");
      setIsSearched(false);
    }
  }, [isSearched, patients.length]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/patient?search=${query}`);
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data.patients);
      setIsSearched(true);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-[33rem]">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Patient Management
          </h2>
          <div className="space-y-4">
            <Link href={"newPatient"}>
              <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Patient
              </button>
            </Link>

            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-4 mb-2"
            >
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Patient Name"
                className="mb-2 flex-grow border border-slate-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>

          {isSearched && patients.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Search Results:</h3>
              <table className="min-w-full mt-1border border-gray-300 mb-3">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Name
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="px-4 py-2 border border-gray-300">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <p>
                              {patient.gender === "female" ? (
                                <FaFemale className="text-pink-700" size={20} />
                              ) : (
                                <FaMale className="text-blue-700" size={20} />
                              )}
                            </p>
                            <p className="font-semibold">{patient.name}</p>
                          </div>
                          <div className="text-sm text-gray-700">
                            <p className="text-sm text-gray-600">
                              {patient.birthday
                                ? `${new Date(patient.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })} (${calculateAge(patient.birthday)} )`
                                : "N/A"}
                            </p>
                            <p>
                              {patient.contact.address.street},{" "}
                              {patient.contact.address.city}
                            </p>
                            <p>{patient.contact.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <div className="flex justify-center items-center gap-4">
                          <RemoveBtn id={patient._id} />
                          <Link href={`/editPatient/${patient._id}`}>
                            <FaEdit size={24} />
                          </Link>
                          <Link href={`/addQue/${patient._id}`}>
                            <IoIosAddCircle size={24} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link href="/queue">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white 
            font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Queue
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
