"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function sendPaymentLinkAction(id, email) {
  try {
    const { data } = await apiFetch(`/admin/reservations/${id}/payment-link`, { method: "POST", body: { email } });
    revalidatePath(`/reservations/${id}`);
    return { url: data.url };
  } catch (err) {
    return { error: err.message || "Erreur lors de la génération du lien de paiement." };
  }
}

export async function sendSupplementLinkAction(id, { montant, libelle, message, email }) {
  try {
    const { data } = await apiFetch(`/admin/reservations/${id}/supplement-link`, {
      method: "POST",
      body: { montant: Number(montant), libelle, message, email },
    });
    revalidatePath(`/reservations/${id}`);
    return { url: data.url };
  } catch (err) {
    return { error: err.message || "Erreur lors de la génération du lien." };
  }
}

export async function addOptionAction(id, { option_id, qty, envoyer_lien, email, message }) {
  try {
    const { data } = await apiFetch(`/admin/reservations/${id}/options`, {
      method: "POST",
      body: { option_id, qty: Number(qty) || 1, envoyer_lien, email, message },
    });
    revalidatePath(`/reservations/${id}`);
    return { url: data.url, ajoutee: data.ajoutee };
  } catch (err) {
    return { error: err.message || "Erreur lors de l'ajout de l'option." };
  }
}
