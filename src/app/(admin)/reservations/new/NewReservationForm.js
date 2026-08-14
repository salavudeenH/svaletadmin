"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { createReservationAction } from "./actions";

const initialState = { error: null };

export default function NewReservationForm({ parkings = [] }) {
  const [state, formAction, pending] = useActionState(createReservationAction, initialState);

  const [clientQuery, setClientQuery] = useState("");
  const [clientResults, setClientResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searching, setSearching] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const [dateAller, setDateAller] = useState("");
  const [heureAller, setHeureAller] = useState("");
  const [dateRetour, setDateRetour] = useState("");
  const [heureRetour, setHeureRetour] = useState("");
  const [aeroport, setAeroport] = useState("CDG");

  const [montantBase, setMontantBase] = useState("");
  const [surcharges, setSurcharges] = useState("");
  const [montantTotal, setMontantTotal] = useState("");
  const [nombreJours, setNombreJours] = useState("");
  const [priceError, setPriceError] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (clientQuery.trim().length < 3) {
      setClientResults([]);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/lookup-client?query=${encodeURIComponent(clientQuery)}`);
        const json = await res.json();
        setClientResults(json.success ? json.data : []);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [clientQuery]);

  function selectClient(user) {
    setSelectedClient(user);
    setPrenom(user.firstname || "");
    setNom(user.lastname || "");
    setEmail(user.email || "");
    setTelephone(user.phone || "");
    setClientResults([]);
    setClientQuery("");
  }

  async function calculerPrix() {
    setPriceError(null);
    if (!dateAller || !heureAller || !dateRetour || !heureRetour) {
      setPriceError("Renseigne les dates et heures aller/retour avant de calculer le prix.");
      return;
    }
    setCalculating(true);
    try {
      const res = await fetch("/api/prices/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateDepart: dateAller,
          heureDepart: heureAller,
          dateArrivee: dateRetour,
          heureArrivee: heureRetour,
          aeroport,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur de calcul du prix");
      setMontantBase(json.prixBase);
      setSurcharges(json.supplementsHoraires);
      setMontantTotal(json.prixTotal);
      setNombreJours(json.nombreJours);
    } catch (err) {
      setPriceError(err.message);
    } finally {
      setCalculating(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <input type="hidden" name="client_id" value={selectedClient?._id || ""} />

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Client</h2>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher un client existant (email ou téléphone)
          </label>
          <input
            value={clientQuery}
            onChange={(e) => {
              setClientQuery(e.target.value);
              setSelectedClient(null);
            }}
            placeholder="Ex: 06... ou nom@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {searching && <p className="text-xs text-gray-400 mt-1">Recherche...</p>}
          {clientResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {clientResults.map((u) => (
                <button
                  type="button"
                  key={u._id}
                  onClick={() => selectClient(u)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium">
                    {u.firstname} {u.lastname}
                  </span>
                  <span className="text-gray-400 ml-2">{u.email} · {u.phone}</span>
                </button>
              ))}
            </div>
          )}
          {selectedClient && (
            <p className="text-xs text-emerald-600 mt-1">
              Client existant sélectionné — les champs ci-dessous ont été pré-remplis.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              name="contact_prenom"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              name="contact_nom"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="contact_email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              name="contact_telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Dates & vol</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date aller *</label>
            <input
              name="date_aller"
              type="date"
              required
              value={dateAller}
              onChange={(e) => setDateAller(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure aller *</label>
            <input
              name="heure_aller"
              type="time"
              required
              value={heureAller}
              onChange={(e) => setHeureAller(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date retour *</label>
            <input
              name="date_retour"
              type="date"
              required
              value={dateRetour}
              onChange={(e) => setDateRetour(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure retour *</label>
            <input
              name="heure_retour"
              type="time"
              required
              value={heureRetour}
              onChange={(e) => setHeureRetour(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partenaire</label>
            <input
              name="partenaire"
              defaultValue="SVALET"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
            <select
              name="parking"
              defaultValue="decouvert"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="decouvert">Découvert</option>
              <option value="couvert">Couvert</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parking (voiture garée)</label>
            <select
              name="parking_nom"
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Non renseigné</option>
              {parkings.map((p) => (
                <option key={p._id} value={p.nom}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° vol aller</label>
            <input
              name="numero_vol"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
            <input
              name="vol_provenance"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terminal départ</label>
            <input
              name="terminal_depart"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° vol retour</label>
            <input
              name="numero_vol_retour"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terminal retour</label>
            <input
              name="terminal_retour"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="garde_cle" value="true" defaultChecked className="rounded border-gray-300 text-brand focus:ring-brand" />
          Le voiturier garde la clé
        </label>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Prix</h2>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aéroport (pour le calcul)</label>
            <select
              value={aeroport}
              onChange={(e) => setAeroport(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="CDG">CDG</option>
              <option value="ORY">ORY</option>
            </select>
          </div>
          <Button type="button" variant="secondary" onClick={calculerPrix} disabled={calculating}>
            {calculating ? "Calcul..." : "Calculer le prix"}
          </Button>
          {nombreJours && <span className="text-sm text-gray-500">{nombreJours} jour(s)</span>}
        </div>

        {priceError && <p className="text-sm text-red-600">{priceError}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (€)</label>
            <input
              name="montant_base"
              type="number"
              step="0.01"
              value={montantBase}
              onChange={(e) => setMontantBase(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suppléments horaires (€)</label>
            <input
              name="surcharges"
              type="number"
              step="0.01"
              value={surcharges}
              onChange={(e) => setSurcharges(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant total (€) *</label>
            <input
              name="montant_total"
              type="number"
              step="0.01"
              required
              value={montantTotal}
              onChange={(e) => setMontantTotal(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        <input type="hidden" name="nombre_de_jours" value={nombreJours} />
        <p className="text-xs text-gray-400">
          Le montant total reste modifiable manuellement, y compris après calcul automatique.
        </p>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note interne</label>
        <textarea
          name="note_interne"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Création..." : "Créer la réservation"}
      </Button>
    </form>
  );
}
