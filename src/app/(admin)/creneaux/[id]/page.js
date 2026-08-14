import { apiFetch } from "@/lib/api";
import CreneauForm from "./CreneauForm";

export default async function EditCreneauPage({ params }) {
  const { id } = await params;

  const [{ data: creneau }, { data: valets }] = await Promise.all([
    apiFetch(`/admin/creneaux/${id}`),
    apiFetch("/admin/valets?actif=true"),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Modifier le créneau</h1>
      <CreneauForm creneau={creneau} valets={valets || []} />
    </div>
  );
}
