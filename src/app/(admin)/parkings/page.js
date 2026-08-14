import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toggleParkingAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

export default async function ParkingsPage() {
  const { data: parkings } = await apiFetch("/admin/parkings");

  return (
    <div>
      <PageHeader title="Parkings" actions={<Button href="/parkings/new">+ Nouveau parking</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Nom</Th>
            <Th>Adresse</Th>
            <Th>Ordre</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {parkings.map((p) => (
            <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/parkings/${p._id}`} className="font-medium text-brand hover:underline">
                  {p.nom}
                </Link>
              </Td>
              <Td className="text-gray-500">{p.adresse || "-"}</Td>
              <Td>{p.ordre}</Td>
              <Td>
                <Badge variant={p.actif ? "success" : "neutral"}>{p.actif ? "Actif" : "Inactif"}</Badge>
              </Td>
              <Td className="text-right">
                <form action={toggleParkingAction.bind(null, p._id)}>
                  <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                    {p.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </form>
              </Td>
            </tr>
          ))}
          {parkings.length === 0 && (
            <tr>
              <Td colSpan={5} className="py-8 text-center text-gray-400">
                Aucun parking enregistré.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
