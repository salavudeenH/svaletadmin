import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const { data } = await apiFetch(`/admin/reservations/export?${searchParams.toString()}`);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.status || 500 });
  }
}
