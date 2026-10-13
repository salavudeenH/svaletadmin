"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupprimerFraisButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm("Supprimer ce frais ?")) return;
        setLoading(true);
        await fetch(`/api/voiturier/frais/${id}`, { method: "DELETE" });
        router.refresh();
      }}
      className="text-xs text-red-500 underline disabled:opacity-60"
    >
      Supprimer
    </button>
  );
}
