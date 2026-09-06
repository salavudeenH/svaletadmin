import { apiFetch } from "@/lib/api";
import { fmtPrice, fmtDateFR, LEG_LABELS } from "@/lib/creneaux";
import MarquerPayeButton from "./MarquerPayeButton";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

const MOIS_LABELS = [
  "",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function moisLabel(annee, mois) {
  return `${MOIS_LABELS[mois]} ${annee}`;
}

// Les lignes arrivent déjà groupées (voiturier, année, mois) par le backend — on les regroupe
// ici uniquement par mois, en conservant l'ordre de tri du backend (chronologique).
function groupByMois(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = `${row.annee}-${row.mois}`;
    if (!map.has(key)) map.set(key, { annee: row.annee, mois: row.mois, groupes: [], total: 0 });
    const entry = map.get(key);
    entry.groupes.push(row);
    entry.total += row.total;
  }
  return Array.from(map.values());
}

function CreneauxTable({ creneaux, showPayeLe }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {creneaux.map((c) => (
            <tr key={c._id} className="border-t border-gray-50">
              <td className="px-4 sm:px-5 py-2.5 whitespace-nowrap text-gray-500">
                {fmtDateFR(c.date)}
                {(c.heure_debut || c.heure_fin) && (
                  <span className="text-xs text-gray-400"> · {c.heure_debut || "?"}–{c.heure_fin || "?"}</span>
                )}
              </td>
              <td className="px-4 sm:px-5 py-2.5">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {c.courses.map((course, i) => (
                    <span key={i} className="text-xs text-gray-500">
                      {course.heure} · {LEG_LABELS[course.leg]}
                    </span>
                  ))}
                </div>
              </td>
              {showPayeLe && (
                <td className="px-4 sm:px-5 py-2.5 whitespace-nowrap text-xs text-gray-400">
                  {c.paye_le ? `Payé le ${fmtDateFR(c.paye_le)}` : ""}
                </td>
              )}
              <td className="px-4 sm:px-5 py-2.5 text-right font-medium whitespace-nowrap">{fmtPrice(c.prix_final)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PaiementPage() {
  const [{ data: impayesRows }, { data: historique }] = await Promise.all([
    apiFetch("/admin/creneaux/impayes"),
    apiFetch("/admin/creneaux/payes"),
  ]);

  const moisImpayes = groupByMois(impayesRows || []);
  const moisPayes = groupByMois(historique?.groupes || []);
  const totalImpaye = moisImpayes.reduce((sum, m) => sum + m.total, 0);

  return (
    <div>
      <PageHeader
        title="Paiement"
        description="Créneaux non payés, groupés par mois puis par voiturier — chaque mois se paie séparément."
      />

      {moisImpayes.length === 0 ? (
        <div className="bg-white rounded-card border border-gray-200">
          <EmptyState>Tous les créneaux sont payés.</EmptyState>
        </div>
      ) : (
        <>
          {moisImpayes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
              <span className="text-gray-500">Reste à payer, tous mois confondus :</span>
              <span className="font-semibold text-ink">{fmtPrice(totalImpaye)}</span>
              <span className="text-gray-300">·</span>
              {moisImpayes.map((m) => (
                <span key={`${m.annee}-${m.mois}`} className="text-gray-400">
                  {moisLabel(m.annee, m.mois)} : <span className="text-gray-600 font-medium">{fmtPrice(m.total)}</span>
                </span>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {moisImpayes.map((m) => {
              const idsDuMois = m.groupes.flatMap((g) => g.creneaux.map((c) => c._id));
              const label = moisLabel(m.annee, m.mois);
              return (
                <section key={`${m.annee}-${m.mois}`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h2 className="text-lg font-semibold text-ink">{label}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        Reste à payer : <span className="font-semibold text-brand">{fmtPrice(m.total)}</span>
                      </span>
                      {m.groupes.length > 1 && (
                        <MarquerPayeButton
                          ids={idsDuMois}
                          label={`Tout marquer payé — ${label}`}
                          confirmMessage={`Marquer les ${idsDuMois.length} créneau(x) de ${label} (tous voituriers) comme payés ?`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    {m.groupes.map((g) => {
                      const ids = g.creneaux.map((c) => c._id);
                      return (
                        <div key={g.valet._id} className="bg-white rounded-card border border-gray-200 overflow-hidden">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                            <div>
                              <h3 className="font-semibold text-ink">
                                {g.valet.prenom} {g.valet.nom}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {g.creneaux.length} créneau(x) à payer — {label}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold text-brand">{fmtPrice(g.total)}</span>
                              <MarquerPayeButton
                                ids={ids}
                                confirmMessage={`Marquer ${ids.length} créneau(x) de ${g.valet.prenom} ${g.valet.nom} (${label}) comme payés ?`}
                              />
                            </div>
                          </div>
                          <CreneauxTable creneaux={g.creneaux} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Historique des paiements</h2>
            <p className="text-sm text-gray-400">Créneaux déjà payés, groupés par mois puis par voiturier.</p>
          </div>
          {historique?.total > 0 && (
            <span className="text-sm text-gray-500">
              Total payé : <span className="font-semibold text-ink">{fmtPrice(historique.total)}</span>
            </span>
          )}
        </div>

        {moisPayes.length === 0 && (
          <div className="bg-white rounded-card border border-gray-200">
            <EmptyState>Aucun paiement enregistré pour le moment.</EmptyState>
          </div>
        )}

        <div className="space-y-8">
          {moisPayes.map((m) => {
            const label = moisLabel(m.annee, m.mois);
            return (
              <section key={`${m.annee}-${m.mois}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-ink">{label}</h3>
                  <span className="text-sm text-gray-500">
                    Payé : <span className="font-semibold text-ink">{fmtPrice(m.total)}</span>
                  </span>
                </div>
                <div className="space-y-5">
                  {m.groupes.map((g) => (
                    <div key={g.valet._id} className="bg-white rounded-card border border-gray-200 overflow-hidden">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-semibold text-ink">
                            {g.valet.prenom} {g.valet.nom}
                          </h4>
                          <p className="text-sm text-gray-400">{g.creneaux.length} créneau(x) payé(s)</p>
                        </div>
                        <span className="text-xl font-bold text-ink">{fmtPrice(g.total)}</span>
                      </div>
                      <CreneauxTable creneaux={g.creneaux} showPayeLe />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
