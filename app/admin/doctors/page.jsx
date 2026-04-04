"use client";

import { useState, useEffect } from "react";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({ name: "", lic: "", ptr: "", s2: "" });
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: 1,
    slotDuration: 15,
    startTime: "08:00",
    endTime: "17:00",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctor");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDoctor ? `/api/doctor/${editingDoctor._id}` : "/api/doctor";
      const res = await fetch(url, {
        method: editingDoctor ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });

      if (res.ok) {
        fetchDoctors();
        closeModal();
      }
    } catch (err) {
      console.error("Error saving doctor:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      const res = await fetch(`/api/doctor/${id}`, { method: "DELETE" });
      if (res.ok) fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  const openModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setDoctorForm({ name: doctor.name, lic: doctor.lic || "", ptr: doctor.ptr || "", s2: doctor.s2 || "" });
    } else {
      setEditingDoctor(null);
      setDoctorForm({ name: "", lic: "", ptr: "", s2: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setDoctorForm({ name: "", lic: "", ptr: "", s2: "" });
  };

  // Schedule management
  const openScheduleModal = async (doctor) => {
    setSelectedDoctor(doctor);
    setScheduleModal(true);
    try {
      const res = await fetch(`/api/doctors/${doctor._id}/schedule`);
      const data = await res.json();
      setSchedules(data.schedule || []);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setSchedules([]);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/doctors/${selectedDoctor._id}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: [scheduleForm] }),
      });

      if (res.ok) {
        // Refresh schedules
        const refreshRes = await fetch(`/api/doctors/${selectedDoctor._id}/schedule`);
        const refreshData = await refreshRes.json();
        setSchedules(refreshData.schedule || []);
        // Reset form for next entry
        setScheduleForm({
          dayOfWeek: (scheduleForm.dayOfWeek + 1) % 7,
          slotDuration: 15,
          startTime: "08:00",
          endTime: "17:00",
        });
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

  const handleDeleteSchedule = async (dayOfWeek) => {
    if (!confirm("Remove schedule for this day?")) return;
    try {
      const res = await fetch(`/api/doctors/${selectedDoctor._id}/schedule`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayOfWeek }),
      });

      if (res.ok) {
        const refreshRes = await fetch(`/api/doctors/${selectedDoctor._id}/schedule`);
        const refreshData = await refreshRes.json();
        setSchedules(refreshData.schedule || []);
      }
    } catch (err) {
      console.error("Error deleting schedule:", err);
    }
  };

  const getScheduleForDay = (dayOfWeek) => {
    return schedules.find((s) => s.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Doctor
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">License #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">PTR #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">S2 #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Schedule</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="px-4 py-3 font-medium">{doctor.name}</td>
                  <td className="px-4 py-3 text-gray-600">{doctor.lic || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{doctor.ptr || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{doctor.s2 || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openScheduleModal(doctor)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Configure Schedule
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openModal(doctor)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">License #</label>
                <input
                  type="text"
                  value={doctorForm.lic}
                  onChange={(e) => setDoctorForm({ ...doctorForm, lic: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">PTR #</label>
                <input
                  type="text"
                  value={doctorForm.ptr}
                  onChange={(e) => setDoctorForm({ ...doctorForm, ptr: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">S2 #</label>
                <input
                  type="text"
                  value={doctorForm.s2}
                  onChange={(e) => setDoctorForm({ ...doctorForm, s2: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Schedule for Dr. {selectedDoctor.name}
            </h2>

            {/* Current Schedules */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Current Schedules</h3>
              {schedules.length === 0 ? (
                <p className="text-gray-500 text-sm">No schedules configured</p>
              ) : (
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const schedule = getScheduleForDay(day.value);
                    return (
                      <div key={day.value} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{day.label}</span>
                        {schedule ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {schedule.startTime} - {schedule.endTime} ({schedule.slotDuration} min slots)
                            </span>
                            <button
                              onClick={() => handleDeleteSchedule(day.value)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not available</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Schedule Form */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Add Schedule</h3>
              <form onSubmit={handleScheduleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Day</label>
                    <select
                      value={scheduleForm.dayOfWeek}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, dayOfWeek: parseInt(e.target.value) })
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      {DAYS.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slot Duration (min)</label>
                    <select
                      value={scheduleForm.slotDuration}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, slotDuration: parseInt(e.target.value) })
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="20">20 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      value={scheduleForm.startTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      value={scheduleForm.endTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add / Update Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
