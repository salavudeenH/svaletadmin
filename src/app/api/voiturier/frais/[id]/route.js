import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const data = await valetApiFetch(`/me/frais/${id}`, { method: "DELETE" });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
