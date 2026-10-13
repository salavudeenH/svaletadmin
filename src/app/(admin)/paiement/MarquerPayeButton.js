"use client";

import { useTransition } from "react";
import { marquerPayesAction } from "./actions";

export default function MarquerPayeButton({ ids, fraisIds = [], confirmMessage, label = "Marquer payé", className = "" }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage || `Marquer ${ids.length} créneau(x) et ${fraisIds.length} frais comme payés ? Une facture sera générée.`)) {
          startTransition(() => marquerPayesAction(ids, fraisIds));
        }
      }}
      className={`bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-60 ${className}`}
    >
      {pending ? "..." : label}
    </button>
  );
}
