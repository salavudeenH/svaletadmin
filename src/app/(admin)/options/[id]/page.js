import Link from "next/link";
import { apiFetch } from "@/lib/api";
import OptionForm from "../OptionForm";
import { updateOptionAction } from "../actions";

export default async function EditOptionPage({ params }) {
  const { id } = await params;
  const { data: option } = await apiFetch(`/admin/options/${id}`);

  const boundAction = updateOptionAction.bind(null, id);

  return (
    <div>
      <Link href="/options" className="text-sm text-brand hover:underline">
        ← Retour au catalogue d'options
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{option.nom}</h1>
      <OptionForm option={option} action={boundAction} />
    </div>
  );
}
