import { cookies } from "next/headers";

const COOKIE_NAME = "svalet_valet_token";
const MAX_AGE = 24 * 60 * 60; // 24h, aligné sur l'expiration du JWT backend

export async function setValetSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getValetSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function clearValetSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const VALET_SESSION_COOKIE_NAME = COOKIE_NAME;
