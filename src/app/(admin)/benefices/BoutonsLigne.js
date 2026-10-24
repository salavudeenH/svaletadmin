"use client";

import { useTransition } from "react";
import { supprimerLigneAction, exclureValetAction } from "./actions";

export function SupprimerLigneButton({ id, libelle }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Supprimer « ${libelle} » ?`)) startTransition(() => supprimerLigneAction(id));
      }}
      className="text-xs text-red-600 hover:underline disabled:opacity-60"
    >
      Supprimer
    </button>
  );
}

// Bouton "ne pas compter" : retire (ou remet) le voiturier du calcul des coûts.
export function ExclureValetButton({ id, exclu }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => exclureValetAction(id, !exclu))}
      className={`text-xs font-medium rounded-full px-3 py-1 border transition-colors disabled:opacity-60 whitespace-nowrap ${
        exclu
          ? "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
          : "bg-white text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
      }`}
    >
      {exclu ? "Compter à nouveau" : "Ne pas compter"}
    </button>
  );
}
