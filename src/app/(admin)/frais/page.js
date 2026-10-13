import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { fmtPrice, fmtDateFR } from "@/lib/creneaux";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Th, Td } from "@/components/ui/Table";
import FraisActions from "./FraisActions";

const ONGLETS = [
  { key: "en_attente", label: "À valider" },
  { key: "accepte", label: "Acceptés" },
  { key: "refuse", label: "Refusés" },
];

const BADGES = {
  en_attente: "bg-amber-50 text-amber-700",
  accepte: "bg-emerald-50 text-emerald-700",
  refuse: "bg-red-50 text-red-700",
};

export default async function FraisPage({ searchParams }) {
  const params = await searchParams;
  const statut = ONGLETS.some((o) => o.key === params?.statut) ? params.statut : "en_attente";
  const { data: frais } = await apiFetch(`/admin/frais?statut=${statut}`);

  return (
    <div>
      <PageHeader
        title="Frais des voituriers"
        description="Une fois accepté, un frais s'ajoute à la cagnotte du voiturier pour le mois de sa date, puis à sa facture au paiement."
      />

      <div className="flex gap-2 mb-4">
        {ONGLETS.map((o) => (
          <Link
            key={o.key}
            href={`/frais?statut=${o.key}`}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              statut === o.key ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Voiturier</Th>
            <Th>Date</Th>
            <Th>Libellé</Th>
            <Th>Justificatif</Th>
            <Th>Montant</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {frais.map((f) => (
            <tr key={f._id} className="border-t border-gray-100 align-middle">
              <Td className="font-medium whitespace-nowrap">
                {f.valet?.prenom} {f.valet?.nom}
              </Td>
              <Td className="whitespace-nowrap text-gray-500">{fmtDateFR(f.date)}</Td>
              <Td>
                {f.libelle}
                {f.refus_motif && <div className="text-xs text-red-500">Refusé : {f.refus_motif}</div>}
              </Td>
              <Td>
                {f.photo_url ? (
                  <a href={f.photo_url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.photo_url} alt="Justificatif" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </Td>
              <Td className="font-semibold whitespace-nowrap">{fmtPrice(f.montant)}</Td>
              <Td>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BADGES[f.statut]}`}>
                  {ONGLETS.find((o) => o.key === f.statut)?.label}
                </span>
              </Td>
              <Td className="text-right">
                <FraisActions id={f._id} statut={f.statut} facture={f.facture} />
              </Td>
            </tr>
          ))}
          {frais.length === 0 && (
            <tr>
              <Td colSpan={7} className="py-8 text-center text-gray-400">
                Aucun frais dans cette liste.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
