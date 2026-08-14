import Link from "next/link";
import PriceForm from "../PriceForm";
import { createPriceAction } from "../actions";

export default function NewTarifPage() {
  return (
    <div>
      <Link href="/tarifs" className="text-sm text-brand hover:underline">
        ← Retour aux tarifs
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouvelle grille tarifaire</h1>
      <PriceForm action={createPriceAction} submitLabel="Créer" />
    </div>
  );
}
