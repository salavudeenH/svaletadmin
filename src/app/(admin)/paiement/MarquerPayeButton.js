"use client";

import { useTransition } from "react";
import { marquerPayesAction } from "./actions";

export default function MarquerPayeButton({ ids, valetNom }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm(`Marquer ${ids.length} créneau(x) de ${valetNom} comme payés ?`)) {
          startTransition(() => marquerPayesAction(ids));
        }
      }}
      className="bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
    >
      {pending ? "..." : "Marquer payé"}
    </button>
  );
}
