import { apiFetch } from "@/lib/api";
import NewCreneauForm from "./NewCreneauForm";

export default async function NewCreneauPage() {
  const { data: valets } = await apiFetch("/admin/valets?actif=true");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Nouveau créneau</h1>
      <NewCreneauForm valets={valets || []} />
    </div>
  );
}
