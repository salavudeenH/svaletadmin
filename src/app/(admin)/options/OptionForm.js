"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";

const initialState = { error: null };

export default function OptionForm({ option, action, submitLabel = "Enregistrer" }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            name="code"
            required
            defaultValue={option?.code}
            placeholder="Ex: lavage-exterieur"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm lowercase focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            name="nom"
            required
            defaultValue={option?.nom}
            placeholder="Ex: Lavage extérieur"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="texte"
          rows={3}
          defaultValue={option?.texte}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€ TTC)</label>
          <input
            name="prix"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={option?.prix}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
          <input
            name="ordre"
            type="number"
            defaultValue={option?.ordre ?? 0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
        <input
          name="image"
          defaultValue={option?.image}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
