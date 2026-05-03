/**
 * Icon button component
 */

import type { ReactNode } from "react";

interface IconButtonProps {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary";
}

export function IconButton({
  label,
  children,
  onClick,
  disabled = false,
  variant = "default",
}: IconButtonProps) {
  const baseClasses = "flex h-10 w-10 items-center justify-center rounded-full border transition";
  const variantClasses =
    variant === "primary"
      ? "border-[var(--border-color)] bg-[var(--accent)] text-[var(--accent-contrast)]"
      : "border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-[var(--surface-3)]"
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
