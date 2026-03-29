import Link from "next/link";
import React from "react";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-3 p-4 bg-gray-800 text-white">
      <Link href="/">CLINIC_NAME</Link>
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
