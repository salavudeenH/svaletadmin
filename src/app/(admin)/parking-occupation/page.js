import Link from "next/link";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Th, Td } from "@/components/ui/Table";

export default async function ParkingOccupationPage() {
  const { data: parkings, nonRattache, total } = await apiFetch("/admin/parkings/occupation");

  return (
    <div>
      <PageHeader title="Occupation parkings" />
      <p className="text-sm text-gray-500 mb-5">
        Véhicules actuellement garés (réservation payée, dépôt confirmé par le voiturier, retour pas encore confirmé).
      </p>

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Parking</Th>
            <Th>Adresse</Th>
            <Th>Véhicules garés</Th>
          </tr>
        </thead>
        <tbody>
          {parkings.map((p) => (
            <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/reservations?parking=${encodeURIComponent(p.nom)}`} className="font-medium text-brand hover:underline">
                  {p.nom}
                </Link>
              </Td>
              <Td className="text-gray-500">{p.adresse || "-"}</Td>
              <Td className="font-semibold">{p.count}</Td>
            </tr>
          ))}
          {parkings.length === 0 && (
            <tr>
              <Td colSpan={3} className="py-8 text-center text-gray-400">
                Aucun parking actif enregistré.
              </Td>
            </tr>
          )}
          {nonRattache > 0 && (
            <tr className="border-t border-gray-100 bg-amber-50/50">
              <Td className="text-gray-500 italic">Sans parking connu / désactivé</Td>
              <Td className="text-gray-400">-</Td>
              <Td className="font-semibold">{nonRattache}</Td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50">
            <Td className="font-medium">Total</Td>
            <Td />
            <Td className="font-semibold">{total}</Td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
