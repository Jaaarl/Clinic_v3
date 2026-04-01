// VitalsSection.jsx
// Handles vital signs inputs: height, weight, BP, heart rate, temperature, etc.

export default function VitalsSection({
  vitals = {},
  onInputChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Height (cm):
        </label>
        <input
          value={vitals?.height ?? ""}
          onChange={(e) => onInputChange(e, "vitals", "height")}
          className="w-full border border-gray-300 rounded-md p-2"
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Weight (kg):
        </label>
        <input
          value={vitals?.weight ?? ""}
          onChange={(e) => onInputChange(e, "vitals", "weight")}
          className="w-full border border-gray-300 rounded-md p-2"
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Respiratory Rate:
        </label>
        <input
          value={vitals?.respiratory_rate ?? ""}
          onChange={(e) =>
            onInputChange(e, "vitals", "respiratory_rate")
          }
          className="w-full border border-gray-300 rounded-md p-2"
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Blood Pressure:
        </label>
        <input
          type="text"
          value={vitals?.blood_pressure ?? ""}
          onChange={(e) =>
            onInputChange(e, "vitals", "blood_pressure")
          }
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="e.g., 120/80"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Heart Rate:
        </label>
        <input
          value={vitals?.heart_rate ?? ""}
          onChange={(e) => onInputChange(e, "vitals", "heart_rate")}
          className="w-full border border-gray-300 rounded-md p-2"
          min="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Temperature (°C):
        </label>
        <input
          value={vitals?.temperature ?? ""}
          onChange={(e) => onInputChange(e, "vitals", "temperature")}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
    </div>
  );
}
