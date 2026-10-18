"use client";

import { useState } from "react";
import { fmtPrice, fmtDateFR } from "@/lib/creneaux";
import { creerVersementAction, supprimerVersementAction } from "./actions";

const input = "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

export default function VersementBox({ valetId, annee, mois, reste, versements = [] }) {
  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await creerVersementAction({ valet: valetId, annee, mois, montant, date, note });
    if (res?.error) setError(res.error);
    else {
      setOpen(false);
      setMontant("");
      setNote("");
    }
    setLoading(false);
  }

  async function supprimer(id) {
    if (!confirm("Annuler ce versement ?")) return;
    const res = await supprimerVersementAction(id);
    if (res?.error) alert(res.error);
  }

  return (
    <div className="border-t border-gray-100 px-4 sm:px-5 py-3 bg-gray-50/50">
      {versements.length > 0 && (
        <ul className="mb-2 space-y-1">
          {versements.map((v) => (
            <li key={v._id} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {fmtDateFR(v.date)} · Versement{v.note ? ` — ${v.note}` : ""}
              </span>
              <span className="flex items-center gap-3">
                <span className="font-medium text-emerald-700">− {fmtPrice(v.montant)}</span>
                <button onClick={() => supprimer(v._id)} className="text-xs text-red-500 hover:underline">
                  Annuler
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-brand hover:underline">
          + Verser un montant (acompte)
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Montant (€)</label>
            <input type="number" step="0.01" min="0.01" max={reste} required value={montant} onChange={(e) => setMontant(e.target.value)} className={`${input} w-28`} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={input} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Note</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="facultatif" className={`${input} w-40`} />
          </div>
          <button disabled={loading} className="bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg px-3 py-1.5 disabled:opacity-60">
            {loading ? "..." : "Enregistrer"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-500 px-1 py-1.5">
            Annuler
          </button>
          <span className="text-xs text-gray-400 w-full">Reste à payer : {fmtPrice(reste)}</span>
          {error && <span className="text-xs text-red-600 w-full">{error}</span>}
        </form>
      )}
    </div>
  );
}
