import React from "react";
import { FaMale } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import RemoveBtn from "../components/RemoveBtn";
import Link from "next/link";

const getPatient = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/patient", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch patient");
    }
    const data = await res.json();
    return data;
  } catch (Error) {
    console.log("Error loading Patient: ", Error);
  }
};
export default async function PatientList() {
  let { patients } = await getPatient();

  return (
    <>
      {patients &&
        patients.map((p) => (
          <tr key={p._id}>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <div className="flex items-center">
                {p.gender == "female" ? (
                  <FaFemale className="text-pink-700" size={20} />
                ) : (
                  <FaMale className="text-blue-700" size={20} />
                )}
                <div className="font-medium flex flex-col text-left">
                  {p.name}
                  <div>{p.contact.phone}</div>
                  <div className="font-light text-[10px]">
                    {p.contact.address.street} {p.contact.address.city},{" "}
                    {p.contact.address.province} , {p.contact.address.zip}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-4 py-2 border border-gray-300 text-left">
              <div>Alergies - {p.medical_history.allergies.join(", ")}</div>
              <div>Conditions - {p.medical_history.conditions.join(", ")}</div>
              <div>Surgeries - {p.medical_history.surgeries.join(", ")}</div>
            </td>
            <td className="px-4 py-2 border border-gray-300 text-left">
              {p.visit_history
                .slice(-7)
                .reverse()
                .map((visit, index) => (
                  <div key={index}>
                    {visit.visit_date}
                    {index !== 6 && ", "}
                  </div>
                ))}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <div className="flex justify-center items-center gap-4">
                <RemoveBtn id={p._id} />
                <Link href={`/editPatient/${p._id}`}>
                  <FaEdit size={24} />
                </Link>
                <Link href={`/addQue/${p._id}`}>
                  <IoIosAddCircle size={24} />
                </Link>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
}
