// LabRequestsSection.jsx
// Manages lab request items

export default function LabRequestsSection({
  labRequests,
  onAddLabRequest,
  onRemoveLabRequest,
  onLabRequestChange,
  onLabCheckboxChange,
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Laboratory Requests</h3>
        <button
          type="button"
          onClick={onAddLabRequest}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          Add Lab Request
        </button>
      </div>

      {labRequests.map((req, index) => (
        <div key={index} className="border rounded p-3 mb-2">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium">Request {index + 1}</span>
            {labRequests.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveLabRequest(index)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            )}
          </div>
          <textarea
            value={req.request}
            onChange={(e) => onLabRequestChange(index, e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
            rows="2"
            placeholder="Enter lab request details"
          />
          <div className="mt-2">
            <label className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={req.isDone || false}
                onChange={(e) => onLabCheckboxChange(index, e.target.checked)}
                className="form-checkbox h-4 w-4"
              />
              <span className="ml-2">Mark as Done</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
