import "server-only";
import { getSessionToken } from "./session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3131";
const API_BASE = `${BACKEND_URL}/api/v1`;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Appel serveur -> backend Svalet, avec le token admin en cookie httpOnly.
// Utilisable depuis Server Components et Server Actions uniquement.
export async function apiFetch(path, { method = "GET", body, cache = "no-store" } = {}) {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    cache,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // réponse vide
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Erreur API (${res.status})`, res.status, data);
  }

  return data;
}
