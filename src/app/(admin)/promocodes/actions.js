"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function payloadFromForm(formData) {
  return {
    code: formData.get("code")?.toString().trim().toUpperCase(),
    nom: formData.get("nom")?.toString().trim(),
    description: formData.get("description")?.toString().trim() || "",
    type_reduction: formData.get("type_reduction")?.toString(),
    valeur_reduction: Number(formData.get("valeur_reduction")),
    montant_minimum: Number(formData.get("montant_minimum") || 0),
    date_debut: formData.get("date_debut")?.toString(),
    date_fin: formData.get("date_fin")?.toString(),
    utilisation_unique: formData.get("utilisation_unique") === "true",
    utilisations_max: formData.get("utilisations_max")?.toString()
      ? Number(formData.get("utilisations_max"))
      : null,
    client_specifique_email: formData.get("client_specifique_email")?.toString().trim() || "",
  };
}

export async function createPromocodeAction(prevState, formData) {
  try {
    await apiFetch("/admin/promocodes", { method: "POST", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/promocodes");
  redirect("/promocodes");
}

export async function updatePromocodeAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/promocodes/${id}`, { method: "PUT", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/promocodes");
  redirect("/promocodes");
}

export async function togglePromocodeAction(id) {
  await apiFetch(`/admin/promocodes/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/promocodes");
}
