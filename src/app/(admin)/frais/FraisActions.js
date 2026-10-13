"use client";

import { useTransition } from "react";
import { traiterFraisAction } from "./actions";

export default function FraisActions({ id, statut, facture }) {
  const [pending, startTransition] = useTransition();
  if (facture) return <span className="text-xs text-gray-400">Facturé</span>;

  const run = (nouveau, motif) => startTransition(() => traiterFraisAction(id, nouveau, motif));

  return (
    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
      {statut !== "accepte" && (
        <button disabled={pending} onClick={() => run("accepte")} className="text-sm font-medium text-emerald-700 hover:underline disabled:opacity-60">
          Accepter
        </button>
      )}
      {statut !== "refuse" && (
        <button
          disabled={pending}
          onClick={() => {
            const motif = prompt("Motif du refus (facultatif) :");
            if (motif !== null) run("refuse", motif);
          }}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60"
        >
          Refuser
        </button>
      )}
      {statut !== "en_attente" && (
        <button disabled={pending} onClick={() => run("en_attente")} className="text-xs text-gray-400 hover:underline disabled:opacity-60">
          Remettre en attente
        </button>
      )}
    </div>
  );
}
