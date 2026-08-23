import { apiFetch } from "@/lib/api";
import { fmtPrice, fmtDateFR, LEG_LABELS } from "@/lib/creneaux";
import MarquerPayeButton from "./MarquerPayeButton";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default async function PaiementPage() {
  const [{ data: groupes }, { data: historique }] = await Promise.all([
    apiFetch("/admin/creneaux/impayes"),
    apiFetch("/admin/creneaux/payes"),
  ]);

  return (
    <div>
      <PageHeader title="Paiement" description="Créneaux non payés, groupés par voiturier." />

      {(groupes || []).length === 0 && (
        <div className="bg-white rounded-card border border-gray-200">
          <EmptyState>Tous les créneaux sont payés.</EmptyState>
        </div>
      )}

      <div className="space-y-5">
        {(groupes || []).map((g) => {
          const ids = g.creneaux.map((c) => c._id);
          return (
            <div key={g.valet._id} className="bg-white rounded-card border border-gray-200 overflow-hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-semibold text-ink">{g.valet.prenom} {g.valet.nom}</h2>
                  <p className="text-sm text-gray-400">{g.creneaux.length} créneau(x) à payer</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-brand">{fmtPrice(g.total)}</span>
                  <MarquerPayeButton ids={ids} valetNom={`${g.valet.prenom} ${g.valet.nom}`} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {g.creneaux.map((c) => (
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
                        <td className="px-4 sm:px-5 py-2.5 text-right font-medium whitespace-nowrap">{fmtPrice(c.prix_final)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Historique des paiements</h2>
            <p className="text-sm text-gray-400">Créneaux déjà payés, groupés par voiturier.</p>
          </div>
          {historique?.total > 0 && (
            <span className="text-sm text-gray-500">
              Total payé : <span className="font-semibold text-ink">{fmtPrice(historique.total)}</span>
            </span>
          )}
        </div>

        {(historique?.groupes || []).length === 0 && (
          <div className="bg-white rounded-card border border-gray-200">
            <EmptyState>Aucun paiement enregistré pour le moment.</EmptyState>
          </div>
        )}

        <div className="space-y-5">
          {(historique?.groupes || []).map((g) => (
            <div key={g.valet._id} className="bg-white rounded-card border border-gray-200 overflow-hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-ink">{g.valet.prenom} {g.valet.nom}</h3>
                  <p className="text-sm text-gray-400">{g.creneaux.length} créneau(x) payé(s)</p>
                </div>
                <span className="text-xl font-bold text-ink">{fmtPrice(g.total)}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {g.creneaux.map((c) => (
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
                        <td className="px-4 sm:px-5 py-2.5 whitespace-nowrap text-xs text-gray-400">
                          {c.paye_le ? `Payé le ${fmtDateFR(c.paye_le)}` : ""}
                        </td>
                        <td className="px-4 sm:px-5 py-2.5 text-right font-medium whitespace-nowrap">{fmtPrice(c.prix_final)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
