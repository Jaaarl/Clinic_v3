import EditPatientForm from "@/app/components/EditPatientForm";
import React from "react";
import Navbar from "@/app/components/Navbar";
const getPatientById = async (id) => {
  try {
    const res = await fetch(`/api/patient/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function editPatient({ params }) {
  const { id } = params;
  const { patient } = await getPatientById(id);
  const { name, gender, contact, medical_history, medications, birthday } =
    patient;
  return (
    <>
      <Navbar />
      <EditPatientForm
        id={id}
        name1={name}
        gender1={gender}
        contact1={contact}
        medical_history1={medical_history}
        medication1={medications}
        birthday1={birthday}
      />
    </>
  );
}
