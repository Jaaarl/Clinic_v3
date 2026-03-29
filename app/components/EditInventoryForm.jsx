"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditInventoryForm({
  id,
  name1,
  quantityInStock1,
  expirationDate1,
  price1,
}) {
  const [name, setName] = useState(name1);
  const [quantityInStock, setQuantityInStock] = useState(quantityInStock1);
  const [expirationDate, setExpirationDate] = useState(
    expirationDate1 ? new Date(expirationDate1).toISOString().split("T")[0] : ""
  );
  const [price, setPrice] = useState(price1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, quantityInStock, expirationDate, price }),
      });

      if (!res.ok) {
        throw new Error("Inventory not found.");
      }
      router.push("/inventory");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update inventory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit Inventory Item
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="quantityInStock"
                className="block text-sm font-semibold text-gray-700"
              >
                Quantity In Stock:
              </label>
              <input
                type="number"
                id="quantityInStock"
                value={quantityInStock}
                onChange={(e) => setQuantityInStock(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="expirationDate"
                className="block text-sm font-semibold text-gray-700"
              >
                Expiration Date:
              </label>
              <input
                type="date"
                id="expirationDate"
                onChange={(e) => setExpirationDate(e.target.value)}
                value={expirationDate}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700"
              >
                Price:
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
