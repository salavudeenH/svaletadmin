"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, setRoleCookie } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3131";

export async function loginAction(prevState, formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  let res, data;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    data = await res.json();
  } catch {
    return { error: "Impossible de contacter le serveur." };
  }

  if (!res.ok || !data?.auth) {
    return { error: data?.message || "Identifiants invalides." };
  }

  const role = data.user?.isAdmin === true ? "admin" : data.user?.role;
  const hasBackofficeAccess = role === "admin" || role === "manager";
  if (!hasBackofficeAccess) {
    return { error: "Ce compte n'a pas accès au back-office." };
  }

  await setSessionCookie(data.token);
  await setRoleCookie(role);
  redirect(role === "manager" ? "/reservations" : "/");
}
