"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function payloadFromForm(formData) {
  const tarifParJours = Array.from({ length: 30 }, (_, i) => Number(formData.get(`jour_${i + 1}`) || 0));

  return {
    nom: formData.get("nom")?.toString().trim(),
    aeroport: formData.get("aeroport")?.toString().trim() || "CDG",
    tarifParJours,
    prixPlusde30Jours: Number(formData.get("prixPlusde30Jours") || 0),
    supplementHoraire: Number(formData.get("supplementHoraire") || 0),
    heureDebut: Number(formData.get("heureDebut") || 6),
    heureFin: Number(formData.get("heureFin") || 23),
    minuteFin: Number(formData.get("minuteFin") || 30),
    ordre: Number(formData.get("ordre") || 0),
  };
}

export async function createPriceAction(prevState, formData) {
  try {
    await apiFetch("/admin/prices", { method: "POST", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/tarifs");
  redirect("/tarifs");
}

export async function updatePriceAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/prices/${id}`, { method: "PUT", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/tarifs");
  redirect("/tarifs");
}

export async function togglePriceAction(id) {
  await apiFetch(`/admin/prices/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/tarifs");
}
