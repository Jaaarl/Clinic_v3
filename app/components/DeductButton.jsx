"use client";
import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function DeductButton({ id, currentStock, name, exp }) {
  const [quantityToDeduct, setQuantityToDeduct] = useState(1);
  const router = useRouter();

  const handleDeduct = async () => {
    try {
      const response = await fetch(
        `/api/inventory?id=${id}&quantityToDeduct=${quantityToDeduct}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            quantityToDeduct,
          }),
        }
      );

      if (response.ok) {
        // Log the deduction
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            exp,
            quantityDeducted: quantityToDeduct,
            timestamp: new Date().toISOString(),
          }),
        });

        alert("Inventory deducted!");
        router.refresh();
        window.location.reload();
      } else {
        alert("Insufficient Inventory");
      }
    } catch (error) {
      console.error("Error deducting inventory:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1) {
      setQuantityToDeduct(1);
    } else if (value > currentStock) {
      setQuantityToDeduct(currentStock);
    } else {
      setQuantityToDeduct(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        value={quantityToDeduct}
        min="1"
        max={currentStock}
        onChange={handleChange}
        className="w-20 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleDeduct}
        className="text-red-500 hover:text-red-700"
      >
        <FaMinusCircle size={24} />
      </button>
    </div>
  );
}
