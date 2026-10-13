import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  try {
    const data = await valetApiFetch("/me/frais", { method: "POST", body });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
