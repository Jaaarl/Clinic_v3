"use client";

import Head from "next/head";
import { FaPrescription } from "react-icons/fa";
import { useEffect, useState } from "react";
import { calculateAge } from "@/lib/utils/dateUtils";

export default function Reseta({ patientId, visitDate, size = "a6" }) {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printData, setPrintData] = useState(null);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await fetch("/api/clinic-info");
        const data = await res.json();
        setClinicInfo(data.clinicInfo);
      } catch (error) {
        console.error("Error fetching clinic info:", error);
      }
    };

    const fetchPrintData = async () => {
      if (!patientId || !visitDate) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/print-data?patientId=${patientId}&visitDate=${encodeURIComponent(visitDate)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPrintData(data);
      } catch (error) {
        console.error("Error fetching print data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicInfo();
    fetchPrintData();
  }, [patientId, visitDate]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const name = printData?.patient?.name || "";
  const birthday = printData?.patient?.birthday || "";
  const gender = printData?.patient?.gender || "";
  const address = printData?.patient?.address || "";
  const date = printData?.visit?.date || "";
  const docName = printData?.doctor?.name || "";
  const lic = printData?.doctor?.lic || "";
  const ptr = printData?.doctor?.ptr || "";
  const s2 = printData?.doctor?.s2 || "";
  const reqs = printData?.prescription || "";

  const age = calculateAge(birthday);

  const formatAddress = (addr) => {
    if (!addr) return "CLINIC_ADDRESS";
    const parts = [addr.street, addr.city, addr.province, addr.zip].filter(
      (p) => p && p.trim()
    );
    return parts.join(", ") || "CLINIC_ADDRESS";
  };

  const clinics = clinicInfo?.clinics || [];

  const isLetter = size === "letter";
  const containerClass = isLetter
    ? "pt-2 px-6 max-w-[650px] mx-auto font-sans"
    : "pt-1 px-4 max-w-md mx-auto font-sans";
  const textSize = isLetter ? "text-xs" : "text-[9px]";
  const bodySize = isLetter ? "text-sm" : "text-[11px]";

  return (
    <div className={containerClass}>
      <Head>
        <title>Prescription</title>
        <meta name="description" content="Prescription page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {clinics.map((clinic, clinicIndex) => (
          <div key={clinicIndex} className={textSize}>
            <h1 className="mt-2 font-bold text-center">
              {clinic.name || "CLINIC_NAME"}
            </h1>
            {clinic.addresses?.map((addr, addrIndex) => (
              <h2 key={addrIndex} className="text-center">
                {formatAddress(addr)}
              </h2>
            ))}
            {clinic.operatingHours?.length > 0 && (
              <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            )}
            {clinic.operatingHours?.map((hour, hourIndex) => (
              <h4 key={hourIndex} className="text-center">
                {hour.schedule}
              </h4>
            ))}
          </div>
        ))}

        {clinics.length === 0 && (
          <div className={textSize}>
            <h1 className="mt-2 font-bold text-center">CLINIC_NAME</h1>
            <h2 className="text-center">CLINIC_ADDRESS</h2>
            <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            <h4 className="text-center">CLINIC_HOURS</h4>
          </div>
        )}
      </main>

      <div className={`space-y-2 ${textSize}`}>
        <section className={textSize}>
          <div className="flex justify-between">
            <p>
              <strong>Patient:</strong> {name}
            </p>
            <div className="flex gap-1">
              <p>
                <strong>Age:</strong> {age}
              </p>
              <p>
                <strong>Sex:</strong> {gender}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
          </div>
        </section>
        <div className="border-t border-black pt-2 h-0.5"></div>
        <FaPrescription size={isLetter ? 36 : 27} />
        <section className={bodySize}>
          <p style={{ whiteSpace: "pre-wrap" }}>{reqs}</p>
        </section>
        <div className="flex">
          <div className="mt-auto pt-1 ml-auto font-bold">
            <p className="font-bold"> {docName}</p>
            <p>
              <strong>Lic. #:</strong> {lic}
            </p>
            <p>
              <strong>PTR No.:</strong> {ptr}
            </p>
            <p>
              <strong>S2 Lic#:</strong> {s2}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .container {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .letter-size {
            font-size: 12pt;
          }
          .a6-size {
            font-size: 10pt;
          }
        }
      `}</style>
    </div>
  );
}
