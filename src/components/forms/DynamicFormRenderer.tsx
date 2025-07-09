"use client";

import { useState } from "react";

export type FieldDefinition = {
  label: string;
  name: string;
  type: "text" | "email" | "textarea" | "date";
  required?: boolean;
};

type Props = {
  fields: FieldDefinition[];
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  submitting?: boolean;
};

export default function DynamicFormRenderer({ fields, onSubmit, submitting }: Props) {
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error("Form submission error", err);
    } finally {
      setLocalSubmitting(false);
    }
  };

  const isSubmitting = submitting ?? localSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block mb-1 font-medium">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              className="w-full border p-2 rounded"
            />
          ) : (
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              required={field.required}
              className="w-full border p-2 rounded"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-black text-white py-2 rounded ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
        } transition`}
      >
        {isSubmitting ? "Submitting..." : "Submit & Download"}
      </button>
    </form>
  );
}
