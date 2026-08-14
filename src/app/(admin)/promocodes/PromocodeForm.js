"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";

const initialState = { error: null };

export default function PromocodeForm({ promocode, action, submitLabel = "Enregistrer" }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            name="code"
            required
            defaultValue={promocode?.code}
            placeholder="Ex: SVALET10"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            name="nom"
            required
            defaultValue={promocode?.nom}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={promocode?.description}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de réduction</label>
          <select
            name="type_reduction"
            defaultValue={promocode?.type_reduction || "pourcentage"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="pourcentage">Pourcentage (%)</option>
            <option value="montant">Montant fixe (€)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
          <input
            name="valeur_reduction"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={promocode?.valeur_reduction}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant minimum (€)</label>
          <input
            name="montant_minimum"
            type="number"
            step="0.01"
            min="0"
            defaultValue={promocode?.montant_minimum || 0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
          <input
            name="date_debut"
            type="date"
            required
            defaultValue={promocode?.date_debut ? promocode.date_debut.slice(0, 10) : ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
          <input
            name="date_fin"
            type="date"
            required
            defaultValue={promocode?.date_fin ? promocode.date_fin.slice(0, 10) : ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Utilisations maximum (total)</label>
          <input
            name="utilisations_max"
            type="number"
            min="0"
            placeholder="Illimité"
            defaultValue={promocode?.utilisations_max ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
          <input
            type="checkbox"
            name="utilisation_unique"
            value="true"
            defaultChecked={promocode?.utilisation_unique}
            className="rounded border-gray-300 text-brand focus:ring-brand"
          />
          Une seule utilisation par client
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Réservé à un client précis (email)</label>
        <input
          name="client_specifique_email"
          type="email"
          placeholder="Laisser vide pour un code utilisable par tous"
          defaultValue={promocode?.client_specifique?.email || ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {promocode?.client_specifique && (
          <p className="text-xs text-gray-400 mt-1">
            Actuellement réservé à {promocode.client_specifique.firstname} {promocode.client_specifique.lastname}
          </p>
        )}
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
