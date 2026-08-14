import Link from "next/link";
import ValetForm from "../ValetForm";
import { createValetAction } from "../actions";

export default function NewValetPage() {
  return (
    <div>
      <Link href="/valets" className="text-sm text-brand hover:underline">
        ← Retour aux voituriers
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau voiturier</h1>
      <ValetForm action={createValetAction} submitLabel="Créer" />
    </div>
  );
}
