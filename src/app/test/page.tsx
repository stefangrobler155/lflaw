"use client";

import { useState } from "react";
import { sendDownloadLog } from "@/lib/queries";

export default function TestPage() {
  const [status, setStatus] = useState<string | null>(null);

  const handleTest = async () => {
    setStatus("Sending...");
    try {
      const res = await sendDownloadLog("test@example.com", "test-contract");
      setStatus(res?.success ? "✅ Success!" : "❌ Already downloaded");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting download");
    }
  };

  return (
    <main className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold mb-6">Test WordPress API</h1>
      <button
        onClick={handleTest}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Send Test Request
      </button>
      {status && <p className="mt-4 text-lg">{status}</p>}
    </main>
  );
}
