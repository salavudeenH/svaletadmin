"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function payloadFromForm(formData) {
  return {
    nom: formData.get("nom")?.toString().trim(),
    adresse: formData.get("adresse")?.toString().trim() || undefined,
    ordre: Number(formData.get("ordre") || 0),
  };
}

export async function createParkingAction(prevState, formData) {
  try {
    await apiFetch("/admin/parkings", { method: "POST", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/parkings");
  redirect("/parkings");
}

export async function updateParkingAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/parkings/${id}`, { method: "PUT", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/parkings");
  redirect("/parkings");
}

export async function toggleParkingAction(id) {
  await apiFetch(`/admin/parkings/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/parkings");
}
