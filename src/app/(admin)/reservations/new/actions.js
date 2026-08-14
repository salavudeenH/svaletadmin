"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";

export async function createReservationAction(prevState, formData) {
  const body = {
    client_id: formData.get("client_id")?.toString() || null,
    contact_prenom: formData.get("contact_prenom")?.toString().trim(),
    contact_nom: formData.get("contact_nom")?.toString().trim(),
    contact_email: formData.get("contact_email")?.toString().trim(),
    contact_telephone: formData.get("contact_telephone")?.toString().trim(),
    date_aller: formData.get("date_aller")?.toString(),
    heure_aller: formData.get("heure_aller")?.toString(),
    date_retour: formData.get("date_retour")?.toString(),
    heure_retour: formData.get("heure_retour")?.toString(),
    partenaire: formData.get("partenaire")?.toString().trim() || "SVALET",
    parking: formData.get("parking")?.toString() || undefined,
    parking_nom: formData.get("parking_nom")?.toString().trim(),
    numero_vol: formData.get("numero_vol")?.toString().trim(),
    vol_provenance: formData.get("vol_provenance")?.toString().trim(),
    terminal_depart: formData.get("terminal_depart")?.toString().trim(),
    numero_vol_retour: formData.get("numero_vol_retour")?.toString().trim(),
    terminal_retour: formData.get("terminal_retour")?.toString().trim(),
    garde_cle: formData.get("garde_cle") === "true",
    montant_base: formData.get("montant_base")?.toString() || 0,
    surcharges: formData.get("surcharges")?.toString() || 0,
    montant_total: formData.get("montant_total")?.toString(),
    nombre_de_jours: formData.get("nombre_de_jours")?.toString() || undefined,
    note_interne: formData.get("note_interne")?.toString().trim(),
  };

  let reservation;
  try {
    const res = await apiFetch("/admin/reservations", { method: "POST", body });
    reservation = res.data;
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }

  redirect(`/reservations/${reservation._id}`);
}
