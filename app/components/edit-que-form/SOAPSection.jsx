// SOAPSection.jsx
// Handles SOAP notes: Subjective, Objective, Assessment, Plan

export default function SOAPSection({ soap = {}, onInputChange }) {
  return (
    <>
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">
          Subjective:
        </label>
        <textarea
          value={soap?.subjective ?? ""}
          onChange={(e) => onInputChange(e, "soap", "subjective")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">
          Objective:
        </label>
        <textarea
          value={soap?.objective ?? ""}
          onChange={(e) => onInputChange(e, "soap", "objective")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">
          Assessment:
        </label>
        <textarea
          value={soap?.assessment ?? ""}
          onChange={(e) => onInputChange(e, "soap", "assessment")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">Plan:</label>
        <textarea
          value={soap?.plan ?? ""}
          onChange={(e) => onInputChange(e, "soap", "plan")}
          className="w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
    </>
  );
}
