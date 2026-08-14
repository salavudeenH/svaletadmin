"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function valetPayloadFromForm(formData) {
  return {
    nom: formData.get("nom")?.toString().trim(),
    prenom: formData.get("prenom")?.toString().trim(),
    date_naissance: formData.get("date_naissance")?.toString(),
    telephone: formData.get("telephone")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    siret: formData.get("siret")?.toString().trim() || undefined,
    adresse: formData.get("adresse")?.toString().trim() || undefined,
    pin: formData.get("pin")?.toString().trim() || undefined,
  };
}

export async function createValetAction(prevState, formData) {
  try {
    await apiFetch("/admin/valets", { method: "POST", body: valetPayloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/valets");
  redirect("/valets");
}

export async function updateValetAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/valets/${id}`, { method: "PUT", body: valetPayloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/valets");
  redirect("/valets");
}

export async function toggleValetAction(id) {
  await apiFetch(`/admin/valets/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/valets");
}
