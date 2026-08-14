"use server";

import { redirect } from "next/navigation";
import { setValetSessionCookie, clearValetSessionCookie } from "@/lib/valetSession";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3131";

export async function valetLoginAction(prevState, formData) {
  const pin = formData.get("pin")?.toString().trim();

  if (!pin || !/^\d{4}$/.test(pin)) {
    return { error: "Entrez un code à 4 chiffres." };
  }

  let res, data;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/valet/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    data = await res.json();
  } catch {
    return { error: "Impossible de contacter le serveur." };
  }

  if (!res.ok || !data?.success) {
    return { error: data?.message || "Code incorrect." };
  }

  await setValetSessionCookie(data.token);
  redirect("/voiturier");
}

export async function valetLogoutAction() {
  await clearValetSessionCookie();
  redirect("/voiturier/login");
}
