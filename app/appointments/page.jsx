"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const VISIT_REASONS = ["Initial Visit", "Follow-up", "Lab Result Reading"];

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    scheduledDate: "",
    scheduledTime: "",
    visitReason: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [selectedDate]);

  // Debounced patient search
  useEffect(() => {
    if (patientSearch.length < 2) {
      setPatientResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/patient?search=${encodeURIComponent(patientSearch)}&limit=20`,
        );
        const data = await res.json();
        setPatientResults(data.patients || []);
      } catch (err) {
        console.error("Error searching patients:", err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [patientSearch]);

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

    if (!selectedPatient) {
      setError("Please select a patient");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          doctorId: formData.doctorId,
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          visitReason: formData.visitReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowForm(false);
        setSelectedPatient(null);
        setPatientSearch("");
        setFormData({
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

  const handleCheckIn = async (appointmentId, patientId, doctorId, visitReason) => {
    // Redirect to AddQue page - queue entry will be created when vitals are submitted
    const params = new URLSearchParams({
      appointmentId: appointmentId || "",
      doctorId: doctorId || "",
      visitReason: visitReason || "",
    });
    router.push(`/addQue/${patientId}?${params.toString()}`);
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setPatientResults([]);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setPatientSearch("");
    setPatientResults([]);
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
                {/* Patient Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Patient
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => {
                        setPatientSearch(e.target.value);
                        setSelectedPatient(null);
                      }}
                      placeholder="Search patient by name..."
                      className="w-full border rounded px-3 py-2"
                    />
                    {searching && (
                      <span className="absolute right-3 top-2 text-gray-400 text-sm">
                        Searching...
                      </span>
                    )}
                    {patientResults.length > 0 && !selectedPatient && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {patientResults.map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => selectPatient(p)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b last:border-b-0"
                          >
                            <span className="font-medium">{p.name}</span>
                            {p.contact?.phone && (
                              <span className="text-gray-500 text-sm ml-2">
                                {p.contact.phone}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedPatient && (
                      <div className="mt-1 flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                        <span className="text-green-800 font-medium">
                          {selectedPatient.name}
                        </span>
                        <button
                          type="button"
                          onClick={clearPatient}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
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
                    {!availableSlots.length && "(select doctor & date first)"}
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

                <div>
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
                        {apt.patientId?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        {apt.doctorId?.name
                          ? `Dr. ${apt.doctorId.name}`
                          : "Unassigned"}
                      </td>
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
                        <div className="flex gap-2">
                          {apt.status === "SCHEDULED" && (
                            <>
                              <button
                                onClick={() => handleCheckIn(apt._id, apt.patientId._id, apt.doctorId?._id, apt.visitReason)}
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
                            </>
                          )}
                          {apt.status === "DONE" && apt.queueEntryId && (
                            <a
                              href={`/queue/${apt.queueEntryId}`}
                              className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Check Vitals
                            </a>
                          )}
                        </div>
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
