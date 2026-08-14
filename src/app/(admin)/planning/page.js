import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import WeekGrid from "./WeekGrid";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

function mondayOf(d) {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function addDays(iso, delta) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d;
}

export default async function PlanningPage({ searchParams }) {
  const params = await searchParams;
  const todayISO = toISO(new Date());
  const debut = params?.debut ? mondayOf(new Date(`${params.debut}T00:00:00Z`)) : mondayOf(new Date());
  const debutISO = toISO(debut);
  const finISO = toISO(addDays(debutISO, 6));
  const prevWeekISO = toISO(addDays(debutISO, -7));
  const nextWeekISO = toISO(addDays(debutISO, 7));

  const { data } = await apiFetch(`/admin/stats/semaine?debut=${debutISO}`);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(debutISO, i);
    const iso = toISO(d);
    return {
      iso,
      jourLabel: JOURS[i],
      jourNum: d.getUTCDate(),
      estAujourdhui: iso === todayISO,
    };
  });

  const evenements = (data.evenements || []).map((e) => ({
    ...e,
    date: toISO(new Date(e.date)),
  }));

  return (
    <div>
      <PageHeader
        title="Planning"
        description="Entrées et sorties de véhicules de la semaine — cliquer sur une course ouvre la réservation."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/planning?debut=${prevWeekISO}`}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="Semaine précédente"
            >
              <ChevronLeft size={16} />
            </Link>
            <span className="text-sm text-gray-600 font-medium">
              {new Date(`${debutISO}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "short" })}
              {" – "}
              {new Date(`${finISO}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <Link
              href={`/planning?debut=${nextWeekISO}`}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="Semaine suivante"
            >
              <ChevronRight size={16} />
            </Link>
            {debutISO !== toISO(mondayOf(new Date())) && (
              <Link href="/planning" className="text-xs text-brand hover:underline ml-1">
                Aujourd'hui
              </Link>
            )}
          </div>
        }
      />

      <Card>
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" /> Entrée (prise en charge)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" /> Sortie (restitution)
          </span>
        </div>
        <WeekGrid days={days} evenements={evenements} />
      </Card>
    </div>
  );
}
