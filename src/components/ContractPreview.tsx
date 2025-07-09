type Props = {
  template: string;
  formData: Record<string, string>;
};

export default function ContractPreview({ template, formData }: Props) {
  let filled = template;
  for (const [key, value] of Object.entries(formData)) {
    filled = filled.replaceAll(`{{${key}}}`, value);
  }

  return (
    <div className="border p-4 rounded bg-gray-50 whitespace-pre-wrap font-serif text-sm leading-relaxed mt-8">
      {filled}
    </div>
  );
}
