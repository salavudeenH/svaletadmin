"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function payloadFromForm(formData) {
  return {
    code: formData.get("code")?.toString().trim().toLowerCase(),
    nom: formData.get("nom")?.toString().trim(),
    texte: formData.get("texte")?.toString().trim() || undefined,
    prix: Number(formData.get("prix") || 0),
    image: formData.get("image")?.toString().trim() || undefined,
    ordre: Number(formData.get("ordre") || 0),
  };
}

export async function createOptionAction(prevState, formData) {
  try {
    await apiFetch("/admin/options", { method: "POST", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/options");
  redirect("/options");
}

export async function updateOptionAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/options/${id}`, { method: "PUT", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/options");
  redirect("/options");
}

export async function toggleOptionAction(id) {
  await apiFetch(`/admin/options/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/options");
}
