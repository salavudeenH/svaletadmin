import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { STATUT_LABELS, STATUT_VARIANTS, formatDate, suiviVoiturier } from "@/lib/statuts";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Th, Td } from "@/components/ui/Table";
import { Input, Select } from "@/components/ui/FormField";
import ExportButtons from "./ExportButtons";
import InvoiceListButton from "./InvoiceListButton";

export default async function ReservationsPage({ searchParams }) {
  const params = await searchParams;
  const statut = params?.statut || "";
  const search = params?.search || "";
  const valet = params?.valet || "";
  const date_debut = params?.date_debut || "";
  const date_fin = params?.date_fin || "";
  const parking = params?.parking || "";
  const mois = params?.mois || "";
  const vue = params?.vue === "retours" ? "retours" : "";
  const tri = params?.tri === "asc" || params?.tri === "desc" ? params.tri : mois ? "asc" : "desc";
  const page = params?.page || "1";

  const filterParams = { statut, search, valet, date_debut, date_fin, parking, mois, vue, tri: params?.tri || "" };

  const query = new URLSearchParams();
  Object.entries({ statut, search, valet, date_debut, date_fin, parking, mois, vue, tri }).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  query.set("page", page);

  const [{ data: reservations, pagination }, { data: valets }, { data: parkings }] = await Promise.all([
    apiFetch(`/admin/reservations?${query.toString()}`),
    apiFetch("/admin/valets"),
    apiFetch("/admin/parkings?actif=true"),
  ]);

  return (
    <div>
      <PageHeader
        title="Réservations"
        actions={
          <>
            <ExportButtons filterParams={filterParams} />
            <Button href="/reservations/new">+ Nouvelle réservation</Button>
          </>
        }
      />

      <form className="flex flex-wrap gap-3 mb-5 items-end" method="get">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Recherche</label>
          <Input type="text" name="search" defaultValue={search} placeholder="Numéro, nom, email..." className="w-full sm:w-52" />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Statut</label>
          <Select name="statut" defaultValue={statut}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Voiturier</label>
          <Select name="valet" defaultValue={valet}>
            <option value="">Tous les voituriers</option>
            {valets.map((v) => (
              <option key={v._id} value={v._id}>
                {v.prenom} {v.nom}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Parking</label>
          <Select name="parking" defaultValue={parking}>
            <option value="">Tous les parkings</option>
            {parkings.map((p) => (
              <option key={p._id} value={p.nom}>
                {p.nom}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Aller — du</label>
          <Input type="date" name="date_debut" defaultValue={date_debut} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">au</label>
          <Input type="date" name="date_fin" defaultValue={date_fin} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Mois</label>
          <Input type="month" name="mois" defaultValue={mois} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Vue</label>
          <Select name="vue" defaultValue={vue}>
            <option value="">Prises en charge</option>
            <option value="retours">Retours (véhicules rentrés)</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Tri par date</label>
          <Select name="tri" defaultValue={tri}>
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </Select>
        </div>

        <Button type="submit">Filtrer</Button>
        {(statut || search || valet || date_debut || date_fin || parking || mois || vue || params?.tri) && (
          <Link href="/reservations" className="text-sm text-gray-500 hover:text-brand hover:underline px-1 py-2">
            Réinitialiser
          </Link>
        )}
      </form>

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>N°</Th>
            <Th>Client</Th>
            <Th>Aller</Th>
            <Th>Retour</Th>
            <Th>Voiturier aller</Th>
            <Th>Voiturier retour</Th>
            <Th>Clé</Th>
            <Th>Parking</Th>
            <Th>Statut</Th>
            <Th>Suivi voiturier</Th>
            <Th>Facture</Th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/reservations/${r._id}`} className="font-medium text-brand hover:underline">
                  {r.numero_reservation || r._id.slice(-6)}
                </Link>
              </Td>
              <Td>
                {r.contact_prenom || r.user?.firstname} {r.contact_nom || r.user?.lastname}
              </Td>
              <Td>{formatDate(r.date_aller)}</Td>
              <Td>{formatDate(r.date_retour)}</Td>
              <Td>
                {r.valet_aller ? `${r.valet_aller.prenom} ${r.valet_aller.nom}` : <span className="text-gray-400">Non assigné</span>}
              </Td>
              <Td>
                {r.valet_retour ? `${r.valet_retour.prenom} ${r.valet_retour.nom}` : <span className="text-gray-400">Non assigné</span>}
              </Td>
              <Td className="font-mono text-xs">{r.numero_cle || <span className="text-gray-300">-</span>}</Td>
              <Td>{r.parking_nom || <span className="text-gray-300">-</span>}</Td>
              <Td>
                <Badge variant={STATUT_VARIANTS[r.statut]}>{STATUT_LABELS[r.statut]}</Badge>
              </Td>
              <Td>
                <Badge variant={suiviVoiturier(r).variant}>{suiviVoiturier(r).label}</Badge>
              </Td>
              <Td>
                <InvoiceListButton reservationId={r._id} />
              </Td>
            </tr>
          ))}
          {reservations.length === 0 && (
            <tr>
              <Td colSpan={11} className="py-8 text-center text-gray-400">
                Aucune réservation trouvée.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>

      {pagination.pages > 1 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/reservations?${new URLSearchParams({ ...filterParams, page: String(p) }).toString()}`}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                p === pagination.page ? "bg-brand text-white border-brand" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
