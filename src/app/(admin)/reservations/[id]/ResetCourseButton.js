"use client";

import { useState } from "react";
import { resetCourseAction } from "./actions";

export default function ResetCourseButton({ reservationId, leg }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const label = leg === "aller" ? "la prise en charge" : "la restitution";

  async function handleClick() {
    if (
      !confirm(
        `Remettre ${label} à zéro ? Confirmation, réponses, signature, kilométrage et photos seront supprimés. Le voiturier assigné et le créneau ne changent pas.`
      )
    )
      return;
    setLoading(true);
    setError(null);
    const res = await resetCourseAction(reservationId, leg);
    if (res?.error) setError(res.error);
    setLoading(false);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="text-xs text-red-600 hover:underline disabled:opacity-60"
      >
        {loading ? "Remise à zéro..." : "Remettre à zéro"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
