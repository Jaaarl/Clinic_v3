// VisitForm.jsx
// Main edit visit form: vitals, SOAP notes, prescription, lab requests, print buttons

import Link from "next/link";
import AutoCompleteResta from "@/app/components/AutoCompleteResta";
import VitalsSection from "./VitalsSection";
import SOAPSection from "./SOAPSection";

export default function VisitForm({
  newVisit,
  name,
  gender,
  birthday,
  fullAddress,
  docName,
  lic,
  ptr,
  s2,
  resetInput,
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
            name={name}
            birthday={birthday}
            gender={gender}
            fullAddress={fullAddress}
            resetInput={resetInput}
            newVisit={newVisit}
            docName={docName}
            lic={lic}
            ptr={ptr}
            s2={s2}
          />
          <PrintLabRequestButton
            name={name}
            birthday={birthday}
            gender={gender}
            fullAddress={fullAddress}
            labReq={newVisit.form.labReq}
            newVisit={newVisit}
            docName={docName}
            lic={lic}
            ptr={ptr}
            s2={s2}
          />
          <PrintMedicalFormButton
            name={name}
            birthday={birthday}
            gender={gender}
            newVisit={newVisit}
            docName={docName}
            lic={lic}
            ptr={ptr}
            s2={s2}
          />
        </div>
      </form>
    </div>
  );
}

// Print Prescription Button
function PrintPrescriptionButton({
  name,
  birthday,
  gender,
  fullAddress,
  resetInput,
  newVisit,
  docName,
  lic,
  ptr,
  s2,
}) {
  return (
    <Link
      href={{
        pathname: "/reseta",
        query: {
          name: encodeURIComponent(name),
          birthday: encodeURIComponent(birthday),
          address: encodeURIComponent(fullAddress),
          sex: encodeURIComponent(gender[0].toUpperCase()),
          req: encodeURIComponent(resetInput),
          date: encodeURIComponent(newVisit.visit_date),
          docName: encodeURIComponent(docName),
          lic: encodeURIComponent(lic),
          ptr: encodeURIComponent(ptr),
          s2: encodeURIComponent(s2),
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
function PrintLabRequestButton({
  name,
  birthday,
  gender,
  fullAddress,
  labReq,
  newVisit,
  docName,
  lic,
  ptr,
  s2,
}) {
  return (
    <Link
      href={{
        pathname: "/labReq",
        query: {
          name: encodeURIComponent(name),
          birthday: encodeURIComponent(birthday),
          address: encodeURIComponent(fullAddress),
          sex: encodeURIComponent(gender[0].toUpperCase()),
          req: encodeURIComponent(labReq),
          date: encodeURIComponent(newVisit.visit_date),
          docName: encodeURIComponent(docName),
          lic: encodeURIComponent(lic),
          ptr: encodeURIComponent(ptr),
          s2: encodeURIComponent(s2),
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
function PrintMedicalFormButton({
  name,
  birthday,
  gender,
  newVisit,
  docName,
  lic,
  ptr,
  s2,
}) {
  return (
    <Link
      href={{
        pathname: "/certificate",
        query: {
          name: encodeURIComponent(name),
          birthday: encodeURIComponent(birthday),
          address: encodeURIComponent(""), // Not used in certificate but kept for compatibility
          sex: encodeURIComponent(gender.toUpperCase()),
          req1: encodeURIComponent(newVisit.soap.assessment),
          req2: encodeURIComponent(newVisit.soap.plan),
          date: encodeURIComponent(
            new Date(newVisit.visit_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          ),
          docName: encodeURIComponent(docName),
          lic: encodeURIComponent(lic),
          ptr: encodeURIComponent(ptr),
          s2: encodeURIComponent(s2),
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
