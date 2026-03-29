import EditQueForm from "@/app/components/EditQueForm";
import Navbar from "@/app/components/Navbar";
import React from "react";
import connectDB from "@/libs/mongodb";
import Doctor from "@/models/doctor";
const getPatientById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/patient/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }
    console.log(res);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const getDoctor = async () => {
  await connectDB();
  const doctor = await Doctor.findOne();
  return doctor;
};

export default async function page({ params }) {
  const { id } = params;
  const { patient } = await getPatientById(id);
  const doctor = await getDoctor();
  const {
    name,
    gender,
    contact,
    medical_history,
    medications,
    birthday,
    visit_history,
  } = patient;
  const { name: doctorName, lic, ptr, s2 } = doctor;
  return (
    <>
      <Navbar />
      <div>
        <EditQueForm
          id={id}
          name1={name}
          gender1={gender}
          contact1={contact}
          medical_history1={medical_history}
          medication1={medications}
          birthday1={birthday}
          visit_history1={visit_history}
          docName={doctorName}
          lic={lic}
          ptr={ptr}
          s2={s2}
        />
      </div>
    </>
  );
}
