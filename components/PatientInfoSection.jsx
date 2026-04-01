// PatientInfoSection.jsx
// Patient basic information fields

export default function PatientInfoSection({ formData, onInputChange, onAddMedication, onRemoveMedication, onMedicationChange }) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Patient Name</label>
        <input type="text" value={formData.name} onChange={(e) => onInputChange(e, "name")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter patient name" />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">Birthday</label>
          <input type="date" value={formData.birthday} onChange={(e) => onInputChange(e, "birthday")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
          <select value={formData.gender} onChange={(e) => onInputChange(e, "gender")}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
        <input type="text" value={formData.contact} onChange={(e) => onInputChange(e, "contact")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter contact number" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Medical History</label>
        <textarea value={formData.medical_history} onChange={(e) => onInputChange(e, "medical_history")}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3" placeholder="Enter medical history" />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 text-sm font-bold">Current Medications</label>
          <button type="button" onClick={onAddMedication}
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline">Add Medication</button>
        </div>
        {formData.medications.map((med, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={med} onChange={(e) => onMedicationChange(index, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder={`Medication ${index + 1}`} />
            {formData.medications.length > 0 && (
              <button type="button" onClick={() => onRemoveMedication(index)}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-xs">Remove</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
