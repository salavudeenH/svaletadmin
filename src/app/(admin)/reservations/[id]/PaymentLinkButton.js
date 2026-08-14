"use client";

import { useState } from "react";
import { sendPaymentLinkAction } from "./payment-actions";

export default function PaymentLinkButton({ reservationId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await sendPaymentLinkAction(reservationId);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.url);
    }
    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-3">
      <h2 className="font-semibold">Paiement</h2>
      <p className="text-sm text-gray-500">
        Génère un lien de paiement Stripe et l'envoie automatiquement par email au client. Dès que le paiement est
        confirmé, la réservation passe en statut "Payée" et l'email de confirmation part automatiquement.
      </p>

      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-60"
      >
        {loading ? "Génération..." : "Envoyer le lien de paiement"}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 space-y-2">
          <p className="text-sm text-emerald-700">Lien généré et email envoyé au client.</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={result}
              className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5 font-mono"
            />
            <button
              onClick={handleCopy}
              className="text-xs font-medium border border-gray-300 rounded px-2 py-1.5 hover:bg-gray-50"
            >
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
