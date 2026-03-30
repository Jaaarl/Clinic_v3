"use client";

import { FaRegTrashAlt } from "react-icons/fa";
export default function RemoveItemButton({ id }) {
  const removeInventoryItem = async () => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.reload();
      }
    }
  };
  return (
    <button onClick={removeInventoryItem}>
      <FaRegTrashAlt size={24} className="text-red-700" />
    </button>
  );
}
