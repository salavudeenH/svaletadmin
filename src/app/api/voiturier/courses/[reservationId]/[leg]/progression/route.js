import { NextResponse } from "next/server";
import { valetApiFetch } from "@/lib/valetApi";

export async function PUT(request, { params }) {
  const { reservationId, leg } = await params;
  const body = await request.json();

  try {
    const data = await valetApiFetch(`/me/courses/${reservationId}/${leg}/progression`, {
      method: "PUT",
      body,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
