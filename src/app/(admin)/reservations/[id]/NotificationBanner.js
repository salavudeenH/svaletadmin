"use client";

import { useTransition } from "react";
import { marquerLueAction } from "../../notifications/actions";

export default function NotificationBanner({ notification }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
      <p className="text-sm text-amber-800">⚠ {notification.message}</p>
      <button
        disabled={pending}
        onClick={() => startTransition(() => marquerLueAction(notification._id))}
        className="text-sm text-amber-700 hover:underline whitespace-nowrap disabled:opacity-60"
      >
        Marquer comme lu
      </button>
    </div>
  );
}
