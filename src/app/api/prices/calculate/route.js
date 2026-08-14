import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(request) {
  const body = await request.json();

  try {
    const data = await apiFetch(`/prices/calculer`, { method: "POST", body });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
