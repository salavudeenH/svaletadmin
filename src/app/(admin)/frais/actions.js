"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function traiterFraisAction(id, statut, motif) {
  await apiFetch(`/admin/frais/${id}`, { method: "PATCH", body: { statut, motif } });
  revalidatePath("/frais");
  revalidatePath("/paiement");
}
