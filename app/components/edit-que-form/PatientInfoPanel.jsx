// PatientInfoPanel.jsx
// Sidebar displaying patient info, medical history, and expandable visit history

import Link from "next/link";
import { useState } from "react";
import { calculateAge } from "@/lib/utils/dateUtils";

export default function PatientInfoPanel({
  id,
  name,
  gender,
  birthday,
  contact,
  medical_history,
  visit_history,
  onSubmit,
}) {
  const fullAddress =
    contact.address.street +
    ", " +
    contact.address.city +
    ", " +
    contact.address.province;

  return (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-lg font-bold mb-2 flex items-center justify-between">
        <span>Patient Info</span>
        <Link
          href={`/editPatient/${id}`}
          onClick={onSubmit}
          className="bg-blue-500 p-1 px-2 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
        >
          Edit
        </Link>
      </h2>
      <p className="text-sm font-medium">Name: {name}</p>
      <p className="text-sm font-medium">
        Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}
      </p>
      <p className="text-sm font-medium">
        Birthday:{" "}
        {birthday
          ? new Date(birthday).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })
          : "N/A"}
      </p>
      <p className="text-sm font-medium">
        Age: {birthday ? `${calculateAge(birthday, true)}` : "N/A"}
      </p>
      <p className="text-sm font-medium">Phone: {contact.phone}</p>
      <p className="text-sm font-medium">Email: {contact.email}</p>
      <p className="text-sm font-medium">
        Address: {contact.address.street}, {contact.address.city},{" "}
        {contact.address.province} {contact.address.zip}
      </p>

      <h3 className="text-md font-semibold mt-4 mb-2">Medical History</h3>
      <p className="text-sm">
        Allergies:{" "}
        {medical_history.allergies.length > 0
          ? medical_history.allergies.join(", ")
          : "None"}
      </p>
      <p className="text-sm">
        Surgeries:{" "}
        {medical_history.surgeries.length > 0
          ? medical_history.surgeries.join(", ")
          : "None"}
      </p>
      <p className="text-sm">
        Conditions:{" "}
        {medical_history.conditions.length > 0
          ? medical_history.conditions.join(", ")
          : "None"}
      </p>
      <p></p>

      <h3 className="text-md font-semibold mt-4">Visit History</h3>
      {visit_history.length > 0 ? (
        visit_history
          .slice()
          .reverse()
          .map((visit, index) => (
            <VisitHistoryItem key={index} visit={visit} index={index} />
          ))
      ) : (
        <p className="text-sm">No previous visits recorded.</p>
      )}
    </div>
  );
}

// Separate component for each visit history entry
function VisitHistoryItem({ visit, index }) {
  const [expanded, setExpanded] = useState(false);

  function decodeTwice(encodedStr) {
    if (!encodedStr) return "";
    try {
      const firstDecode = decodeURIComponent(encodedStr);
      const finalDecode = decodeURIComponent(firstDecode);
      return finalDecode;
    } catch (e) {
      return encodedStr;
    }
  }

  return (
    <div className="border-b border-gray-200 py-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 hover:underline"
      >
        {expanded ? "Hide Details" : new Date(visit.visit_date).toLocaleDateString()}
      </button>
      {expanded && (
        <div className="mt-2">
          <p className="text-sm font-medium">
            Visit Date: {new Date(visit.visit_date).toLocaleDateString()}
          </p>
          <p className="text-sm">
            Subjective: {visit.soap?.subjective || "N/A"}
          </p>
          <p className="text-sm">
            Objective: {visit.soap?.objective || "N/A"}
          </p>
          <p className="text-sm">
            Assessment: {visit.soap?.assessment || "N/A"}
          </p>
          <p className="text-sm">Plan: {visit.soap?.plan || "N/A"}</p>
          <br></br>
          <p className="text-sm">
            Prescription: <br />
            {visit.form?.reseta ? decodeTwice(visit.form.reseta)
              .split("\n")
              .map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))
              : "N/A"}
          </p>

          <p className="text-sm">
            Lab Request: <br />
            {visit.form?.labReq
              ? visit.form.labReq.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "N/A"}
          </p>
          <br />
          <p className="text-sm">Height: {visit.vitals?.height || "N/A"}</p>
          <p className="text-sm">Weight: {visit.vitals?.weight || "N/A"}</p>
          <p className="text-sm">
            Respiratory Rate: {visit.vitals?.respiratory_rate || "N/A"}
          </p>
          <p className="text-sm">
            Blood Pressure: {visit.vitals?.blood_pressure || "N/A"}
          </p>
          <p className="text-sm">
            Heart Rate: {visit.vitals?.heart_rate || "N/A"}
          </p>
          <p className="text-sm">
            Temperature: {visit.vitals?.temperature || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
