"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function marquerLueAction(id) {
  await apiFetch(`/admin/notifications/${id}/lue`, { method: "PATCH" });
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}

export async function toutMarquerLuAction() {
  await apiFetch("/admin/notifications/tout-lu", { method: "POST" });
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}
