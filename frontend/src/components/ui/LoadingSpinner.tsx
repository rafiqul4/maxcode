/**
 * Loading spinner component
 */

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--accent)]" />
      <span className="ml-3 text-sm text-[var(--text-muted)]">Loading...</span>
    </div>
  );
}
