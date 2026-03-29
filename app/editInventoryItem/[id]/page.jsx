import React from "react";
import EditInventoryForm from "@/app/components/EditInventoryForm";

const getInventoryItems = async (id) => {
  const res = await fetch(`/api/inventory/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch inventory");
  }
  return res.json();
};

export default async function editInventory({ params }) {
  const { id } = params;
  const { inventory } = await getInventoryItems(id);
  const { name, quantityInStock, expirationDate, price } = inventory;
  return (
    <>
      <EditInventoryForm
        id={id}
        name1={name}
        quantityInStock1={quantityInStock}
        expirationDate1={expirationDate}
        price1={price}
      />
    </>
  );
}
