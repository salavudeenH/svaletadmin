import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const { data } = await apiFetch(`/admin/reservations/${id}`);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.status || 500 });
  }
}
