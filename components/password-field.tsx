"use client";

import { InputHTMLAttributes, useId, useState } from "react";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]">
        <path
          d="M3.75 12C5.4 8.65 8.4 6.75 12 6.75C15.6 6.75 18.6 8.65 20.25 12C18.6 15.35 15.6 17.25 12 17.25C8.4 17.25 5.4 15.35 3.75 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="2.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]">
      <path
        d="M4.5 4.5L19.5 19.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.88 7.16C10.56 6.9 11.26 6.75 12 6.75C15.6 6.75 18.6 8.65 20.25 12C19.61 13.3 18.72 14.42 17.63 15.31M14.12 16.84C13.44 17.1 12.74 17.25 12 17.25C8.4 17.25 5.4 15.35 3.75 12C4.39 10.7 5.28 9.58 6.37 8.69"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.95 13.95C13.45 14.45 12.76 14.75 12 14.75C10.48 14.75 9.25 13.52 9.25 12C9.25 11.24 9.55 10.55 10.05 10.05"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PasswordField({
  label,
  className = "",
  id,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const [visible, setVisible] = useState(false);
  const inputId = id ?? generatedId;

  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          className={`auth-input-shell pr-12 ${className}`.trim()}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-romano-slate transition duration-300 hover:text-romano-ink focus-visible:outline-none focus-visible:text-romano-mintText"
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </label>
  );
}
