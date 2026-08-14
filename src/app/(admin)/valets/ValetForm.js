"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";

const initialState = { error: null };

export default function ValetForm({ valet, action, submitLabel = "Enregistrer", readOnly = false }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            name="prenom"
            required
            disabled={readOnly}
            defaultValue={valet?.prenom}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            name="nom"
            required
            disabled={readOnly}
            defaultValue={valet?.nom}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            name="telephone"
            required
            disabled={readOnly}
            defaultValue={valet?.telephone}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            disabled={readOnly}
            defaultValue={valet?.email}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
        <input
          name="date_naissance"
          type="date"
          required
          disabled={readOnly}
          defaultValue={valet?.date_naissance ? valet.date_naissance.slice(0, 10) : ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
          <input
            name="siret"
            disabled={readOnly}
            defaultValue={valet?.siret}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            name="adresse"
            disabled={readOnly}
            defaultValue={valet?.adresse}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Code PIN (espace voiturier)</label>
        <input
          name="pin"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="4 chiffres"
          disabled={readOnly}
          defaultValue={valet?.pin || ""}
          className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-gray-50 disabled:text-gray-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Code à 4 chiffres pour se connecter à l'espace voiturier (svaletadmin.com/voiturier/login). Laissez vide
          pour désactiver l'accès.
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      {!readOnly && (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Enregistrement..." : submitLabel}
        </Button>
      )}
    </form>
  );
}
