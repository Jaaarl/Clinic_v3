"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

export default function PrintPrescriptionButton({ patientId, visitDate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div className="flex">
        <Link
          href={{
            pathname: "/reseta",
            query: {
              patientId: patientId || "",
              visitDate: visitDate || "",
              size: "a6",
            },
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
        >
          Print Rx
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded-r border-l border-yellow-700 focus:outline-none focus:shadow-outline"
        >
          <FaChevronDown size={12} />
        </button>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
          <Link
            href={{
              pathname: "/reseta",
              query: {
                patientId: patientId || "",
                visitDate: visitDate || "",
                size: "a6",
              },
            }}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
          >
            A6 (Default)
          </Link>
          <Link
            href={{
              pathname: "/reseta",
              query: {
                patientId: patientId || "",
                visitDate: visitDate || "",
                size: "letter",
              },
            }}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
          >
            Letter (8.5x11)
          </Link>
        </div>
      )}
    </div>
  );
}
