import Link from "next/link";
import { apiFetch } from "@/lib/api";
import PromocodeForm from "../PromocodeForm";
import { updatePromocodeAction } from "../actions";

export default async function EditPromocodePage({ params }) {
  const { id } = await params;
  const { data: promocode } = await apiFetch(`/admin/promocodes/${id}`);

  const boundAction = updatePromocodeAction.bind(null, id);

  return (
    <div>
      <Link href="/promocodes" className="text-sm text-brand hover:underline">
        ← Retour aux codes promo
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{promocode.code}</h1>
      <PromocodeForm promocode={promocode} action={boundAction} />
    </div>
  );
}
