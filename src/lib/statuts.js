export const STATUT_LABELS = {
  en_cours: "En cours",
  abandonnee: "Abandonnée",
  payee: "Payée",
  confirmee: "Confirmée",
  en_execution: "En exécution",
  terminee: "Terminée",
  annulee: "Annulée",
};

export const STATUT_COLORS = {
  en_cours: "bg-gray-100 text-gray-700",
  abandonnee: "bg-red-50 text-red-600",
  payee: "bg-blue-50 text-blue-700",
  confirmee: "bg-emerald-50 text-emerald-700",
  en_execution: "bg-amber-50 text-amber-700",
  terminee: "bg-gray-200 text-gray-700",
  annulee: "bg-red-100 text-red-700",
};

// Variantes pour le composant <Badge /> (src/components/ui/Badge.js).
export const STATUT_VARIANTS = {
  en_cours: "neutral",
  abandonnee: "danger",
  payee: "info",
  confirmee: "success",
  en_execution: "warning",
  terminee: "neutral",
  annulee: "danger",
};

// Statut de suivi terrain, purement dérivé des confirmations voiturier (aller_confirme_le /
// retour_confirme_le) — n'a rien à voir avec `statut` (paiement/facturation), affiché en plus,
// uniquement côté admin.
export function suiviVoiturier(reservation) {
  if (reservation.retour_confirme_le) return { label: "Terminé", variant: "neutral" };
  if (reservation.aller_confirme_le) return { label: "En cours", variant: "warning" };
  return { label: "À venir", variant: "neutral" };
}

export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
