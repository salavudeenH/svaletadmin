"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

const TEXT_FIELDS = [
  "contact_prenom",
  "contact_nom",
  "contact_telephone",
  "contact_email",
  "numero_vol",
  "vol_provenance",
  "terminal_depart",
  "numero_vol_retour",
  "terminal_retour",
  "heure_aller",
  "heure_retour",
  "parking_nom",
  "vol_retour_ville_depart",
  "vol_retour_compagnie",
  "incident_description",
];

const DATE_FIELDS = ["date_aller", "date_retour", "date_retour_annoncee"];

const BOOLEAN_FIELDS = ["sky_priority", "bagages_soute", "retour_confirme_par_client", "incident_signale"];

const NUMBER_FIELDS = ["kilometrage_depot", "kilometrage_retour"];

export async function updateReservationAction(id, prevState, formData) {
  const body = {
    statut: formData.get("statut")?.toString(),
    valet_aller: formData.get("valet_aller")?.toString() || null,
    valet_retour: formData.get("valet_retour")?.toString() || null,
    note_interne: formData.get("note_interne")?.toString() || "",
    numero_cle: formData.get("numero_cle")?.toString() || "",
    garde_cle: formData.get("garde_cle") === "true",
  };

  for (const field of TEXT_FIELDS) {
    body[field] = formData.get(field)?.toString() || "";
  }
  for (const field of DATE_FIELDS) {
    const value = formData.get(field)?.toString();
    if (value) body[field] = value;
  }
  for (const field of BOOLEAN_FIELDS) {
    body[field] = formData.get(field) === "true";
  }
  for (const field of NUMBER_FIELDS) {
    const value = formData.get(field)?.toString();
    if (value) body[field] = Number(value);
  }

  try {
    await apiFetch(`/admin/reservations/${id}`, { method: "PUT", body });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }

  revalidatePath(`/reservations/${id}`);
  revalidatePath("/reservations");
  return { success: true };
}
