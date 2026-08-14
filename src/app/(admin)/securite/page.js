import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SecuritePage() {
  const { stats, suspiciousIPs, totalRecords } = await apiFetch("/security/ip-stats");

  return (
    <div>
      <PageHeader title="Sécurité" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <StatCard label="IP suivies" value={stats.totalIPs} />
        <StatCard label="IP bloquées" value={stats.blockedIPs} />
        <StatCard label="IP suspectes" value={stats.suspiciousIPs} />
        <StatCard label="IP saines" value={stats.cleanIPs} />
      </div>

      <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-ink">Top 10 des IP suspectes</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalRecords} adresse{totalRecords > 1 ? "s" : ""} IP suivie{totalRecords > 1 ? "s" : ""} au total (en
            mémoire depuis le dernier redémarrage du serveur).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Violations</th>
                <th className="px-4 py-3 font-medium">Dernière activité</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {suspiciousIPs.map((ip) => (
                <tr key={ip.ip} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{ip.ip}</td>
                  <td className="px-4 py-3">{ip.score}</td>
                  <td className="px-4 py-3">{ip.violations}</td>
                  <td className="px-4 py-3">{formatDateTime(ip.lastSeen)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ip.blocked ? "danger" : "warning"}>
                      {ip.blocked ? "Bloquée" : "Sous surveillance"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {suspiciousIPs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Aucune IP suspecte détectée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
