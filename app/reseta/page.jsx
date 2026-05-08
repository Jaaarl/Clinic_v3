"use client";
import { React } from "react";
import Reseta from "../components/Reseta";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const visitDate = searchParams.get("visitDate");
  const size = searchParams.get("size") || "a6";

  return (
    <>
      <div>
        <Reseta
          patientId={patientId}
          visitDate={visitDate}
          size={size}
        />
      </div>
    </>
  );
}
