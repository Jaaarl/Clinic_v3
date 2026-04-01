// CheckoutSection.jsx
// Manages checkout date and notes

export default function CheckoutSection({
  checkout,
  onCheckoutChange,
}) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-3">Checkout</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date of Checkout
        </label>
        <input
          type="date"
          value={checkout.date}
          onChange={(e) => onCheckoutChange("date", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Purpose of Visit
        </label>
        <input
          type="text"
          value={checkout.purpose}
          onChange={(e) => onCheckoutChange("purpose", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter purpose of visit"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Notes
        </label>
        <textarea
          value={checkout.notes}
          onChange={(e) => onCheckoutChange("notes", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="3"
          placeholder="Enter any additional notes"
        />
      </div>
    </div>
  );
}
