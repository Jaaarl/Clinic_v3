import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import React from "react";
import AddQueForm from "@/app/components/AddQueForm";
import Navbar from "@/app/components/Navbar";
import { getApiUrl } from "@/lib/config/api";

const getPatientById = async (id) => {
  const res = await fetch(getApiUrl(`/api/patient/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch patient");
  }
  return res.json();
};

export default async function AddQue({ params }) {
  const { id } = params;
  const { patient } = await getPatientById(id);
  const { name, gender, contact, medical_history, medications, visit_history } =
    patient;

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = month + "/" + date + "/" + year;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100  ">
        <div className="max-w-md w-full rounded overflow-hidden shadow-lg p-6 bg-white px-1">
          <div className="flex items-center flex-col">
            <div className="flex items-center mb-2 ">
              {gender === "female" ? (
                <FaFemale className="text-pink-700" size={20} />
              ) : (
                <FaMale className="text-blue-700" size={20} />
              )}
              <span className="ml-2 text-lg font-semibold">{name}</span>
            </div>
            <p className="text-[12px]">
              {contact.address.street}, {contact.address.city} {contact.phone}
            </p>
            <AddQueForm
              id={id}
              name1={name}
              gender1={gender}
              contact1={contact}
              medical_history1={medical_history}
              medication1={medications}
              visit_history1={visit_history}
            />
          </div>
        </div>
      </div>
    </>
  );
}
