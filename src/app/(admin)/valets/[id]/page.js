import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getRole } from "@/lib/session";
import ValetForm from "../ValetForm";
import { updateValetAction } from "../actions";

export default async function EditValetPage({ params }) {
  const { id } = await params;
  const [{ data: valet }, role] = await Promise.all([apiFetch(`/admin/valets/${id}`), getRole()]);

  const boundAction = updateValetAction.bind(null, id);

  return (
    <div>
      <Link href="/valets" className="text-sm text-brand hover:underline">
        ← Retour aux voituriers
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">
        {valet.prenom} {valet.nom}
      </h1>
      <ValetForm valet={valet} action={boundAction} readOnly={role === "manager"} />
    </div>
  );
}
