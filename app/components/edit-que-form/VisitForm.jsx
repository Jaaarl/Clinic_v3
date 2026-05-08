// VisitForm.jsx
// Main edit visit form: vitals, SOAP notes, prescription, lab requests, print buttons

import Link from "next/link";
import AutoCompleteResta from "@/app/components/AutoCompleteResta";
import VitalsSection from "./VitalsSection";
import SOAPSection from "./SOAPSection";

export default function VisitForm({
  newVisit = {},
  onInputChange,
  onResetInput,
  onSubmit,
}) {
  return (
    <div className="w-2/3 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Edit Visit</h2>
      <form onSubmit={onSubmit}>
        {/* Visit Details */}
        <label className="block text-sm font-medium mb-1">Visit Date:</label>
        <input
          disabled={true}
          type="date"
          value={newVisit.visit_date}
          onChange={(e) => onInputChange(e, null, "visit_date")}
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          required
        />

        {/* Vitals Section */}
        <VitalsSection vitals={newVisit.vitals} onInputChange={onInputChange} />

        {/* SOAP Notes */}
        <SOAPSection soap={newVisit.soap} onInputChange={onInputChange} />

        {/* Prescription */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium mb-1">
            Prescription:
          </label>
          <AutoCompleteResta
            reseta={newVisit.form.reseta}
            onInputChange={onResetInput}
          />
        </div>

        {/* Lab Request */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium mb-1">
            Laboratory Request
          </label>
          <textarea
            value={newVisit.form.labReq}
            onChange={(e) => onInputChange(e, "form", "labReq")}
            className="w-full border border-gray-300 rounded-md p-2 min-h-[300px]"
            rows="3"
          />
        </div>

        {/* Form Action Buttons */}
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Update Visit
          </button>
          <PrintPrescriptionButton
            patientId={newVisit.patientId}
            visitDate={newVisit.visit_date}
          />
          <PrintLabRequestButton
            patientId={newVisit.patientId}
            visitDate={newVisit.visit_date}
          />
          <PrintMedicalFormButton
            patientId={newVisit.patientId}
            visitDate={newVisit.visit_date}
          />
        </div>
      </form>
    </div>
  );
}

// Print Prescription Button
function PrintPrescriptionButton({ patientId, visitDate }) {
  return (
    <Link
      href={{
        pathname: "/reseta",
        query: {
          patientId: patientId || "",
          visitDate: visitDate || "",
        },
      }}
    >
      <button
        type="button"
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
      >
        Print Prescription
      </button>
    </Link>
  );
}

// Print Lab Request Button
function PrintLabRequestButton({ patientId, visitDate }) {
  return (
    <Link
      href={{
        pathname: "/labReq",
        query: {
          patientId: patientId || "",
          visitDate: visitDate || "",
        },
      }}
    >
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Print Lab Request Form
      </button>
    </Link>
  );
}

// Print Medical Form Button
function PrintMedicalFormButton({ patientId, visitDate }) {
  return (
    <Link
      href={{
        pathname: "/certificate",
        query: {
          patientId: patientId || "",
          visitDate: visitDate || "",
        },
      }}
    >
      <button
        type="button"
        className="ml-2 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Print Medical Form
      </button>
    </Link>
  );
}
