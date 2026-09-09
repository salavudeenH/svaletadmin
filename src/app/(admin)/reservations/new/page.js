import Link from "next/link";
import { apiFetch } from "@/lib/api";
import NewReservationForm from "./NewReservationForm";

export default async function NewReservationPage() {
  const { data: parkings } = await apiFetch("/admin/parkings?actif=true");
  const { data: allOptions } = await apiFetch("/admin/options");
  const options = (allOptions || []).filter((o) => o.actif);

  return (
    <div>
      <Link href="/reservations" className="text-sm text-brand hover:underline">
        ← Retour aux réservations
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouvelle réservation</h1>
      <NewReservationForm parkings={parkings} options={options} />
    </div>
  );
}
