"use client";

import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function RemoveBtn({ id }) {
  const router = useRouter();
  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`/api/patient/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.reload();
      }
    }
  };
  return (
    <button onClick={removeTopic}>
      <FaRegTrashAlt size={24} className="text-red-700" />
    </button>
  );
}
