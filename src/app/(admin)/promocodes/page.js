import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/statuts";
import { togglePromocodeAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

function formatReduction(p) {
  return p.type_reduction === "pourcentage" ? `${p.valeur_reduction}%` : `${p.valeur_reduction} €`;
}

export default async function PromocodesPage() {
  const { data: promocodes } = await apiFetch("/admin/promocodes");

  return (
    <div>
      <PageHeader title="Codes promo" actions={<Button href="/promocodes/new">+ Nouveau code promo</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Code</Th>
            <Th>Nom</Th>
            <Th>Réduction</Th>
            <Th>Validité</Th>
            <Th>Utilisations</Th>
            <Th>Client réservé</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {promocodes.map((p) => (
            <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/promocodes/${p._id}`} className="font-mono font-medium text-brand hover:underline">
                  {p.code}
                </Link>
              </Td>
              <Td>{p.nom}</Td>
              <Td>{formatReduction(p)}</Td>
              <Td className="text-xs text-gray-500">
                {formatDate(p.date_debut)} → {formatDate(p.date_fin)}
              </Td>
              <Td>
                {p.utilisations_actuelles}
                {p.utilisations_max ? ` / ${p.utilisations_max}` : ""}
              </Td>
              <Td className="text-xs">
                {p.client_specifique ? (
                  `${p.client_specifique.firstname} ${p.client_specifique.lastname}`
                ) : (
                  <span className="text-gray-300">Tous les clients</span>
                )}
              </Td>
              <Td>
                <Badge variant={p.actif ? "success" : "neutral"}>{p.actif ? "Actif" : "Inactif"}</Badge>
              </Td>
              <Td className="text-right">
                <form action={togglePromocodeAction.bind(null, p._id)}>
                  <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                    {p.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </form>
              </Td>
            </tr>
          ))}
          {promocodes.length === 0 && (
            <tr>
              <Td colSpan={8} className="py-8 text-center text-gray-400">
                Aucun code promo enregistré.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
