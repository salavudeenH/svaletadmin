import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "./RevenueChart";

const STATUT_LABELS = {
  en_cours: "En cours",
  abandonnee: "Abandonnées",
  payee: "Payées",
  confirmee: "Confirmées",
  en_execution: "En exécution",
  terminee: "Terminées",
  annulee: "Annulées",
};

function formatEuros(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    value || 0
  );
}

export default async function DashboardPage() {
  const [{ data: stats }, { data: today }, { data: revenue }] = await Promise.all([
    apiFetch("/admin/stats"),
    apiFetch("/admin/stats/today"),
    apiFetch("/admin/stats/revenue"),
  ]);

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      {/* Aujourd'hui */}
      <Card className="mb-6 sm:mb-8">
        <h2 className="font-semibold text-ink mb-4">Aujourd'hui</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="rounded-lg border border-gray-100 p-4">
            <p className="text-sm text-gray-500 mb-1">
              Voitures qui arrivent <span className="font-semibold text-brand">({today.arrivees})</span>
            </p>
            {today.arrivees_liste?.length > 0 ? (
              <div className="space-y-1 mt-2">
                {today.arrivees_liste.map((r) => (
                  <Link
                    key={r.reservation_id}
                    href={`/reservations/${r.reservation_id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-brand">{r.heure || "-"}</span>
                    <span className="flex-1 mx-2 truncate">{r.client || "-"}</span>
                    <span className="text-gray-400 text-xs truncate">{r.vehicule || "-"}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aucune arrivée aujourd'hui.</p>
            )}
          </div>

          <div className="rounded-lg border border-gray-100 p-4">
            <p className="text-sm text-gray-500 mb-1">
              Voitures qui repartent <span className="font-semibold text-brand">({today.departs})</span>
            </p>
            {today.departs_liste?.length > 0 ? (
              <div className="space-y-1 mt-2">
                {today.departs_liste.map((r) => (
                  <Link
                    key={r.reservation_id}
                    href={`/reservations/${r.reservation_id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-brand">{r.heure || "-"}</span>
                    <span className="flex-1 mx-2 truncate">{r.client || "-"}</span>
                    <span className="text-gray-400 text-xs truncate">{r.vehicule || "-"}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aucun départ aujourd'hui.</p>
            )}
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-700 mb-2">Voituriers sur le terrain</h3>
        {today.voituriers_sur_le_terrain.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune mission aujourd'hui.</p>
        ) : (
          <div className="space-y-2">
            {today.voituriers_sur_le_terrain.map(({ valet, missions }) => (
              <div key={valet._id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <Link href={`/valets/${valet._id}`} className="font-medium text-brand hover:underline">
                    {valet.prenom} {valet.nom}
                  </Link>
                  <span className="text-gray-400 text-sm"> — {valet.telephone}</span>
                </div>
                <div className="flex gap-1">
                  {missions.map((m, i) => (
                    <Link
                      key={i}
                      href={`/reservations/${m.reservation_id}`}
                      className={`text-xs rounded-full px-2.5 py-1 font-medium hover:opacity-80 ${
                        m.type === "aller" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {m.type === "aller" ? "Arrivée" : "Départ"} · {m.numero_reservation}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Chiffre d'affaires */}
      <Card className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
          <h2 className="font-semibold text-ink">Chiffre d'affaires {revenue.year}</h2>
          <p className="text-2xl font-bold text-brand">{formatEuros(revenue.total_annee)}</p>
        </div>
        <RevenueChart parMois={revenue.par_mois} />
      </Card>

      {/* Stats générales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <StatCard label="Réservations à venir" value={stats.reservations_a_venir} />
        <StatCard label="Voituriers actifs" value={`${stats.valets_actifs} / ${stats.valets_total}`} />
        <StatCard label="Utilisateurs" value={stats.users_total} />
        <StatCard label="Confirmées" value={stats.reservations_par_statut?.confirmee || 0} />
      </div>

      <Card>
        <h2 className="font-semibold text-ink mb-4">Réservations par statut</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(STATUT_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold">{stats.reservations_par_statut?.[key] || 0}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
