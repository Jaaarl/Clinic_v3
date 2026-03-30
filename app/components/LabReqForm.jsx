"use client";

import React, { useEffect, useState } from "react";

export default function LabReqForm({
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

  // Get first address
  const primaryAddress = clinicInfo?.addresses?.[0];
  const formatAddress = (addr) => {
    if (!addr) return "CLINIC_ADDRESS";
    const parts = [addr.street, addr.city, addr.province, addr.zip].filter(
      (p) => p && p.trim()
    );
    return parts.join(", ") || "CLINIC_ADDRESS";
  };

  return (
    <div className="p-4 max-w-md mx-auto font-sans">
      <main>
        <h1 className="text-xs font-bold text-center">
          {clinicInfo?.name || "CLINIC_NAME"}
        </h1>
        <h2 className="text-xs text-center">{formatAddress(primaryAddress)}</h2>

        <h4 className="text-xs text-center font-bold">
          Laboratory Request Form
        </h4>
        <div className="space-y-2">
          <section className="text-xs">
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

          <section className="text-[12px] mb-1">
            <p>
              <strong>Request For:</strong>{" "}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{reqs}</p>
          </section>
          <div className="flex text-[10px]">
            <section className="pt-1 pb-3 mt-auto ml-auto">
              <p className="font-bold"> {docName}</p>
              <p>
                <strong>Lic. #:</strong> {lic}
              </p>
              <p>
                <strong>PTR No.:</strong> {ptr}
              </p>
            </section>
          </div>
        </div>
      </main>

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
