"use client";

import Navbar from "@/app/components/Navbar";
import { useState, useEffect } from "react";

export default function QueueFilterPage() {
  const [queueData, setQueueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [compiledData, setCompiledData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch queue data
  const fetchQueueData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/queue-numbers");
      if (!response.ok) {
        throw new Error("Failed to fetch queue data");
      }
      const data = await response.json();
      setQueueData(data);
      setFilteredData(data);
      compileByDate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compile data by date
  const compileByDate = (data) => {
    const compiled = data.reduce((acc, item) => {
      const date = new Date(item.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = {
          date: date,
          count: 0,
          items: [],
        };
      }
      acc[date].count += 1;
      acc[date].items.push(item);
      return acc;
    }, {});

    setCompiledData(compiled);
  };

  // Filter data by date range
  const filterByDate = () => {
    if (!startDate && !endDate) {
      setFilteredData(queueData);
      compileByDate(queueData);
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // normalize to cover full days
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const filtered = queueData.filter((item) => {
      const itemDate = new Date(item.createdAt);

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });

    setFilteredData(filtered);
    compileByDate(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(queueData);
    compileByDate(queueData);
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  useEffect(() => {
    filterByDate();
  }, [startDate, endDate, queueData]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Queue Numbers</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Filter by Date Range
          </h2>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 min-w-48">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={filterByDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filter
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={fetchQueueData}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading queue data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800">
                Total Patient
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {filteredData.length}
              </p>
            </div>
            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800">
                Unique Days
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {Object.keys(compiledData).length}
              </p>
            </div> */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800">
                Avg Patient per Day
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {Object.keys(compiledData).length > 0
                  ? Math.round(
                      filteredData.length / Object.keys(compiledData).length
                    )
                  : 0}
              </p>
            </div>
          </div>
        )}
        {/* No Data State */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No queue data found
            </h3>
            <p className="text-gray-500">
              Try adjusting your date filter or check if data exists in the
              database.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
