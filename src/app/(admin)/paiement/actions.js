"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function marquerPayesAction(ids, fraisIds = []) {
  await apiFetch("/admin/creneaux/marquer-payes", { method: "POST", body: { ids, frais_ids: fraisIds } });
  revalidatePath("/paiement");
}
