"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddInventoryForm() {
  const [name, setName] = useState("");
  const [quantityInStock, setQuantityInStock] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    const data = { name, quantityInStock, expirationDate, price };

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        setName("");
        setQuantityInStock("");
        setExpirationDate("");
        setPrice("");
        router.push("/inventory").then(() => {
          router.reload(); // Refresh the page after navigation
        });
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred while adding the inventory item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add New Inventory Item
        </h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {successMessage && (
          <div className="text-green-600 mb-4">{successMessage}</div>
        )}

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
              min="0"
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
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
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
              min="0"
              className="w-full px-4 py-2 mt-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
          >
            {isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
