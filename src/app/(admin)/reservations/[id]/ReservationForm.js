"use client";

import { useActionState } from "react";
import { STATUT_LABELS } from "@/lib/statuts";
import Button from "@/components/ui/Button";

const initialState = { error: null, success: false };

export default function ReservationForm({ reservation, valets, parkings, action }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Contact client</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              name="contact_prenom"
              defaultValue={reservation.contact_prenom || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              name="contact_nom"
              defaultValue={reservation.contact_nom || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              name="contact_telephone"
              defaultValue={reservation.contact_telephone || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="contact_email"
              type="email"
              defaultValue={reservation.contact_email || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Dates, vol & parking</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date aller</label>
            <input
              name="date_aller"
              type="date"
              defaultValue={reservation.date_aller ? reservation.date_aller.slice(0, 10) : ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure aller</label>
            <input
              name="heure_aller"
              type="time"
              defaultValue={reservation.heure_aller || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date retour</label>
            <input
              name="date_retour"
              type="date"
              defaultValue={reservation.date_retour ? reservation.date_retour.slice(0, 10) : ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure retour</label>
            <input
              name="heure_retour"
              type="time"
              defaultValue={reservation.heure_retour || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° vol aller</label>
            <input
              name="numero_vol"
              defaultValue={reservation.numero_vol || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
            <input
              name="vol_provenance"
              defaultValue={reservation.vol_provenance || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terminal départ</label>
            <input
              name="terminal_depart"
              defaultValue={reservation.terminal_depart || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° vol retour</label>
            <input
              name="numero_vol_retour"
              defaultValue={reservation.numero_vol_retour || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terminal retour</label>
            <input
              name="terminal_retour"
              defaultValue={reservation.terminal_retour || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parking (voiture garée)</label>
            <select
              name="parking_nom"
              defaultValue={reservation.parking_nom || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Non renseigné</option>
              {parkings.map((p) => (
                <option key={p._id} value={p.nom}>
                  {p.nom}
                </option>
              ))}
              {reservation.parking_nom && !parkings.some((p) => p.nom === reservation.parking_nom) && (
                <option value={reservation.parking_nom}>{reservation.parking_nom} (inactif)</option>
              )}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="garde_cle"
            value="true"
            defaultChecked={reservation.garde_cle}
            className="rounded border-gray-300 text-brand focus:ring-brand"
          />
          Le voiturier garde la clé
        </label>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Infos voiturier</h2>
        <p className="text-xs text-gray-400 -mt-2">
          Normalement remplies par le voiturier depuis son questionnaire mobile — à corriger ici en cas d'oubli ou d'erreur.
        </p>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Prise en charge</h3>
          <div className="flex flex-wrap gap-4 mb-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="sky_priority"
                value="true"
                defaultChecked={Boolean(reservation.sky_priority)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              Sky Priority
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="bagages_soute"
                value="true"
                defaultChecked={Boolean(reservation.bagages_soute)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              Bagages en soute au retour
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="retour_confirme_par_client"
                value="true"
                defaultChecked={Boolean(reservation.retour_confirme_par_client)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              Revient à la date prévue
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle date annoncée</label>
              <input
                name="date_retour_annoncee"
                type="date"
                defaultValue={reservation.date_retour_annoncee ? reservation.date_retour_annoncee.slice(0, 10) : ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville de départ (vol retour)</label>
              <input
                name="vol_retour_ville_depart"
                defaultValue={reservation.vol_retour_ville_depart || ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compagnie aérienne</label>
              <input
                name="vol_retour_compagnie"
                defaultValue={reservation.vol_retour_compagnie || ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage au dépôt</label>
            <input
              name="kilometrage_depot"
              type="number"
              defaultValue={reservation.kilometrage_depot ?? ""}
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Restitution</h3>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage au retour</label>
            <input
              name="kilometrage_retour"
              type="number"
              defaultValue={reservation.kilometrage_retour ?? ""}
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <input
              type="checkbox"
              name="incident_signale"
              value="true"
              defaultChecked={Boolean(reservation.incident_signale)}
              className="rounded border-gray-300 text-brand focus:ring-brand"
            />
            Incident signalé
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description de l'incident</label>
            <textarea
              name="incident_description"
              defaultValue={reservation.incident_description || ""}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Assignation & statut</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voiturier aller</label>
          <select
            name="valet_aller"
            defaultValue={reservation.valet_aller?._id || ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Non assigné</option>
            {valets.map((v) => (
              <option key={v._id} value={v._id}>
                {v.prenom} {v.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voiturier retour</label>
          <select
            name="valet_retour"
            defaultValue={reservation.valet_retour?._id || ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Non assigné</option>
            {valets.map((v) => (
              <option key={v._id} value={v._id}>
                {v.prenom} {v.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de clé</label>
        <input
          name="numero_cle"
          defaultValue={reservation.numero_cle || ""}
          placeholder="Ex: 12"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-gray-400 mt-1">
          Numéro du porte-clé physique — bloqué si déjà utilisé par une autre voiture encore sur le parking.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
        <select
          name="statut"
          defaultValue={reservation.statut}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {Object.entries(STATUT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note interne</label>
        <textarea
          name="note_interne"
          defaultValue={reservation.note_interne || ""}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Modifications enregistrées.
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
