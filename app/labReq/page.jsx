"use client";
import React from "react";
import LabReqForm from "../components/LabReqForm";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const visitDate = searchParams.get("visitDate");

  return (
    <>
      <LabReqForm
        patientId={patientId}
        visitDate={visitDate}
      />
    </>
  );
}
