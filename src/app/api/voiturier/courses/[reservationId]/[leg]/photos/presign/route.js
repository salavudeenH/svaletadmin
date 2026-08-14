import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function POST(request, { params }) {
  const { reservationId, leg } = await params;
  const body = await request.json();

  try {
    const data = await valetApiFetch(`/me/courses/${reservationId}/${leg}/photos/presign`, {
      method: "POST",
      body,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
