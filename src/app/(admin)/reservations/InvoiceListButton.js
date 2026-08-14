"use client";

import { useState } from "react";
import { generateInvoicePDF } from "@/lib/invoice";

export default function InvoiceListButton({ reservationId }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Erreur lors du chargement de la réservation");
      await generateInvoicePDF(json.data);
    } catch (err) {
      alert(err.message || "Erreur lors de la génération de la facture");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Télécharger la facture"
      className="text-xs font-medium text-brand hover:underline disabled:opacity-60"
    >
      {loading ? "..." : "Facture"}
    </button>
  );
}
