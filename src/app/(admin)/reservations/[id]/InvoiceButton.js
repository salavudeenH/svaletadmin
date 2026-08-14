"use client";

import { useState } from "react";
import { generateInvoicePDF } from "@/lib/invoice";

export default function InvoiceButton({ reservation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await generateInvoicePDF(reservation);
    } catch (err) {
      setError(err.message || "Erreur lors de la génération de la facture");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {loading ? "Génération..." : "Télécharger la facture"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
