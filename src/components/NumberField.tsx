import { useEffect, useId, useState } from "react";

type Props = {
  label: string;
  value: number | null;
  placeholder?: string;
  parse: (text: string) => number | null;
  onCommit: (value: number | null) => void;
  compact?: boolean;
};

/** Keeps the typed text locally and only commits values that pass `parse`, so bad input never reaches state. */
export default function NumberField({ label, value, placeholder, parse, onCommit, compact }: Props) {
  const id = useId();
  const [text, setText] = useState(value === null ? "" : String(value));

  useEffect(() => {
    setText((current) => (parse(current) === value ? current : value === null ? "" : String(value)));
  }, [value, parse]);

  const invalid = text.trim() !== "" && parse(text) === null;

  return (
    <div className={compact ? "field compact" : "field"}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        maxLength={6}
        value={text}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          if (next.trim() === "") {
            onCommit(null);
          } else {
            const parsed = parse(next);
            if (parsed !== null) {
              onCommit(parsed);
            }
          }
        }}
      />
    </div>
  );
}
