import { cookies } from "next/headers";

const COOKIE_NAME = "svalet_admin_token";
// Non-httpOnly : ce n'est qu'un hint d'UI pour afficher/masquer des sections côté back-office admin.
// L'autorisation réelle est toujours vérifiée côté backend (requireAdmin / requireFullAdmin).
const ROLE_COOKIE_NAME = "svalet_admin_role";
const MAX_AGE = 48 * 60 * 60; // 48h, aligné sur l'expiration du JWT backend

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setRoleCookie(role) {
  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE_NAME, role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getRole() {
  const cookieStore = await cookies();
  return cookieStore.get(ROLE_COOKIE_NAME)?.value ?? null;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(ROLE_COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const ROLE_COOKIE = ROLE_COOKIE_NAME;
