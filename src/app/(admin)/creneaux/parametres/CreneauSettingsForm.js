"use client";

import { useActionState } from "react";
import { updateCreneauSettingsAction } from "../actions";
import Button from "@/components/ui/Button";

const initialState = { error: null, success: false };

export default function CreneauSettingsForm({ settings }) {
  const [state, formAction, pending] = useActionState(updateCreneauSettingsAction, initialState);

  return (
    <form action={formAction} className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif à la course (€)</label>
          <input
            name="tarif_course"
            type="number"
            step="0.01"
            defaultValue={settings.tarif_course}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif à l'heure (€)</label>
          <input
            name="tarif_heure"
            type="number"
            step="0.01"
            defaultValue={settings.tarif_heure}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif nuit 00h-03h (€/course)</label>
          <input
            name="tarif_nuit_profonde"
            type="number"
            step="0.01"
            defaultValue={settings.tarif_nuit_profonde}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif nuit 03h-06h (€/course)</label>
          <input
            name="tarif_nuit_matin"
            type="number"
            step="0.01"
            defaultValue={settings.tarif_nuit_matin}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tolérance "d'affilé" (minutes entre 2 courses)
          </label>
          <input
            name="tolerance_minutes"
            type="number"
            step="1"
            defaultValue={settings.tolerance_minutes}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-xs text-gray-400 mt-1">
            Si l'écart entre la fin d'une course et le début de la suivante est inférieur ou égal à cette valeur,
            elles sont payées à l'heure. Au-delà, chacune est payée à la course.
          </p>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && <p className="text-sm text-emerald-600">Réglages enregistrés.</p>}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
