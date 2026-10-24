"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function ajouterLigneAction(prevState, formData) {
  const type = formData.get("type")?.toString();
  const libelle = formData.get("libelle")?.toString().trim();
  const montant = Number(formData.get("montant")?.toString().replace(",", "."));
  const annee = Number(formData.get("annee"));
  const mois = Number(formData.get("mois"));

  if (!libelle) return { error: "Indiquez un libellé." };
  if (!Number.isFinite(montant) || montant <= 0) return { error: "Indiquez un montant supérieur à 0." };

  try {
    await apiFetch("/admin/benefices/lignes", { method: "POST", body: { type, libelle, montant, annee, mois } });
  } catch (e) {
    return { error: e.message || "Impossible d'enregistrer." };
  }

  revalidatePath("/benefices");
  return { ok: Date.now() };
}

export async function supprimerLigneAction(id) {
  await apiFetch(`/admin/benefices/lignes/${id}`, { method: "DELETE" });
  revalidatePath("/benefices");
}

export async function exclureValetAction(id, exclu) {
  await apiFetch(`/admin/benefices/valets/${id}`, { method: "PATCH", body: { exclu } });
  revalidatePath("/benefices");
}
