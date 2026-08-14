"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useActionState } from "react";
import { updateCreneauAction } from "../actions";
import { fmtPrice, LEG_LABELS, MODE_LABELS, MODE_BADGE_CLASSES, courseKey } from "@/lib/creneaux";
import Button from "@/components/ui/Button";

const initialState = { error: null };

function toDateInput(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export default function CreneauForm({ creneau, valets = [] }) {
  const updateAction = updateCreneauAction.bind(null, creneau._id);
  const [state, formAction, pending] = useActionState(updateAction, initialState);

  const [date, setDate] = useState(toDateInput(creneau.date));
  const [valetId, setValetId] = useState(creneau.valet?._id || "");

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  const [selectedKeys, setSelectedKeys] = useState(
    () =>
      new Set(
        (creneau.courses || []).map((c) =>
          courseKey({ reservation: c.reservation?._id || c.reservation, leg: c.leg })
        )
      )
  );

  const [priceDetail, setPriceDetail] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [prixFinal, setPrixFinal] = useState(String(creneau.prix_final ?? ""));

  const debounceRef = useRef(null);
  const isFirstRun = useRef(true);

  // Charger les courses disponibles pour la date (en incluant les courses déjà dans ce créneau).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      setSelectedKeys(new Set());
    }
    if (!date) {
      setCourses([]);
      return;
    }
    setCoursesLoading(true);
    setCoursesError(null);
    fetch(`/api/admin/creneaux/courses-disponibles?date=${date}&exclude=${creneau._id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setCourses(json.data || []);
      })
      .catch((err) => setCoursesError(err.message))
      .finally(() => setCoursesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const selectedCourses = useMemo(
    () => courses.filter((c) => selectedKeys.has(courseKey(c))),
    [courses, selectedKeys]
  );

  const firstRunPrice = useRef(true);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!date || selectedCourses.length === 0) {
      setPriceDetail(null);
      setPriceError(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setPriceLoading(true);
      setPriceError(null);
      try {
        const res = await fetch("/api/admin/creneaux/calculer-prix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            courses: selectedCourses.map((c) => ({ reservation: c.reservation, leg: c.leg })),
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Erreur de calcul du prix");
        setPriceDetail(json.data);
        // Ne pas écraser le prix déjà validé au premier chargement de la page.
        if (!firstRunPrice.current) {
          setPrixFinal(String(json.data.total));
        }
        firstRunPrice.current = false;
      } catch (err) {
        setPriceError(err.message);
      } finally {
        setPriceLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, date]);

  function toggleCourse(c) {
    const key = courseKey(c);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const coursesPayload = JSON.stringify(
    selectedCourses.map((c) => ({ reservation: c.reservation, leg: c.leg }))
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="courses" value={coursesPayload} />

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Date & voiturier</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              name="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voiturier *</label>
            <select
              name="valet"
              required
              value={valetId}
              onChange={(e) => setValetId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Choisir un voiturier</option>
              {valets.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.prenom} {v.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure début créneau</label>
            <input
              name="heure_debut"
              type="time"
              defaultValue={creneau.heure_debut || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin créneau</label>
            <input
              name="heure_fin"
              type="time"
              defaultValue={creneau.heure_fin || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Informatif seulement — n'entre pas dans le calcul du prix, qui reste basé sur les heures des courses
          cochées.
        </p>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-3">
        <h2 className="font-semibold">Courses disponibles ce jour-là</h2>
        {date && coursesLoading && <p className="text-sm text-gray-400">Chargement des courses...</p>}
        {coursesError && <p className="text-sm text-red-600">{coursesError}</p>}
        {date && !coursesLoading && !coursesError && courses.length === 0 && (
          <p className="text-sm text-gray-400">Aucune course disponible pour cette date.</p>
        )}

        {courses.length > 0 && (
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {courses.map((c) => {
              const key = courseKey(c);
              const checked = selectedKeys.has(key);
              return (
                <label
                  key={key}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 ${
                    checked ? "bg-brand/5" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCourse(c)}
                    className="rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="tabular-nums text-gray-500 w-12">{c.heure || "—"}</span>
                  <span className="font-medium">{c.numero_reservation}</span>
                  <span className="text-gray-500">{c.client}</span>
                  <span className="sm:ml-auto px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {LEG_LABELS[c.leg]}
                  </span>
                  {c.parking_nom && <span className="text-xs text-gray-400">{c.parking_nom}</span>}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-4">
        <h2 className="font-semibold">Prix du créneau</h2>

        {priceLoading && <p className="text-sm text-gray-400">Calcul du prix avantageux...</p>}
        {priceError && <p className="text-sm text-red-600">{priceError}</p>}

        {priceDetail && (
          <div className="space-y-1.5">
            {priceDetail.detail.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="tabular-nums w-12">{c.heure}</span>
                <span>{c.numero_reservation} · {LEG_LABELS[c.leg]}</span>
                <span className={`px-1.5 py-0.5 rounded ${MODE_BADGE_CLASSES[c.mode]}`}>{MODE_LABELS[c.mode]}</span>
                <span className="text-gray-400">{c.label}</span>
                <span className="ml-auto font-medium text-gray-700">{fmtPrice(c.prix)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix créneau (€) *</label>
            <input
              name="prix_final"
              type="number"
              step="0.01"
              required
              value={prixFinal}
              onChange={(e) => setPrixFinal(e.target.value)}
              className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          {priceDetail && (
            <span className="text-xs text-gray-400 mb-2.5">Prix suggéré : {fmtPrice(priceDetail.total)}</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5 space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note interne</label>
        <textarea
          name="note"
          rows={2}
          defaultValue={creneau.note || ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <Button type="submit" disabled={pending || selectedCourses.length === 0} className="w-full sm:w-auto">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
