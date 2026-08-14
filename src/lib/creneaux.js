export const MODE_LABELS = {
  heure: "À l'heure",
  course: "À la course",
  nuit: "Tarif nuit",
};

export const MODE_BADGE_CLASSES = {
  heure: "bg-blue-50 text-blue-700",
  course: "bg-gray-100 text-gray-600",
  nuit: "bg-indigo-50 text-indigo-700",
};

export const LEG_LABELS = {
  aller: "Aller",
  retour: "Retour",
};

export function fmtPrice(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(n || 0));
}

export function fmtDateFR(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
}

export function courseKey(c) {
  return `${c.reservation}_${c.leg}`;
}
