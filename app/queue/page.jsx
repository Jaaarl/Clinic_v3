import React from "react";
import connectDB from "@/libs/mongodb";
import Queue from "@/models/queue"; // Ensure you have the correct import for your Queue model
import Patient from "@/models/patient"; // Ensure you have the correct import for your Patient model
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import Link from "next/link";
import DeleteQue from "../components/DeleteQue";
import Navbar from "@/app/components/Navbar";
import QueueNum from "@/models/queueNum";

const getQueueEntries = async () => {
  try {
    await connectDB();

    const queueEntries = await Queue.find();

    const queueWithPatients = await Promise.all(
      queueEntries.map(async (entry) => {
        const patient = await Patient.findById(entry.referenceId);

        return {
          _id: entry._id.toString(),
          referenceId: entry.referenceId.toString(),
          status: entry.status,
          patientName: patient ? patient.name : "Unknown",
          patientId: patient ? patient._id.toString() : null,
          gender: patient ? patient.gender : "Unknown",
          birthday: patient ? patient.birthday : null,
          contact: patient ? patient.contact : null,
          medicalHistory: patient ? patient.medical_history : [],
          medications: patient ? patient.medications : [],
          visitHistory: patient ? patient.visit_history : [],
        };
      })
    );

    return queueWithPatients;
  } catch (error) {
    console.log("Error loading queue entries: ", error);
    return [];
  }
};

const getQueueNumber = async () => {
  try {
    await connectDB();
    const queueNumber = await QueueNum.find({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
      },
    });
    return queueNumber;
  } catch (error) {
    console.log("Error loading queue Number: ", error);
    return [];
  }
};

export default async function Page() {
  const queueEntries = await getQueueEntries();
  const queueNumber = await getQueueNumber();
  function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    // Adjust for negative months
    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }

    // Adjust for negative days in current month
    if (ageDays < 0) {
        ageMonths--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += lastMonth.getDate(); // Get the number of days in the previous month
    }

    return `${ageYears} years, ${ageMonths} months, ${ageDays} days old`;
  }
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Queue</h1>
        <div className="flex space-x-6">
          <div className="flex items-center mb-2">
            <span className="text-lg font-semibold text-gray-600">
              Total Entries Today:
            </span>
            <span className="ml-2 text-xl font-bold text-blue-600">
              {queueNumber.length}
            </span>
          </div>
        </div>
        {queueEntries.length === 0 ? (
          <p className="text-gray-500">No entries in the queue.</p>
        ) : (
          <ul className="space-y-4">
            {queueEntries.map((entry, index) => (
              <li
                key={entry._id}
                className="bg-white shadow-md rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex items-start space-x-3 flex-1">
                  <strong className="text-lg">{index + 1}.</strong>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {entry.gender === "female" ? (
                        <FaFemale className="text-pink-700" size={20} />
                      ) : (
                        <FaMale className="text-blue-700" size={20} />
                      )}
                      <span className="ml-2 text-lg font-medium">
                        {entry.patientName}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      {entry.contact?.address?.street},{" "}
                      {entry.contact?.address?.city},{" "}
                      {entry.contact?.address?.province}{" "}
                      {entry.contact?.phone && `- ${entry.contact.phone}`}
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      {entry.birthday
                        ? new Date(entry.birthday).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <p className="text-sm text-gray-600">
                      {entry.birthday
                        ? `${calculateAge(entry.birthday)}`
                        : "N/A"}
                    </p>
                    <div className="flex flex-col text-sm text-gray-600">
                      surgeries -{" "}
                      {Object.entries(entry.medicalHistory.surgeries || {})
                        .map(([key, value]) => `${value}`)
                        .join(", ")}
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      allergies -{" "}
                      {Object.entries(entry.medicalHistory.allergies || {})
                        .map(([key, value]) => `${value}`)
                        .join(", ")}
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      conditions -{" "}
                      {Object.entries(entry.medicalHistory.conditions || {})
                        .map(([key, value]) => `${value}`)
                        .join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 ">
                  <Link href={`/queue/${entry.patientId}/`}>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                      Admit
                    </button>
                  </Link>
                  <DeleteQue id={entry._id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
