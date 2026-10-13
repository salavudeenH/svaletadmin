"use client";

import { useState } from "react";
import { addOptionAction, sendSupplementLinkAction } from "./payment-actions";

const input =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand";
const btn =
  "bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-60";

function LinkResult({ url }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 space-y-2">
      <p className="text-sm text-emerald-700">Lien généré et email envoyé au client.</p>
      <div className="flex items-center gap-2">
        <input readOnly value={url} className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5 font-mono" />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-xs font-medium border border-gray-300 rounded px-2 py-1.5 hover:bg-gray-50"
        >
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
    </div>
  );
}

function fmtEur(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);
}

export default function ComplementsCard({ reservationId, options, defaultEmail, supplements = [] }) {
  // --- ajout d'une option ---
  const [optionId, setOptionId] = useState("");
  const [qty, setQty] = useState(1);
  const [avecLien, setAvecLien] = useState(true);
  const [emailOption, setEmailOption] = useState(defaultEmail);
  const [messageOption, setMessageOption] = useState("");
  const [loadingOption, setLoadingOption] = useState(false);
  const [resOption, setResOption] = useState(null);
  const [errOption, setErrOption] = useState(null);

  // --- décalage / montant libre ---
  const [montant, setMontant] = useState("");
  const [libelle, setLibelle] = useState("Décalage de la date de retour");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);

  const optionChoisie = options.find((o) => o._id === optionId);

  async function ajouterOption() {
    setLoadingOption(true);
    setErrOption(null);
    setResOption(null);
    const r = await addOptionAction(reservationId, {
      option_id: optionId,
      qty,
      envoyer_lien: avecLien,
      email: emailOption.trim(),
      message: messageOption,
    });
    if (r.error) setErrOption(r.error);
    else setResOption(r);
    setLoadingOption(false);
  }

  async function envoyerLien() {
    setLoading(true);
    setErr(null);
    setRes(null);
    const r = await sendSupplementLinkAction(reservationId, { montant, libelle, message, email: email.trim() });
    if (r.error) setErr(r.error);
    else setRes(r);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-6">
      <h2 className="font-semibold">Compléments de paiement</h2>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Ajouter une option</h3>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_6rem] gap-3">
          <select value={optionId} onChange={(e) => setOptionId(e.target.value)} className={input}>
            <option value="">Choisir une option…</option>
            {options.map((o) => (
              <option key={o._id} value={o._id}>
                {o.nom} — {fmtEur(o.prix)}
              </option>
            ))}
          </select>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={input} aria-label="Quantité" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={avecLien} onChange={(e) => setAvecLien(e.target.checked)} className="rounded border-gray-300 text-brand focus:ring-brand" />
          Envoyer un lien de paiement au client (sinon l'option est ajoutée directement, sans paiement)
        </label>
        {avecLien && (
          <>
            <input type="email" value={emailOption} onChange={(e) => setEmailOption(e.target.value)} placeholder="Email du client" className={input} />
            <textarea value={messageOption} onChange={(e) => setMessageOption(e.target.value)} rows={2} placeholder="Message (facultatif)" className={input} />
          </>
        )}
        <button type="button" onClick={ajouterOption} disabled={!optionId || loadingOption} className={btn}>
          {loadingOption
            ? "En cours..."
            : avecLien
            ? `Envoyer le lien${optionChoisie ? ` (${fmtEur(optionChoisie.prix * (Number(qty) || 1))})` : ""}`
            : "Ajouter l'option"}
        </button>
        {errOption && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errOption}</p>}
        {resOption?.url && <LinkResult url={resOption.url} />}
        {resOption?.ajoutee && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">Option ajoutée à la réservation.</p>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700">Lien de paiement pour un décalage / montant libre</h3>
        <p className="text-xs text-gray-500">
          Pensez à modifier la date dans « Informations » si besoin. Une fois payé, le montant s'ajoute au total de la réservation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-3">
          <input value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Objet" className={input} />
          <input type="number" step="0.01" min="0" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant TTC (€)" className={input} />
        </div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email du client" className={input} />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Petit message (facultatif)" className={input} />
        <button type="button" onClick={envoyerLien} disabled={!montant || loading} className={btn}>
          {loading ? "Génération..." : "Envoyer le lien de paiement"}
        </button>
        {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
        {res?.url && <LinkResult url={res.url} />}
      </div>

      {supplements.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Liens envoyés</h3>
          <ul className="space-y-1.5 text-sm">
            {supplements.map((s) => (
              <li key={s._id} className="flex items-center justify-between gap-3">
                <span className="truncate">
                  {s.libelle} — {fmtEur(s.montant)}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.statut === "paye" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {s.statut === "paye" ? "Payé" : "En attente"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
