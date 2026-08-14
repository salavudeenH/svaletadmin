"use server";

import { apiFetch } from "@/lib/api";

export async function sendInstructionsVoiturierAction(reservationId, voiturierInfo) {
  try {
    await apiFetch("/emails/instructions-voiturier", { method: "POST", body: { reservationId, voiturierInfo } });
    return { success: true };
  } catch (err) {
    return { error: err.message || "Erreur lors de l'envoi des instructions." };
  }
}

export async function sendRappelDepartAction(reservationId, voiturierInfo) {
  try {
    await apiFetch("/emails/rappel-depart", { method: "POST", body: { reservationId, voiturierInfo } });
    return { success: true };
  } catch (err) {
    return { error: err.message || "Erreur lors de l'envoi du rappel." };
  }
}

export async function sendConfirmationRetourAction(reservationId) {
  try {
    await apiFetch("/emails/confirmation-retour", { method: "POST", body: { reservationId } });
    return { success: true };
  } catch (err) {
    return { error: err.message || "Erreur lors de l'envoi de la confirmation." };
  }
}
