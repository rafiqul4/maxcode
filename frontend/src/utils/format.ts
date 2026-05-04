/**
 * Formatting utilities
 */

export function formatSurahNumber(id: number): string {
  return id.toString().padStart(2, "0");
}

export function formatRevelationLabel(type: "meccan" | "medinan"): string {
  return type === "meccan" ? "Makkah" : "Madinah";
}

export function truncateText(text: string, maxLength: number = 100): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), delay);
  };
}
