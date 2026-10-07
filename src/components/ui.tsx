import { Copy, Check } from "lucide-react";
import { useState } from "react";
export function Field({
  label,
  name,
  value,
  onChange,
  options,
  type = "text",
  required = false,
  min,
  max,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b className="required"> *</b>}
      </span>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          maxLength={1200}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
          max={max}
          maxLength={300}
          step={type === "number" ? "0.01" : undefined}
        />
      )}
    </label>
  );
}
export function CopyButton({
  text,
  notify,
}: {
  text: string;
  notify: (message: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("Nie udało się skopiować. Zaznacz tekst i skopiuj go ręcznie.");
    }
  }
  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      aria-label="Kopiuj tekst"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
      {copied ? "Skopiowano" : "Kopiuj"}
    </button>
  );
}
export function Empty({ text }: { text: string }) {
  return <div className="empty">{text}</div>;
}
