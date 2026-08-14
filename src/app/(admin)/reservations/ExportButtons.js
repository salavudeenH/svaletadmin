"use client";

import { useState } from "react";
import { STATUT_LABELS, formatDate } from "@/lib/statuts";

async function fetchReservations(filterParams) {
  const query = new URLSearchParams();
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const res = await fetch(`/api/reservations/export?${query.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Erreur lors de l'export");
  return json.data;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsvValue(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function reservationRows(reservations) {
  return reservations.map((r) => ({
    numero: r.numero_reservation || r._id,
    client: `${r.contact_prenom || r.user?.firstname || ""} ${r.contact_nom || r.user?.lastname || ""}`.trim(),
    aller: formatDate(r.date_aller),
    retour: formatDate(r.date_retour),
    voiturier_aller: r.valet_aller ? `${r.valet_aller.prenom} ${r.valet_aller.nom}` : "",
    voiturier_retour: r.valet_retour ? `${r.valet_retour.prenom} ${r.valet_retour.nom}` : "",
    numero_cle: r.numero_cle || "",
    statut: STATUT_LABELS[r.statut] || r.statut,
    montant_total: r.montant_total ?? 0,
  }));
}

export default function ExportButtons({ filterParams }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleCsv = async () => {
    setLoading("csv");
    setError(null);
    try {
      const reservations = await fetchReservations(filterParams);
      const rows = reservationRows(reservations);
      const headers = ["N°", "Client", "Aller", "Retour", "Voiturier aller", "Voiturier retour", "Clé", "Statut", "Montant (€)"];
      const csvLines = [
        headers.map(toCsvValue).join(","),
        ...rows.map((r) =>
          [r.numero, r.client, r.aller, r.retour, r.voiturier_aller, r.voiturier_retour, r.numero_cle, r.statut, r.montant_total]
            .map(toCsvValue)
            .join(",")
        ),
      ];
      const blob = new Blob(["﻿" + csvLines.join("\n")], { type: "text/csv;charset=utf-8" });
      downloadBlob(blob, `reservations-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handlePdf = async () => {
    setLoading("pdf");
    setError(null);
    try {
      const [{ default: jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
      const autoTable = autoTableModule.default;

      const reservations = await fetchReservations(filterParams);
      const rows = reservationRows(reservations);

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.setFontSize(14);
      doc.text("Svalet — Export réservations", 14, 15);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — ${rows.length} réservation(s)`, 14, 21);

      autoTable(doc, {
        startY: 26,
        head: [["N°", "Client", "Aller", "Retour", "Voiturier aller", "Voiturier retour", "Clé", "Statut", "Montant"]],
        body: rows.map((r) => [
          r.numero,
          r.client,
          r.aller,
          r.retour,
          r.voiturier_aller,
          r.voiturier_retour,
          r.numero_cle,
          r.statut,
          `${r.montant_total} €`,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [15, 62, 140] },
      });

      doc.save(`reservations-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        onClick={handleCsv}
        disabled={loading !== null}
        className="text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {loading === "csv" ? "Export..." : "Exporter CSV"}
      </button>
      <button
        onClick={handlePdf}
        disabled={loading !== null}
        className="text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {loading === "pdf" ? "Export..." : "Exporter PDF"}
      </button>
    </div>
  );
}
