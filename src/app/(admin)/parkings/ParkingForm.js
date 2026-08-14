"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";

const initialState = { error: null };

export default function ParkingForm({ parking, action, submitLabel = "Enregistrer" }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          name="nom"
          required
          defaultValue={parking?.nom}
          placeholder="Ex: Parking P1"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input
          name="adresse"
          defaultValue={parking?.adresse}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
        <input
          name="ordre"
          type="number"
          defaultValue={parking?.ordre ?? 0}
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
