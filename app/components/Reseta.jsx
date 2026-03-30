"use client";

import Head from "next/head";
import { FaPrescription } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Reseta({
  reqs,
  name,
  age,
  gender,
  address,
  date,
  docName,
  lic,
  ptr,
  s2,
}) {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await fetch("/api/clinic-info");
        const data = await res.json();
        setClinicInfo(data.clinicInfo);
      } catch (error) {
        console.error("Error fetching clinic info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicInfo();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // Format full address from parts
  const formatAddress = (addr) => {
    if (!addr) return "CLINIC_ADDRESS";
    const parts = [addr.street, addr.city, addr.province, addr.zip].filter(
      (p) => p && p.trim()
    );
    return parts.join(", ") || "CLINIC_ADDRESS";
  };

  const clinics = clinicInfo?.clinics || [];

  return (
    <div className="pt-1 px-4 max-w-md mx-auto font-sans">
      <Head>
        <title>Prescription</title>
        <meta name="description" content="Prescription page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Render each clinic */}
        {clinics.map((clinic, clinicIndex) => (
          <div key={clinicIndex} className="text-[9px]">
            {/* Clinic Name */}
            <h1 className="mt-2 font-bold text-center">
              {clinic.name || "CLINIC_NAME"}
            </h1>
            
            {/* All addresses for this clinic */}
            {clinic.addresses?.map((addr, addrIndex) => (
              <h2 key={addrIndex} className="text-center">
                {formatAddress(addr)}
              </h2>
            ))}
            
            {/* Clinic Hours Label */}
            {clinic.operatingHours?.length > 0 && (
              <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            )}
            
            {/* All hours for this clinic */}
            {clinic.operatingHours?.map((hour, hourIndex) => (
              <h4 key={hourIndex} className="text-center">
                {hour.schedule}
              </h4>
            ))}
          </div>
        ))}

        {/* Fallback if no clinic info */}
        {clinics.length === 0 && (
          <div className="text-[9px]">
            <h1 className="mt-2 font-bold text-center">CLINIC_NAME</h1>
            <h2 className="text-center">CLINIC_ADDRESS</h2>
            <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            <h4 className="text-center">CLINIC_HOURS</h4>
          </div>
        )}
      </main>

      <div className="space-y-2 text-[9px]">
        <section className="text-[9px]">
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
        <FaPrescription size={27} />
        <section className="text-[11px]">
          <p style={{ whiteSpace: "pre-wrap" }}>{reqs}</p>
        </section>
        <div className="flex">
          <div className="mt-auto pt-1 ml-auto font-bold text-[10px]">
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
            font-size: 12pt;
          }
        }
      `}</style>
    </div>
  );
}
