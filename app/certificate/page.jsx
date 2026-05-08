"use client";
import { React } from "react";
import Certi from "../components/Certi";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const visitDate = searchParams.get("visitDate");

  return (
    <>
      <div>
        <Certi
          patientId={patientId}
          visitDate={visitDate}
        />
      </div>
    </>
  );
}
