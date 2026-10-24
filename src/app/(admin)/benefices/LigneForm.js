"use client";

import { useActionState, useEffect, useRef } from "react";
import { ajouterLigneAction } from "./actions";

const input = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

export default function LigneForm({ type, annee, mois, placeholder, bouton }) {
  const [state, action, pending] = useActionState(ajouterLigneAction, null);
  const formRef = useRef(null);

  // Vide le formulaire après un ajout réussi
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="px-4 py-3 border-t border-gray-100 bg-gray-50">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="annee" value={annee} />
      <input type="hidden" name="mois" value={mois} />
      <div className="flex flex-col sm:flex-row gap-2">
        <input name="libelle" required maxLength={200} placeholder={placeholder} className={`${input} sm:flex-1`} />
        <input name="montant" required inputMode="decimal" placeholder="Montant (€)" className={`${input} sm:w-36`} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap"
        >
          {pending ? "Ajout…" : bouton}
        </button>
      </div>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
