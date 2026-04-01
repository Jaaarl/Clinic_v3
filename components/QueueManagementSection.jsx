// QueueManagementSection.jsx
// Queue status and visit type

export default function QueueManagementSection({ queueData, onQueueChange, doctor, doctorName, lic, ptr, s2 }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-3">Queue Management</h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Visit Type</label>
        <select value={queueData.visit_type} onChange={(e) => onQueueChange("visit_type", e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="new">New Patient</option>
          <option value="transfer">Transfer Patient</option>
          <option value="followup">Follow-up</option>
          <option value="consultation">Consultation</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
        <select value={queueData.status} onChange={(e) => onQueueChange("status", e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="waiting">Waiting</option>
          <option value="withdoctor">With Doctor</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Attending Physician</label>
        <input type="text" value={doctorName || "Doctor"} readOnly
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">License Numbers</label>
        <div className="bg-gray-100 p-3 rounded border">
          <p className="text-sm"><span className="font-medium">Lic #:</span> {lic || "N/A"}</p>
          <p className="text-sm"><span className="font-medium">PTR #:</span> {ptr || "N/A"}</p>
          <p className="text-sm"><span className="font-medium">S2 #:</span> {s2 || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
