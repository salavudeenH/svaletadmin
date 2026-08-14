"use server";

import { revalidatePath } from "next/cache";
import { valetApiFetch } from "@/lib/valetApi";

// Seuls telegram_id et adresse sont modifiables par le voiturier — le reste est géré par l'admin.
export async function updateProfileAction(prevState, formData) {
  const payload = {
    telegram_id: formData.get("telegram_id")?.toString().trim(),
    adresse: formData.get("adresse")?.toString().trim(),
  };

  try {
    await valetApiFetch("/me", { method: "PUT", body: payload });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/voiturier/parametres");
  return { success: true };
}
