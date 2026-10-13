"use client";

import { useState } from "react";
import { telechargerFacture } from "@/lib/facturePdf";

export default function FacturesDownload({ factures }) {
  const [loading, setLoading] = useState(null);
  if (!factures?.length) return null;
  return (
    <div className="mt-4 space-y-2">
      {factures.map((f) => (
        <button
          key={f._id}
          disabled={loading === f._id}
          onClick={async () => {
            setLoading(f._id);
            try {
              await telechargerFacture(f);
            } finally {
              setLoading(null);
            }
          }}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between text-left disabled:opacity-60"
        >
          <span className="text-sm text-gray-700">Télécharger la facture {f.numero}</span>
          <span className="text-sm font-semibold text-brand">PDF ↓</span>
        </button>
      ))}
    </div>
  );
}
