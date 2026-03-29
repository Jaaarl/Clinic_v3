"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AutoCompleteResta from "@/app/components/AutoCompleteResta";
import { calculateAge } from "@/lib/utils/dateUtils";

export default function EditQueForm({
  id,
  name1,
  gender1,
  birthday1,
  contact1,
  medical_history1,
  visit_history1,
  docName,
  lic,
  ptr,
  s2,
}) {
  const router = useRouter();

  const [name, setName] = useState(name1);
  const [gender, setGender] = useState(gender1);
  const [birthday, setBirthday] = useState(birthday1);

  const [contact, setContact] = useState({
    phone: contact1.phone || "",
    email: contact1.email || "",
    address: {
      street: contact1.address?.street || "",
      city: contact1.address?.city || "",
      province: contact1.address?.province || "",
      zip: contact1.address?.zip || "",
    },
  });

  const [medical_history, setMedicalHistory] = useState({
    allergies: medical_history1.allergies || [],
    conditions: medical_history1.conditions || [],
    surgeries: medical_history1.surgeries || [],
  });

  const [visit_history, setVisitHistory] = useState(visit_history1 || []);

  const getLatestVisit = () => {
    if (visit_history1.length === 0) {
      return {
        visit_date: new Date().toISOString().split("T")[0],
        soap: {
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
        },
        vitals: {
          height: "",
          weight: "",
          respiratory_rate: "",
          blood_pressure: "",
          heart_rate: "",
          temperature: "",
        },
        form: {
          reseta: resetInput,
          labReq: "",
        },
      };
    }

    const latestVisit = visit_history1[visit_history1.length - 1];
    return {
      visit_date:
        latestVisit.visit_date || new Date().toISOString().split("T")[0],
      soap: {
        subjective: latestVisit.soap.subjective || "",
        objective: latestVisit.soap.objective || "",
        assessment: latestVisit.soap.assessment || "",
        plan: latestVisit.soap.plan || "",
      },
      vitals: {
        height: latestVisit.vitals.height || "",
        weight: latestVisit.vitals.weight || "",
        respiratory_rate: latestVisit.vitals.respiratory_rate || "",
        blood_pressure: latestVisit.vitals.blood_pressure || "",
        heart_rate: latestVisit.vitals.heart_rate || "",
        temperature: latestVisit.vitals.temperature || "",
      },
      form: {
        reseta: latestVisit.form.reseta || "",
        labReq: latestVisit.form.labReq || "",
      },
    };
  };

  const [newVisit, setNewVisit] = useState(getLatestVisit());

  useEffect(() => {
    setNewVisit(getLatestVisit());
  }, [visit_history1]);

  const [medicationFields, setMedicationFields] = useState([]);
  const [labReqFields, setLabReqFields] = useState([]);

  const handleContactChange = (e, field) => {
    setContact((prevContact) => ({
      ...prevContact,
      [field]: e.target.value,
    }));
  };

  const handleAddressChange = (e, field) => {
    setContact((prevContact) => ({
      ...prevContact,
      address: {
        ...prevContact.address,
        [field]: e.target.value,
      },
    }));
  };

  const handleMedicalHistoryChange = (e, field, index) => {
    setMedicalHistory((prevHistory) => {
      const updatedList = [...prevHistory[field]];
      if (index !== undefined) {
        updatedList[index] = e.target.value;
      } else {
        return prevHistory;
      }
      return {
        ...prevHistory,
        [field]: updatedList,
      };
    });
  };

  const handleInputChange = (e, section, field) => {
    if (section) {
      setNewVisit((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: e.target.value,
        },
      }));
    } else {
      setNewVisit((prevState) => ({
        ...prevState,
        [field]: e.target.value,
      }));
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    const updatedVisit = {
      ...newVisit,
      visit_date: newVisit.visit_date,
      soap: newVisit.soap,
      vitals: newVisit.vitals,
      form: {
        reseta: resetInput, // Assuming it's a string
        labReq: newVisit.form.labReq, // Assuming it's a boolean
      },
    };

    console.log("Updated Visit Data:", updatedVisit);

    const updatedVisitHistory = [...visit_history];
    if (updatedVisitHistory.length > 0) {
      updatedVisitHistory[updatedVisitHistory.length - 1] = {
        ...updatedVisitHistory[updatedVisitHistory.length - 1],
        ...updatedVisit,
      };
    } else {
      updatedVisitHistory.push(updatedVisit);
    }

    console.log("Updated Visit History:", updatedVisitHistory);

    try {
      const res = await fetch(`/api/patient/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          gender,
          contact,
          medical_history,
          birthday,
          visit_history: updatedVisitHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update patient");
      }
      alert("Patient information updated successfully.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the patient information.");
    }
  };

  const handleReset = () => {
    const latest = getLatestVisit();
    setNewVisit(latest);
    setMedicationFields(
      latest.reseta.medication_names.map((med, index) => ({
        name: med,
        instruction: latest.reseta.instructions[index] || "",
      }))
    );
    setLabReqFields(latest.labReq);
  };

  const [resetInput, setResetInput] = useState("");

  const handleResetInput = (newValue) => {
    setResetInput(newValue);
  };

  const fullAddress =
    contact.address.street +
    ", " +
    contact.address.city +
    ", " +
    contact.address.province;

  const [expandedVisitIndex, setExpandedVisitIndex] = useState(null);

  function decodeTwice(encodedStr) {
    const firstDecode = decodeURIComponent(encodedStr);
    const finalDecode = decodeURIComponent(firstDecode);
    return finalDecode;
  }

  return (
    <div className="flex gap-4 mx-3">
      {/* Patient Information Sidebar */}
      <div className="w-1/3 p-4 bg-white rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-lg font-bold mb-2 flex items-center justify-between">
          <span>Patient Info</span>
          <Link
            href={`/editPatient/${id}`}
            onClick={handleSubmit}
            className="bg-blue-500 p-1 px-2 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
          >
            Edit
          </Link>
        </h2>
        <p className="text-sm font-medium">Name: {name}</p>
        <p className="text-sm font-medium">
          Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </p>
        {/* //entry.birthday ? new Date(entry.birthday).toLocaleDateString()  */}
        <p className="text-sm font-medium">
          {/* Birthday: {birthday || 'N/A'} */}
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
              <div key={index} className="border-b border-gray-200 py-2">
                <button
                  onClick={() => {
                    setExpandedVisitIndex(
                      expandedVisitIndex === index ? null : index
                    );
                  }}
                  className="text-blue-500 hover:underline"
                >
                  {expandedVisitIndex === index
                    ? "Hide Details"
                    : new Date(visit.visit_date).toLocaleDateString()}
                </button>
                {expandedVisitIndex === index && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      Visit Date:{" "}
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Subjective: {visit.soap.subjective || "N/A"}
                    </p>
                    <p className="text-sm">
                      Objective: {visit.soap.objective || "N/A"}
                    </p>
                    <p className="text-sm">
                      Assessment: {visit.soap.assessment || "N/A"}
                    </p>
                    <p className="text-sm">Plan: {visit.soap.plan || "N/A"}</p>
                    <br></br>
                    <p className="text-sm">
                      Prescription: <br />
                      {decodeTwice(visit.form.reseta)
                        ? decodeTwice(visit.form.reseta)
                            .split("\n")
                            .map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))
                        : "N/A"}
                    </p>

                    <p className="text-sm">
                      Lab Request: <br />
                      {visit.form.labReq
                        ? visit.form.labReq.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        : "N/A"}
                    </p>
                    <br />
                    {/* Vitals */}
                    <p className="text-sm">
                      Height: {visit.vitals.height || "N/A"}
                    </p>
                    <p className="text-sm">
                      Weight: {visit.vitals.weight || "N/A"}
                    </p>
                    <p className="text-sm">
                      Respiratory Rate: {visit.vitals.respiratory_rate || "N/A"}
                    </p>
                    <p className="text-sm">
                      Blood Pressure: {visit.vitals.blood_pressure || "N/A"}
                    </p>
                    <p className="text-sm">
                      Heart Rate: {visit.vitals.heart_rate || "N/A"}
                    </p>
                    <p className="text-sm">
                      Temperature: {visit.vitals.temperature || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p className="text-sm">No previous visits recorded.</p>
        )}
      </div>

      {/* Edit Visit Form */}
      <div className="w-2/3 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Edit Visit</h2>
        <form onSubmit={handleSubmit}>
          {/* Visit Details */}
          <label className="block text-sm font-medium mb-1">Visit Date:</label>
          <input
            disabled={true}
            type="date"
            value={newVisit.visit_date}
            onChange={(e) => handleInputChange(e, null, "visit_date")}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Height (cm):
              </label>
              <input
                value={newVisit.vitals.height}
                onChange={(e) => handleInputChange(e, "vitals", "height")}
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (kg):
              </label>
              <input
                value={newVisit.vitals.weight}
                onChange={(e) => handleInputChange(e, "vitals", "weight")}
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Respiratory Rate:
              </label>
              <input
                value={newVisit.vitals.respiratory_rate}
                onChange={(e) =>
                  handleInputChange(e, "vitals", "respiratory_rate")
                }
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Blood Pressure:
              </label>
              <input
                type="text"
                value={newVisit.vitals.blood_pressure}
                onChange={(e) =>
                  handleInputChange(e, "vitals", "blood_pressure")
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., 120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Heart Rate:
              </label>
              <input
                value={newVisit.vitals.heart_rate}
                onChange={(e) => handleInputChange(e, "vitals", "heart_rate")}
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Temperature (°C):
              </label>
              <input
                value={newVisit.vitals.temperature}
                onChange={(e) => handleInputChange(e, "vitals", "temperature")}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* SOAP Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Subjective:
              </label>
              <textarea
                value={newVisit.soap.subjective}
                onChange={(e) => handleInputChange(e, "soap", "subjective")}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Objective:
              </label>
              <textarea
                value={newVisit.soap.objective}
                onChange={(e) => handleInputChange(e, "soap", "objective")}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Assessment:
              </label>
              <textarea
                value={newVisit.soap.assessment}
                onChange={(e) => handleInputChange(e, "soap", "assessment")}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Plan:</label>
              <textarea
                value={newVisit.soap.plan}
                onChange={(e) => handleInputChange(e, "soap", "plan")}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Prescription:
              </label>
              <AutoCompleteResta
                reseta={newVisit.form.reseta}
                onInputChange={handleResetInput}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Laboratory Request
              </label>
              <textarea
                value={newVisit.form.labReq}
                onChange={(e) => handleInputChange(e, "form", "labReq")}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[300px]"
                rows="3"
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="mt-6 flex">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Update Visit
            </button>
            {/* <Link href={"/reseta"}> */}
            <Link
              href={{
                pathname: "/reseta",
                query: {
                  name: encodeURIComponent(name),
                  age: encodeURIComponent(birthday),
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
            <Link
              href={{
                pathname: "/labReq",
                query: {
                  name: encodeURIComponent(name),
                  age: encodeURIComponent(birthday),
                  address: encodeURIComponent(fullAddress),
                  sex: encodeURIComponent(gender[0].toUpperCase()),
                  req: encodeURIComponent(newVisit.form.labReq),
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
            <Link
              href={{
                pathname: "/certificate",
                query: {
                  name: encodeURIComponent(name),
                  age: encodeURIComponent(birthday),
                  address: encodeURIComponent(fullAddress),
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
          </div>
        </form>
      </div>
    </div>
  );
}
