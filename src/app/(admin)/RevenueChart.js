const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function formatEuros(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    value
  );
}

export default function RevenueChart({ parMois }) {
  const max = Math.max(...parMois.map((m) => m.chiffre_affaires), 1);
  const maxIndex = parMois.reduce((best, m, i) => (m.chiffre_affaires > parMois[best].chiffre_affaires ? i : best), 0);
  const mid = max / 2;

  return (
    <div className="relative">
      <div className="flex text-xs text-gray-400 mb-1">
        <div className="w-12 shrink-0" />
        <div className="flex-1 flex items-end" style={{ height: 160 }}>
          {/* gridlines */}
          <div className="absolute left-12 right-0 border-t border-gray-100" style={{ bottom: 24 }} />
          <div className="absolute left-12 right-0 border-t border-gray-100" style={{ bottom: 24 + 80 }} />
        </div>
      </div>

      <div className="flex">
        <div className="w-12 shrink-0 flex flex-col justify-between text-xs text-gray-400" style={{ height: 160 }}>
          <span>{formatEuros(max)}</span>
          <span>{formatEuros(mid)}</span>
          <span>0</span>
        </div>

        <div className="flex-1 flex items-end gap-[2px]" style={{ height: 160 }}>
          {parMois.map((m, i) => {
            const pct = Math.max((m.chiffre_affaires / max) * 100, m.chiffre_affaires > 0 ? 2 : 0);
            return (
              <div key={m.mois} className="relative flex-1 group flex flex-col justify-end h-full">
                {i === maxIndex && m.chiffre_affaires > 0 && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {formatEuros(m.chiffre_affaires)}
                  </span>
                )}
                <div
                  className="w-full bg-brand rounded-t-[4px] transition-colors group-hover:bg-brand-dark"
                  style={{ height: `${pct}%` }}
                />
                <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {MONTH_LABELS[m.mois - 1]} — {formatEuros(m.chiffre_affaires)} ({m.nombre_reservations} résa)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex mt-1">
        <div className="w-12 shrink-0" />
        <div className="flex-1 flex gap-[2px]">
          {parMois.map((m) => (
            <div key={m.mois} className="flex-1 text-center text-xs text-gray-400">
              {MONTH_LABELS[m.mois - 1]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
