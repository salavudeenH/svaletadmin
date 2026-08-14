"use client";

import { useState } from "react";
import {
  sendInstructionsVoiturierAction,
  sendRappelDepartAction,
  sendConfirmationRetourAction,
} from "./email-actions";

const EMAILS = [
  {
    key: "instructions",
    label: "Instructions voiturier",
    description: "Envoie au client les coordonnées du voiturier assigné à l'aller.",
    needsValet: true,
    action: sendInstructionsVoiturierAction,
  },
  {
    key: "rappel",
    label: "Rappel de départ",
    description: "Rappelle au client le numéro du voiturier pour récupérer sa voiture.",
    needsValet: true,
    action: sendRappelDepartAction,
  },
  {
    key: "retour",
    label: "Confirmation de retour",
    description: "Confirme au client que son véhicule a été restitué.",
    needsValet: false,
    action: sendConfirmationRetourAction,
  },
];

function EmailButton({ reservationId, valetAller, def }) {
  const [state, setState] = useState({ loading: false, error: null, success: false });

  const voiturierInfo = valetAller
    ? { nom: `${valetAller.prenom} ${valetAller.nom}`, telephone: valetAller.telephone }
    : null;
  const disabled = def.needsValet && !voiturierInfo;

  async function handleClick() {
    setState({ loading: true, error: null, success: false });
    const res = def.needsValet
      ? await def.action(reservationId, voiturierInfo)
      : await def.action(reservationId);
    setState({ loading: false, error: res.error || null, success: !res.error });
  }

  return (
    <div className="flex items-center justify-between gap-4 border border-gray-100 rounded-lg px-3 py-2.5">
      <div>
        <p className="text-sm font-medium">{def.label}</p>
        <p className="text-xs text-gray-500">{def.description}</p>
        {disabled && <p className="text-xs text-amber-600 mt-0.5">Aucun voiturier assigné à l'aller.</p>}
        {state.error && <p className="text-xs text-red-600 mt-0.5">{state.error}</p>}
        {state.success && <p className="text-xs text-emerald-700 mt-0.5">Email envoyé.</p>}
      </div>
      <button
        onClick={handleClick}
        disabled={disabled || state.loading}
        className="shrink-0 text-sm font-medium border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {state.loading ? "Envoi..." : "Renvoyer"}
      </button>
    </div>
  );
}

export default function EmailActionsCard({ reservationId, valetAller }) {
  return (
    <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-3">
      <h2 className="font-semibold">Renvoi d'emails</h2>
      <div className="space-y-2">
        {EMAILS.map((def) => (
          <EmailButton key={def.key} reservationId={reservationId} valetAller={valetAller} def={def} />
        ))}
      </div>
    </div>
  );
}
