import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const exclude = searchParams.get("exclude");
  if (!date) return NextResponse.json({ error: "date requis" }, { status: 400 });

  try {
    const qs = new URLSearchParams({ date, ...(exclude ? { exclude } : {}) });
    const data = await apiFetch(`/admin/creneaux/courses-disponibles?${qs.toString()}`);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
