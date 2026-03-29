"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function DeleteQue({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you DONE with the Patient?");
    if (confirmed) {
      try {
        const res = await fetch(`/api/queue?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete queue entry");
        }

        const data = await res.json();
        alert("Patient Done");
        router.push("/queue");
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the entry");
      }
    }
  };
  return (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={handleDelete}
    >
      Done
    </button>
  );
}
