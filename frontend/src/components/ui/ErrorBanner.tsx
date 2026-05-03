/**
 * Error message component
 */

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      <div className="flex items-center justify-between">
        <span>⚠️ {message}</span>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-400 hover:text-red-300">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
