import Link from "next/link";
import { apiFetch } from "@/lib/api";
import PriceForm from "../PriceForm";
import { updatePriceAction } from "../actions";

export default async function EditTarifPage({ params }) {
  const { id } = await params;
  const { data: price } = await apiFetch(`/admin/prices/${id}`);

  const boundAction = updatePriceAction.bind(null, id);

  return (
    <div>
      <Link href="/tarifs" className="text-sm text-brand hover:underline">
        ← Retour aux tarifs
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{price.nom}</h1>
      <PriceForm price={price} action={boundAction} />
    </div>
  );
}
