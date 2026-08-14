import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ParkingForm from "../ParkingForm";
import { updateParkingAction } from "../actions";

export default async function EditParkingPage({ params }) {
  const { id } = await params;
  const { data: parking } = await apiFetch(`/admin/parkings/${id}`);

  const boundAction = updateParkingAction.bind(null, id);

  return (
    <div>
      <Link href="/parkings" className="text-sm text-brand hover:underline">
        ← Retour aux parkings
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{parking.nom}</h1>
      <ParkingForm parking={parking} action={boundAction} />
    </div>
  );
}
