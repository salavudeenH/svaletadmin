import Link from "next/link";
import PromocodeForm from "../PromocodeForm";
import { createPromocodeAction } from "../actions";

export default function NewPromocodePage() {
  return (
    <div>
      <Link href="/promocodes" className="text-sm text-brand hover:underline">
        ← Retour aux codes promo
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau code promo</h1>
      <PromocodeForm action={createPromocodeAction} submitLabel="Créer" />
    </div>
  );
}
