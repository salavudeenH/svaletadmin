"use client";

import { useActionState } from "react";

const initialState = { error: null, success: false };

const READONLY_FIELDS = [
  { key: "prenom", label: "Prénom" },
  { key: "nom", label: "Nom" },
  { key: "telephone", label: "Téléphone" },
  { key: "email", label: "Email" },
  { key: "siret", label: "Numéro SIRET" },
];

export default function ParametresForm({ valet, action }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-400 mb-2">
          Ces informations sont gérées par Svalet. Contacte l'agence si une modification est nécessaire.
        </p>
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
          {READONLY_FIELDS.map((f) => (
            <div key={f.key} className="px-4 py-3">
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="text-sm font-medium text-ink mt-0.5">{valet[f.key] || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Identifiant Telegram</label>
          <input
            name="telegram_id"
            defaultValue={valet.telegram_id || ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Adresse</label>
          <input
            name="adresse"
            defaultValue={valet.adresse || ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
        )}
        {state?.success && <p className="text-sm text-emerald-600">Modifications enregistrées.</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand text-white font-semibold rounded-xl py-3 disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
