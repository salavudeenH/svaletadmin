"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function marquerPayesAction(ids, fraisIds = []) {
  await apiFetch("/admin/creneaux/marquer-payes", { method: "POST", body: { ids, frais_ids: fraisIds } });
  revalidatePath("/paiement");
}

export async function creerVersementAction({ valet, annee, mois, montant, date, note }) {
  try {
    await apiFetch("/admin/creneaux/versements", { method: "POST", body: { valet, annee, mois, montant: Number(montant), date, note } });
  } catch (err) {
    return { error: err.message || "Erreur lors du versement." };
  }
  revalidatePath("/paiement");
  return { success: true };
}

export async function supprimerVersementAction(id) {
  try {
    await apiFetch(`/admin/creneaux/versements/${id}`, { method: "DELETE" });
  } catch (err) {
    return { error: err.message || "Erreur lors de la suppression." };
  }
  revalidatePath("/paiement");
  return { success: true };
}
