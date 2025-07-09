"use client";

import { useState } from "react";
import DynamicFormRenderer, { FieldDefinition } from "@/components/forms/DynamicFormRenderer";

export default function CustomizeForm({
  slug,
  fields,
}: {
  slug: string;
  fields: FieldDefinition[];
}) {
  const [submitting, setSubmitting] = useState(false);

  // 🔸 Move this outside handleSubmit
  const logDownload = async (email: string, slug: string) => {
    const res = await fetch("https://lf.sfgweb.co.za/wp-json/lf/v1/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, slug }),
    });

    const data = await res.json();
    return data.status; // "logged" or "already_downloaded"
  };

  const handleSubmit = async (payload: Record<string, string>) => {
    setSubmitting(true);
    try {
      // 🔐 Step 1: Check with WordPress if already downloaded
      const status = await logDownload(payload.email, slug);

      if (status === "already_downloaded") {
        alert("You’ve already downloaded this contract.");
        setSubmitting(false);
        return;
      }

      // ✅ Step 2: Generate PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...payload }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // ✅ Optional Redirect
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

  return <DynamicFormRenderer fields={fields} onSubmit={handleSubmit} submitting={submitting} />;
}
