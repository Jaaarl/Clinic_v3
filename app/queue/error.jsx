"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">Failed to load queue. Please try again.</p>
        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
