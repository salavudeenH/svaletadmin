"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function payloadFromForm(formData) {
  return {
    name: formData.get("name")?.toString().trim(),
    rating: Number(formData.get("rating") || 5),
    text: formData.get("text")?.toString().trim(),
    date: formData.get("date")?.toString().trim(),
    source: formData.get("source")?.toString() || "manual",
    order: Number(formData.get("order") || 0),
  };
}

export async function createReviewAction(prevState, formData) {
  try {
    await apiFetch("/admin/reviews", { method: "POST", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création." };
  }
  revalidatePath("/reviews");
  redirect("/reviews");
}

export async function updateReviewAction(id, prevState, formData) {
  try {
    await apiFetch(`/admin/reviews/${id}`, { method: "PUT", body: payloadFromForm(formData) });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/reviews");
  redirect("/reviews");
}

export async function toggleReviewAction(id) {
  await apiFetch(`/admin/reviews/${id}/toggle`, { method: "PATCH" });
  revalidatePath("/reviews");
}

export async function deleteReviewAction(id) {
  await apiFetch(`/admin/reviews/${id}`, { method: "DELETE" });
  revalidatePath("/reviews");
}
