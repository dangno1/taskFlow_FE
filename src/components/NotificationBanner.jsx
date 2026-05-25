import React from 'react';

export default function NotificationBanner({ notification, onClose }) {
  if (!notification?.visible || !notification?.message) return null;

  const typeClasses = notification.type === 'error'
    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/85 dark:border-rose-800 dark:text-rose-200'
    : notification.type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/85 dark:border-emerald-800 dark:text-emerald-200'
      : notification.type === 'warning'
        ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/85 dark:border-amber-800 dark:text-amber-200'
        : 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-900/85 dark:border-slate-700 dark:text-slate-100';

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-[100] w-full max-w-2xl -translate-x-1/2 px-4">
      <div className={`pointer-events-auto rounded-3xl border px-5 py-4 text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-150 ${typeClasses}`}>
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 leading-relaxed">{notification.message}</p>

          <div className="flex items-center gap-2">
            {notification.cancelLabel && (
              <button
                type="button"
                onClick={notification.onCancel || onClose}
                className="rounded-xl border border-current/20 px-3 py-1.5 text-xs font-bold transition-all hover:bg-white/40 dark:hover:bg-black/10"
              >
                {notification.cancelLabel}
              </button>
            )}

            {notification.actionLabel && notification.onAction && (
              <button
                type="button"
                onClick={notification.onAction}
                className="rounded-xl bg-white/70 px-3 py-1.5 text-xs font-bold text-inherit transition-all hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
              >
                {notification.actionLabel}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1 text-current/70 transition-all hover:bg-white/40 hover:text-current dark:hover:bg-black/10"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
