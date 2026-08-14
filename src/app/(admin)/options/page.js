import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toggleOptionAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

export default async function OptionsPage() {
  const { data: options } = await apiFetch("/admin/options");

  return (
    <div>
      <PageHeader title="Catalogue d'options" actions={<Button href="/options/new">+ Nouvelle option</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Nom</Th>
            <Th>Code</Th>
            <Th>Prix</Th>
            <Th>Ordre</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {options.map((o) => (
            <tr key={o._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/options/${o._id}`} className="font-medium text-brand hover:underline">
                  {o.nom}
                </Link>
              </Td>
              <Td className="text-gray-500">{o.code}</Td>
              <Td>{o.prix} €</Td>
              <Td>{o.ordre}</Td>
              <Td>
                <Badge variant={o.actif ? "success" : "neutral"}>{o.actif ? "Actif" : "Inactif"}</Badge>
              </Td>
              <Td className="text-right">
                <form action={toggleOptionAction.bind(null, o._id)}>
                  <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                    {o.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </form>
              </Td>
            </tr>
          ))}
          {options.length === 0 && (
            <tr>
              <Td colSpan={6} className="py-8 text-center text-gray-400">
                Aucune option enregistrée.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
