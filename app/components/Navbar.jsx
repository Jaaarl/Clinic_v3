"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [clinicName, setClinicName] = useState("CLINIC_NAME");

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await fetch("/api/clinic-info");
        const data = await res.json();
        if (data.clinicInfo?.name) {
          setClinicName(data.clinicInfo.name);
        }
      } catch (error) {
        console.error("Error fetching clinic info:", error);
      }
    };

    fetchClinicInfo();
  }, []);

  return (
    <nav className="flex items-center justify-between gap-3 p-4 bg-gray-800 text-white">
      <Link href="/">{clinicName}</Link>
      <div className="flex gap-4">
        <Link href="/admin/inventorylog">Inventory log</Link>
        <Link href="/admin/queuelog">Queue log</Link>
        <Link href="/admin/sales">Sales</Link>
        <Link href="/admin/doctor">Doctor</Link>
        <Link href="/inventory">Inventory</Link>
        <Link href="/queue">Queue</Link>
      </div>
    </nav>
  );
}
