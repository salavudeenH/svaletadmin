import Link from "next/link";
import OptionForm from "../OptionForm";
import { createOptionAction } from "../actions";

export default function NewOptionPage() {
  return (
    <div>
      <Link href="/options" className="text-sm text-brand hover:underline">
        ← Retour au catalogue d'options
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouvelle option</h1>
      <OptionForm action={createOptionAction} submitLabel="Créer" />
    </div>
  );
}
