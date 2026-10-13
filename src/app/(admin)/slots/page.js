import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Table, { Th, Td } from "@/components/ui/Table";

function moisCourant() {
  return new Date().toISOString().slice(0, 7);
}

function decaler(mois, delta) {
  const [a, m] = mois.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

function libelleMois(mois) {
  return new Date(`${mois}-01T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });
}

function jourCourt(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", weekday: "short", day: "2-digit" });
}

function TypeCard({ titre, data }) {
  const manque = data.a_louer > 0;
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-ink">{titre}</h2>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            manque ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {manque ? `${data.a_louer} place${data.a_louer > 1 ? "s" : ""} à louer` : "Capacité suffisante"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <p className="text-xs text-gray-500">Places nécessaires</p>
          <p className="text-3xl font-bold text-brand">{data.places_necessaires}</p>
          {data.pic_jour && <p className="text-xs text-gray-400">le {jourCourt(data.pic_jour)}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-500">Capacité actuelle</p>
          <p className="text-3xl font-bold text-ink">{data.capacite}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Pic horaire</p>
          <p className="text-3xl font-bold text-gray-500">{data.pic_horaire}</p>
          <p className="text-xs text-gray-400">sans rotation</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
        <div>
          <dt className="text-gray-500">Réservations</dt>
          <dd className="font-semibold">{data.reservations}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Prises en charge</dt>
          <dd className="font-semibold">{data.prises_en_charge}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Restitutions</dt>
          <dd className="font-semibold">{data.restitutions}</dd>
        </div>
      </dl>
      {data.jours_en_depassement > 0 && (
        <p className="text-xs text-red-600 mt-3">
          Capacité dépassée {data.jours_en_depassement} jour{data.jours_en_depassement > 1 ? "s" : ""} ce mois-ci.
        </p>
      )}
    </Card>
  );
}

function JoursTable({ data }) {
  return (
    <Table>
      <thead className="bg-gray-50 text-left text-gray-500">
        <tr>
          <Th>Jour</Th>
          <Th>Places</Th>
          <Th>Pic horaire</Th>
          <Th>Entrées</Th>
          <Th>Sorties</Th>
        </tr>
      </thead>
      <tbody>
        {data.jours.map((j) => {
          const depasse = j.places > data.capacite;
          return (
            <tr key={j.date} className={`border-t border-gray-100 ${depasse ? "bg-red-50/60" : ""}`}>
              <Td className="whitespace-nowrap capitalize">{jourCourt(j.date)}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold tabular-nums w-6 ${depasse ? "text-red-600" : ""}`}>{j.places}</span>
                  <div className="h-2 flex-1 min-w-[60px] bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${depasse ? "bg-red-500" : "bg-brand"}`}
                      style={{ width: `${Math.min(100, (j.places / Math.max(data.places_necessaires, data.capacite, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </Td>
              <Td className="text-gray-500 tabular-nums">{j.pic_horaire}</Td>
              <Td className="tabular-nums">{j.entrees || "-"}</Td>
              <Td className="tabular-nums">
                {j.sorties || "-"}
                {j.meme_jour > 0 && <span className="text-xs text-gray-400"> (dont {j.meme_jour} le jour même)</span>}
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default async function SlotsPage({ searchParams }) {
  const params = await searchParams;
  const mois = /^\d{4}-\d{2}$/.test(params?.mois || "") ? params.mois : moisCourant();
  const { data } = await apiFetch(`/admin/stats/slots?mois=${mois}`);
  const { couvert, exterieur } = data.slots;

  return (
    <div>
      <PageHeader
        title="Slots"
        description="Places de parking à prévoir sur le mois, d'après les réservations payées."
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/slots?mois=${decaler(mois, -1)}`} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" aria-label="Mois précédent">
              <ChevronLeft size={16} />
            </Link>
            <span className="text-sm text-gray-600 font-medium capitalize min-w-[8rem] text-center">{libelleMois(mois)}</span>
            <Link href={`/slots?mois=${decaler(mois, 1)}`} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" aria-label="Mois suivant">
              <ChevronRight size={16} />
            </Link>
            {mois !== moisCourant() && (
              <Link href="/slots" className="text-xs text-brand hover:underline ml-1">
                Mois courant
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TypeCard titre="Parking couvert" data={couvert} />
        <TypeCard titre="Parking extérieur" data={exterieur} />
      </div>

      <p className="text-xs text-gray-500 mb-6">
        <strong>Places nécessaires</strong> : une voiture occupe une place pour chaque nuit passée sur le parking. Une voiture qui
        sort le jour où une autre entre libère sa place : elles ne comptent que pour une. Une voiture entrée et sortie le même jour
        ne passe aucune nuit. <strong>Pic horaire</strong> : maximum de voitures présentes en même temps dans la journée si une entrée
        a lieu avant la sortie (cas le plus défavorable). La capacité vient du champ « Places disponibles » de chaque parking actif
        (<Link href="/parkings" className="text-brand hover:underline">Parkings</Link>).
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold text-ink mb-2">Couvert — jour par jour</h2>
          <JoursTable data={couvert} />
        </div>
        <div>
          <h2 className="font-semibold text-ink mb-2">Extérieur — jour par jour</h2>
          <JoursTable data={exterieur} />
        </div>
      </div>
    </div>
  );
}
