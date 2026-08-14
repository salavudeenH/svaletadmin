import Link from "next/link";
import { valetApiFetch } from "@/lib/valetApi";
import { valetLogoutAction } from "../actions";
import CoursesList from "./CoursesList";
import Pager from "../_components/Pager";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso, delta) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function fmtDateFR(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function VoiturierCoursesPage({ searchParams }) {
  const params = await searchParams;
  const today = todayISO();
  const minDate = addDays(today, -3);
  const maxDate = addDays(today, 3);
  const requested = params?.date || today;
  // Le voiturier peut naviguer jusqu'à 3 jours avant/après aujourd'hui, pas au-delà.
  const date = requested < minDate ? minDate : requested > maxDate ? maxDate : requested;
  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);
  const canGoPrev = prevDate >= minDate;
  const canGoNext = nextDate <= maxDate;

  const [{ data: valet }, { data: courses }] = await Promise.all([
    valetApiFetch("/me"),
    valetApiFetch(`/courses?date=${date}`),
  ]);

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg text-ink">Courses</h1>
          <p className="text-xs text-gray-400">
            {valet.prenom} {valet.nom}
          </p>
        </div>
        <form action={valetLogoutAction}>
          <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Déconnexion
          </button>
        </form>
      </div>

      <Pager
        label={fmtDateFR(date)}
        prevHref={canGoPrev ? `/voiturier?date=${prevDate}` : null}
        nextHref={canGoNext ? `/voiturier?date=${nextDate}` : null}
      />

      {date !== today && (
        <div className="px-4 py-1.5 text-center">
          <Link href="/voiturier" className="text-xs text-brand hover:underline">
            Revenir à aujourd'hui
          </Link>
        </div>
      )}

      <CoursesList courses={courses} monValetId={valet._id} />
    </div>
  );
}
