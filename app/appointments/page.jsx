"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const VISIT_REASONS = ["Initial Visit", "Follow-up", "Lab Result Reading"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    scheduledDate: "",
    scheduledTime: "",
    visitReason: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/appointments?date=${selectedDate}&limit=100`,
      );
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patient?limit=100");
      const data = await res.json();
      if (data.patients) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctor");
      const data = await res.json();
      if (data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData.doctorId || !formData.scheduledDate) return;

    try {
      const res = await fetch(
        `/api/doctors/${formData.doctorId}/schedule/slots?date=${formData.scheduledDate}`,
      );
      const data = await res.json();
      if (data.slots) {
        setAvailableSlots(data.slots);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "doctorId" || name === "scheduledDate") {
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowForm(false);
        setFormData({
          patientId: "",
          doctorId: "",
          scheduledDate: "",
          scheduledTime: "",
          visitReason: "",
        });
        fetchAppointments();
      } else {
        setError(data.error || "Failed to create appointment");
      }
    } catch (err) {
      setError("Error creating appointment");
      console.error(err);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!confirm("Cancel this appointment?")) return;

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to cancel");
      }
    } catch (err) {
      setError("Error cancelling appointment");
      console.error(err);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/checkin`, {
        method: "POST",
      });

      if (res.ok) {
        fetchAppointments();
        alert("Patient checked in successfully!");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to check in");
      }
    } catch (err) {
      setError("Error checking in patient");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Scheduled Appointments
            </h1>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {showForm ? "Cancel" : "+ New Appointment"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* New Appointment Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">New Appointment</h2>
              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Patient
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleFormChange}
                    onBlur={fetchAvailableSlots}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleFormChange}
                    onBlur={fetchAvailableSlots}
                    min={new Date().toISOString().split("T")[0]}
                    max={
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time{" "}
                    {availableSlots.length === 0 &&
                      "(select doctor & date first)"}
                  </label>
                  <select
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleFormChange}
                    required
                    disabled={availableSlots.length === 0}
                    className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  >
                    <option value="">Select Time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Visit Reason
                  </label>
                  <select
                    name="visitReason"
                    value={formData.visitReason}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Reason</option>
                    {VISIT_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create Appointment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No appointments for this date
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td className="px-4 py-3">{apt.scheduledTime}</td>
                      <td className="px-4 py-3 font-medium">
                        {apt.patientId?.name}
                      </td>
                      <td className="px-4 py-3">Dr. {apt.doctorId?.name}</td>
                      <td className="px-4 py-3">{apt.visitReason}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            apt.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : apt.status === "DONE"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {apt.status === "SCHEDULED" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCheckIn(apt._id)}
                              className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Check In
                            </button>
                            <button
                              onClick={() => handleCancel(apt._id)}
                              className="text-sm px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
