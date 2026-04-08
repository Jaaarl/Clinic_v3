"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientInfoPanel from "./edit-que-form/PatientInfoPanel";
import VisitForm from "./edit-que-form/VisitForm";

export default function EditQueForm({
  id,
  queueId,
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
          reseta: "",
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
    e.preventDefault();

    const updatedVisit = {
      ...newVisit,
      visit_date: newVisit.visit_date,
      soap: newVisit.soap,
      vitals: newVisit.vitals,
      form: {
        reseta: resetInput,
        labReq: newVisit.form.labReq,
      },
    };

    const updatedVisitHistory = [...visit_history];
    if (updatedVisitHistory.length > 0) {
      updatedVisitHistory[updatedVisitHistory.length - 1] = {
        ...updatedVisitHistory[updatedVisitHistory.length - 1],
        ...updatedVisit,
      };
    } else {
      updatedVisitHistory.push(updatedVisit);
    }

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

  return (
    <div className="flex gap-4 mx-3">
      {/* Patient Information Sidebar */}
      <PatientInfoPanel
        id={id}
        name={name}
        gender={gender}
        birthday={birthday}
        contact={contact}
        medical_history={medical_history}
        visit_history={visit_history}
        onSubmit={handleSubmit}
      />

      {/* Edit Visit Form */}
      <VisitForm
        newVisit={newVisit}
        name={name}
        gender={gender}
        birthday={birthday}
        fullAddress={fullAddress}
        docName={docName}
        lic={lic}
        ptr={ptr}
        s2={s2}
        resetInput={resetInput}
        onInputChange={handleInputChange}
        onResetInput={handleResetInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
