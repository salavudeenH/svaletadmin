import Link from "next/link";

const ROW_HEIGHT = 44; // px par heure
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function minutesOf(heure) {
  const [h, m] = (heure || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function WeekGrid({ days, evenements }) {
  const totalHeight = HOURS.length * ROW_HEIGHT;

  const parJour = days.map((day) =>
    evenements
      .filter((e) => e.date === day.iso)
      .sort((a, b) => minutesOf(a.heure) - minutesOf(b.heure))
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[860px]">
        {/* Colonne des heures */}
        <div className="w-14 shrink-0 pt-10">
          {HOURS.map((h) => (
            <div key={h} style={{ height: ROW_HEIGHT }} className="text-right pr-2 -translate-y-2">
              <span className="text-[11px] text-gray-400">{String(h).padStart(2, "0")}h</span>
            </div>
          ))}
        </div>

        {/* Colonnes jours */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, i) => (
            <div key={day.iso} className="border-l border-gray-100 first:border-l-0">
              <div className={`h-10 flex flex-col items-center justify-center border-b border-gray-100 ${day.estAujourdhui ? "text-brand" : "text-ink"}`}>
                <span className="text-[11px] uppercase tracking-wide text-gray-400">{day.jourLabel}</span>
                <span className="text-sm font-semibold">{day.jourNum}</span>
              </div>
              <div className="relative" style={{ height: totalHeight }}>
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-50"
                    style={{ top: h * ROW_HEIGHT }}
                  />
                ))}
                {parJour[i].map((e) => {
                  const top = (minutesOf(e.heure) / (24 * 60)) * totalHeight;
                  const isAller = e.type === "aller";
                  return (
                    <Link
                      key={`${e.reservation_id}_${e.type}`}
                      href={`/reservations/${e.reservation_id}`}
                      title={`${e.heure || "?"} · ${e.client || "Client"} · ${e.vehicule || ""}`}
                      className={`absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-[10px] leading-tight text-white overflow-hidden hover:opacity-90 ${
                        isAller ? "bg-brand" : "bg-ink"
                      }`}
                      style={{ top, height: ROW_HEIGHT - 4 }}
                    >
                      <div className="font-semibold tabular-nums">{e.heure || "—"}</div>
                      <div className="truncate">{e.client || "Client"}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
