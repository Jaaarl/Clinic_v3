"use client";

import { useState, useEffect } from "react";

export default function QueueDisplayPage() {
  const [displayData, setDisplayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisplay();
    const interval = setInterval(fetchDisplay, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchDisplay = async () => {
    try {
      const res = await fetch("/api/queue/display");
      const data = await res.json();
      if (data.displayData) {
        setDisplayData(data.displayData);
      }
    } catch (err) {
      console.error("Error fetching display:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-4xl">
        Loading...
      </div>
    );
  }

  const { current, upNext, scheduledCount, walkInCount } = displayData || {};

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2">CLINIC QUEUE</h1>
          <p className="text-2xl text-slate-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Current Patient */}
        <div className="bg-green-700 rounded-2xl p-8 mb-8 text-center">
          <p className="text-xl mb-2 text-green-200">NOW SERVING</p>
          {current ? (
            <>
              <p className="text-8xl font-bold mb-4">
                {current.patientId?.name || "—"}
              </p>
              <p className="text-3xl text-green-200">
                {current.visitReason}
                {current.scheduledTime && ` • ${current.scheduledTime}`}
              </p>
              <p className="text-xl text-green-300 mt-2">
                Dr. {current.doctorId?.name}
              </p>
            </>
          ) : (
            <p className="text-6xl text-green-300">NO PATIENT</p>
          )}
        </div>

        {/* Up Next */}
        <div className="bg-slate-700 rounded-2xl p-6 mb-8 text-center">
          <p className="text-lg mb-2 text-slate-400">UP NEXT</p>
          {upNext ? (
            <>
              <p className="text-5xl font-bold mb-2">
                {upNext.patientId?.name || "—"}
              </p>
              <p className="text-xl text-slate-300">
                {upNext.visitReason}
                {upNext.scheduledTime && ` • ${upNext.scheduledTime}`}
              </p>
            </>
          ) : (
            <p className="text-4xl text-slate-400">NO WAITING PATIENTS</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-5xl font-bold mb-2">{scheduledCount || 0}</p>
            <p className="text-xl text-slate-400">Scheduled Appointments</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-5xl font-bold mb-2">{walkInCount || 0}</p>
            <p className="text-xl text-slate-400">Walk-ins</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>Queue automatically refreshes every 10 seconds</p>
        </div>
      </div>
    </div>
  );
}
