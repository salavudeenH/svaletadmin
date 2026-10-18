"use client";

import { useState } from "react";
import { setSuiviAction } from "./actions";

const OPTIONS = [
  { value: "a_venir", label: "À venir" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
];

export default function SuiviSelect({ reservationId, current }) {
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function change(e) {
    const next = e.target.value;
    if (
      !confirm(
        `Passer le suivi voiturier à « ${OPTIONS.find((o) => o.value === next).label} » ? Cela modifie les confirmations « client rencontré » sans passer par le questionnaire.`
      )
    ) {
      return;
    }
    const previous = value;
    setValue(next);
    setLoading(true);
    setError(null);
    const res = await setSuiviAction(reservationId, next);
    if (res?.error) {
      setError(res.error);
      setValue(previous);
    }
    setLoading(false);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={change}
        disabled={loading}
        aria-label="Changer le suivi voiturier"
        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
