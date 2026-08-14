"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

export async function updateUserRoleAction(id, formData) {
  const role = formData.get("role")?.toString();
  await apiFetch(`/admin/users/${id}/role`, { method: "PUT", body: { role } });
  revalidatePath("/users");
}
