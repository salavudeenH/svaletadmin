import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { togglePriceAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

export default async function TarifsPage() {
  const { data: prices } = await apiFetch("/admin/prices");

  return (
    <div>
      <PageHeader title="Tarifs" actions={<Button href="/tarifs/new">+ Nouvelle grille tarifaire</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Nom</Th>
            <Th>Aéroport</Th>
            <Th>1 jour</Th>
            <Th>7 jours</Th>
            <Th>30 jours</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p) => (
            <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/tarifs/${p._id}`} className="font-medium text-brand hover:underline">
                  {p.nom}
                </Link>
              </Td>
              <Td>{p.aeroport}</Td>
              <Td>{p.tarifParJours?.[0]} €</Td>
              <Td>{p.tarifParJours?.[6]} €</Td>
              <Td>{p.tarifParJours?.[29]} €</Td>
              <Td>
                <Badge variant={p.actif ? "success" : "neutral"}>{p.actif ? "Actif" : "Inactif"}</Badge>
              </Td>
              <Td className="text-right">
                <form action={togglePriceAction.bind(null, p._id)}>
                  <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                    {p.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </form>
              </Td>
            </tr>
          ))}
          {prices.length === 0 && (
            <tr>
              <Td colSpan={7} className="py-8 text-center text-gray-400">
                Aucune grille tarifaire enregistrée.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
