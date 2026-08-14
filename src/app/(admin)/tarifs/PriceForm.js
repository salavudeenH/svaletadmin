"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";

const initialState = { error: null };
const DEFAULT_JOURS = [50, 72, 78, 84, 89, 95, 98, 100, 108, 110, 115, 120, 125, 135, 140, 150, 155, 158, 170, 176, 190, 199, 206, 210, 215, 220, 222, 225, 230, 235];

export default function PriceForm({ price, action, submitLabel = "Enregistrer" }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const jours = price?.tarifParJours?.length === 30 ? price.tarifParJours : DEFAULT_JOURS;

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Informations générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              name="nom"
              required
              defaultValue={price?.nom}
              placeholder="Ex: Tarif Standard CDG"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aéroport</label>
            <input
              name="aeroport"
              defaultValue={price?.aeroport || "CDG"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
            <input
              name="ordre"
              type="number"
              defaultValue={price?.ordre || 0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Grille tarifaire par nombre de jours (€, prix total)</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {jours.map((prix, i) => (
            <div key={i}>
              <label className="block text-xs text-gray-500 mb-1">{i + 1} jour{i > 0 ? "s" : ""}</label>
              <input
                name={`jour_${i + 1}`}
                type="number"
                step="0.01"
                defaultValue={prix}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix par jour au-delà de 30 jours (€)</label>
          <input
            name="prixPlusde30Jours"
            type="number"
            step="0.01"
            defaultValue={price?.prixPlusde30Jours ?? 6.6}
            className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Supplément horaire (nuit)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplément (€)</label>
            <input
              name="supplementHoraire"
              type="number"
              step="0.01"
              defaultValue={price?.supplementHoraire ?? 10}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avant (heure)</label>
            <input
              name="heureDebut"
              type="number"
              min="0"
              max="23"
              defaultValue={price?.heureDebut ?? 6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Après (heure)</label>
            <input
              name="heureFin"
              type="number"
              min="0"
              max="23"
              defaultValue={price?.heureFin ?? 23}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Après (minutes)</label>
            <input
              name="minuteFin"
              type="number"
              min="0"
              max="59"
              defaultValue={price?.minuteFin ?? 30}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
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
