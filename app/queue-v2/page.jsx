"use client";

import { useState, useEffect } from "react";

export default function QueuePage() {
  const [scheduled, setScheduled] = useState([]);
  const [walkIns, setWalkIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchQueue();
    fetchDoctors();
  }, [selectedDoctor]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const url = selectedDoctor
        ? `/api/queue?doctorId=${selectedDoctor}`
        : "/api/queue";
      const res = await fetch(url);
      const data = await res.json();

      if (data.queue) {
        setScheduled(data.queue.scheduled || []);
        setWalkIns(data.queue.walkIns || []);
      } else {
        setError("Failed to fetch queue");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
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

  const handleCallNext = async (doctorId) => {
    try {
      setActionInProgress("call");
      const res = await fetch(`/api/queue/${doctorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "call", doctorId }),
      });
      const data = await res.json();

      if (res.ok) {
        fetchQueue();
      } else {
        setError(data.error || "Failed to call next patient");
      }
    } catch (err) {
      setError("Error calling patient");
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleComplete = async (queueEntryId) => {
    try {
      setActionInProgress(queueEntryId);
      const res = await fetch(`/api/queue/${queueEntryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });

      if (res.ok) {
        fetchQueue();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to complete");
      }
    } catch (err) {
      setError("Error completing patient");
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleNoShow = async (queueEntryId) => {
    try {
      setActionInProgress(queueEntryId);
      const res = await fetch(`/api/queue/${queueEntryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "no-show" }),
      });

      if (res.ok) {
        fetchQueue();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to mark no-show");
      }
    } catch (err) {
      setError("Error marking no-show");
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      WAITING: "bg-yellow-100 text-yellow-800",
      WITH_DOCTOR: "bg-green-100 text-green-800",
      DONE: "bg-gray-100 text-gray-800",
      NO_SHOW: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  const renderQueueList = (entries, title, type) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
        {title}
        <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded">
          {entries.length} patients
        </span>
      </h2>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No patients in queue</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className={`border rounded-lg p-4 ${
                entry.status === "WITH_DOCTOR" ? "border-green-500 bg-green-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    {entry.patientId?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {entry.visitReason} {entry.scheduledTime && `• ${entry.scheduledTime}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Doctor: {entry.doctorId?.name ? `Dr. ${entry.doctorId.name}` : "Unassigned"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(entry.status)}
                  <div className="flex gap-2">
                    {/* Vital Signs Button - always visible */}
                    <a
                      href={`/addQue/${entry.patientId?._id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Add Vitals
                    </a>
                    {entry.status === "WAITING" && (
                      <>
                        <button
                          onClick={() => handleComplete(entry._id)}
                          disabled={actionInProgress === entry._id}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionInProgress === entry._id ? "..." : "Complete"}
                        </button>
                        <button
                          onClick={() => handleNoShow(entry._id)}
                          disabled={actionInProgress === entry._id}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          No Show
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <div className="flex gap-4 items-center">
            <select
              value={selectedDoctor || ""}
              onChange={(e) => setSelectedDoctor(e.target.value || null)}
              className="border rounded px-3 py-2"
            >
              <option value="">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => selectedDoctor && handleCallNext(selectedDoctor)}
              disabled={!selectedDoctor || actionInProgress === "call"}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {actionInProgress === "call" ? "Calling..." : "Call Next Patient"}
            </button>
            <button
              onClick={fetchQueue}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading queue...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {renderQueueList(scheduled, "Scheduled Appointments", "SCHEDULED")}
            {renderQueueList(walkIns, "Walk-ins", "WALK_IN")}
          </div>
        )}
      </div>
    </div>
  );
}
