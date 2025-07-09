"use client";

import { useState } from "react";

export default function CustomizeForm({
  nameFromQuery,
  emailFromQuery,
}: {
  nameFromQuery: string;
  emailFromQuery: string;
}) {
  const [fullName, setFullName] = useState(nameFromQuery);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState(emailFromQuery);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, companyName, email, notes }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "contract.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.location.href = "/success";
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to generate the contract.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border p-2 rounded"
        required
        disabled={submitting}
      />
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full border p-2 rounded"
        required
        disabled={submitting}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
        disabled={submitting}
      />
      <textarea
        placeholder="Additional Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border p-2 rounded h-32"
        disabled={submitting}
      />

      <button
        type="submit"
        disabled={submitting}
        className={`w-full flex justify-center items-center gap-2 bg-black text-white px-6 py-2 rounded transition ${
          submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
        }`}
      >
        {submitting && (
          <span className="animate-spin rounded-full border-2 border-white border-t-transparent h-4 w-4"></span>
        )}
        {submitting ? "Generating..." : "Submit & Generate PDF"}
      </button>
    </form>
  );
}
