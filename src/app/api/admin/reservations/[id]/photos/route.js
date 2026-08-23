import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await apiFetch(`/admin/reservations/${id}/photos`, { method: "POST", body });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const data = await apiFetch(`/admin/reservations/${id}/photos`, { method: "DELETE", body });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
