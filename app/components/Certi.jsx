"use client";

import Head from "next/head";
import { FaPrescription } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Certi({
  req1,
  req2,
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
    <div className="max-w-md mx-auto font-sans">
      <Head>
        <title>Medical Certificate</title>
        <meta name="description" content="Medical Certificate page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className=" flex items-center justify-center">
          <div className="bg-white rounded-lg">
            <div className="text-center">
              <h1 className="mt-2 font-bold">
                {clinicInfo?.name || "CLINIC_NAME"}
              </h1>
              <h2>{formatAddress(primaryAddress)}</h2>
            </div>
            <div className="border-t border-black pt-2 h-0.5"></div>
            <div className="text-center text-[20px] font-bold mb-4 font-roboto">
              MEDICAL CERTIFICATE
            </div>
            <p className="text-lg mb-3">To whom it may concern:</p>
            <p className="text-lg mb-3 text-justify">
              This is to certify that Mr./Ms./Mrs. <strong>{name}</strong>{" "}
              <strong>
                {age}, {gender}
              </strong>{" "}
              of <strong> {address}</strong>, was seen and examined on{" "}
              <strong>{date}</strong> with the following diagnosis:
            </p>
            <p style={{ whiteSpace: "pre-wrap" }} className="text-lg mb-4">
              {req1}
            </p>
            <p className="text-lg mb-4">Recommendation:</p>
            <p style={{ whiteSpace: "pre-wrap" }} className="text-lg mb-4">
              {req2}
            </p>
            <div className="mt-6 text-lg mb-5 text-justify">
              This certificate is being issued upon the request of the
              interested party for whatever purpose it may serve (excluding
              legal matters).
            </div>
            <div className="flex">
              <div className="mt-auto pt-1 ml-auto font-bold mt-10">
                <p className="font-bold"> {docName}</p>
                <p>
                  <strong>Lic. #:</strong> {lic}
                </p>
                <p>
                  <strong>PTR No.:</strong> {ptr}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
