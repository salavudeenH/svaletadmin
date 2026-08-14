"use client";

import { useTransition } from "react";
import Link from "next/link";
import { marquerLueAction } from "./actions";

function fmtDateHeure(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationRow({ notification }) {
  const [pending, startTransition] = useTransition();
  const n = notification;

  return (
    <div className={`px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 ${n.lue ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-2">
        {!n.lue && <span className="mt-1.5 w-2 h-2 rounded-full bg-brand shrink-0" aria-hidden />}
        <div>
          <div className="text-sm text-gray-800">{n.message}</div>
          <div className="text-xs text-gray-400 mt-1">
            {fmtDateHeure(n.createdAt)}
            {n.valet && ` · ${n.valet.prenom} ${n.valet.nom}`}
            {n.reservation && (
              <>
                {" · "}
                <Link href={`/reservations/${n.reservation._id}`} className="text-brand hover:underline">
                  Voir la réservation
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {!n.lue && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => marquerLueAction(n._id))}
          className="text-sm text-gray-500 hover:text-brand hover:underline whitespace-nowrap disabled:opacity-60"
        >
          Marquer lu
        </button>
      )}
    </div>
  );
}
