"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  className?: string;
  variant?: "primary" | "danger";
}

export default function SubmitButton({
  label,
  pendingLabel,
  className = "",
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const colorClasses =
    variant === "danger"
      ? "bg-red-700 text-white hover:bg-red-800"
      : "button-primary";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`button ${colorClasses} ${className}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
