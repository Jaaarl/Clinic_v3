import EditQueForm from "@/app/components/EditQueForm";
import Navbar from "@/app/components/Navbar";
import React from "react";
import { getApiUrl } from "@/lib/config/api";

const getQueueWithPatient = async (id) => {
  const res = await fetch(getApiUrl(`/api/queue/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch queue entry");
  }
  return res.json();
};

export default async function page({ params }) {
  const { id } = params;
  const { patient, queueEntry } = await getQueueWithPatient(id);
  const {
    _id: patientId,
    name,
    gender,
    contact,
    medical_history,
    medications,
    birthday,
    visit_history,
  } = patient;

  // Get doctor (this could also be moved to an API)
  const doctorRes = await fetch(getApiUrl("/api/doctor"), { cache: "no-store" });
  const doctorData = await doctorRes.json();
  const doctor = doctorData.doctors?.[0] || {};
  const { name: doctorName, lic, ptr, s2 } = doctor;

  return (
    <>
      <Navbar />
      <div>
        <EditQueForm
          id={patientId}
          queueId={id}
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
