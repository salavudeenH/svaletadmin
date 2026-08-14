import Link from "next/link";
import ParkingForm from "../ParkingForm";
import { createParkingAction } from "../actions";

export default function NewParkingPage() {
  return (
    <div>
      <Link href="/parkings" className="text-sm text-brand hover:underline">
        ← Retour aux parkings
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau parking</h1>
      <ParkingForm action={createParkingAction} submitLabel="Créer" />
    </div>
  );
}
