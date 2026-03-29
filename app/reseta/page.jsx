"use client";
import { React, useState, useEffect } from "react";
import Reseta from "../components/Reseta";
import { useSearchParams } from "next/navigation";

function decodeTwice(encodedStr) {
  if (!encodedStr) return "";
  const firstDecode = decodeURIComponent(encodedStr);
  const finalDecode = decodeURIComponent(firstDecode);
  return finalDecode;
}

function calculateAge(birthday) {
  if (!birthday) return "N/A";
  const birthDate = new Date(birthday);
  const today = new Date();
  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (
    ageMonths < 0 ||
    (ageMonths === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageYears--;
    ageMonths += 12;
  }

  if (ageYears === 0) {
    ageMonths = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
      ageMonths--;
    }

    if (ageMonths === 0) {
      const ageDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
      return `${ageDays} days old`;
    }

    return `${ageMonths} months old`;
  }

  return `${ageYears} years old`;
}

export default function Page() {
  const searchParams = useSearchParams();
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for new prescription ID in URL first
  const prescriptionId = searchParams.get("prescriptionId");
  const patientId = searchParams.get("patientId");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        // NEW: Fetch prescription from DB
        if (prescriptionId) {
          const res = await fetch(`/api/prescription?id=${prescriptionId}`);
          if (!res.ok) throw new Error("Prescription not found");
          const data = await res.json();
          setPrescription(data.prescription);

          // Also fetch patient info if patientId provided
          if (patientId) {
            const patientRes = await fetch(`/api/patient?search=&id=${patientId}`);
            if (patientRes.ok) {
              const patientData = await patientRes.json();
              if (patientData.patients?.length > 0) {
                setPatient(patientData.patients[0]);
              }
            }
          }
        } else {
          // LEGACY: No prescription ID, will use URL params (backward compatibility)
          setPrescription(null);
        }
      } catch (err) {
        setError(err.message || "Failed to load prescription");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [prescriptionId, patientId]);

  // Legacy URL params (backward compatibility for old reqs format)
  const name = searchParams.get("name");
  const sex = searchParams.get("sex");
  const date = searchParams.get("date");
  const address = searchParams.get("address");
  const req = searchParams.get("req");
  const docName = searchParams.get("docName");
  const lic = searchParams.get("lic");
  const ptr = searchParams.get("ptr");
  const s2 = searchParams.get("s2");
  const birthday = searchParams.get("age"); // Legacy uses age param for DOB

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading prescription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <p className="text-gray-500 mt-2">Prescription may no longer exist.</p>
      </div>
    );
  }

  // NEW: Structured prescription from DB
  if (prescription) {
    const formattedDate = new Date(prescription.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    });

    return (
      <div>
        <Reseta
          name={patient?.name || "Patient"}
          age={patient?.birthday ? calculateAge(patient.birthday) : "N/A"}
          gender={patient?.gender || "N/A"}
          address={patient?.contact?.address ? 
            `${patient.contact.address.street}, ${patient.contact.address.city}` : 
            "N/A"}
          date={formattedDate}
          medicines={prescription.medicines}
          notes={prescription.notes}
          docName={prescription.doctorName}
          lic={prescription.doctorLicense}
          ptr={prescription.doctorPtr}
          s2={prescription.doctorS2}
        />
      </div>
    );
  }

  // LEGACY: URL params-based prescription (backward compatibility)
  return (
    <div>
      <Reseta
        name={decodeTwice(name)}
        age={calculateAge(decodeTwice(birthday))}
        gender={sex}
        date={date}
        address={decodeTwice(address)}
        reqs={decodeTwice(req)}
        docName={decodeURIComponent(docName)}
        lic={decodeURIComponent(lic)}
        ptr={decodeURIComponent(ptr)}
        s2={decodeURIComponent(s2)}
      />
    </div>
  );
}
