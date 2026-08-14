"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function sendPaymentLinkAction(id) {
  try {
    const { data } = await apiFetch(`/admin/reservations/${id}/payment-link`, { method: "POST" });
    revalidatePath(`/reservations/${id}`);
    return { url: data.url };
  } catch (err) {
    return { error: err.message || "Erreur lors de la génération du lien de paiement." };
  }
}
