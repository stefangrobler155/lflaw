"use client"
import { useState, useEffect } from "react";
import { FieldDefinition } from "@/components/forms/DynamicFormRenderer";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";
import ContractPreview from "@/components/ContractPreview";
import { logDownload } from "@/lib/queries";

export default function CustomizeForm({
  slug,
  fields,
  templateUrl,
}: {
  slug: string;
  fields: FieldDefinition[];
  templateUrl: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch template text from WooCommerce download URL
    fetch(templateUrl)
      .then((res) => res.text())
      .then(setTemplate)
      .catch((err) => console.error("Failed to load template:", err));
  }, [templateUrl]);

  const handleSubmit = async (data: Record<string, string>) => {
    setSubmitting(true);

    const status = await logDownload(data.email, slug);
    if (status === "already_downloaded") {
      alert("You’ve already downloaded this contract.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, slug, templateUrl }),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.pdf`;
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
    <div>
      <DynamicFormRenderer
        fields={fields}
        onSubmit={(data) => {
          setFormData(data); // Track for preview
          return handleSubmit(data);
        }}
        submitting={submitting}
      />

      {template && Object.keys(formData).length > 0 && (
        <div>
          <h2 className="mt-10 text-lg font-semibold">Preview</h2>
          <ContractPreview template={template} formData={formData} />
        </div>
      )}
    </div>
  );
}
