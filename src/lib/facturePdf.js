// Facture émise par un voiturier (auto-entrepreneur) à SMEED — mise en page simple, sans style.
const CLIENT = {
  nom: "SMEED",
  adresse: "4 RUE AVERROES, 95400 VILLIERS-LE-BEL",
  siret: "98278998400019",
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const fmtEur = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(n || 0));
const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });

export async function telechargerFacture(facture) {
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const L = 15;
  const R = W - 15;
  const e = facture.emetteur || {};

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURE", L, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`N° : ${facture.numero}`, R, 18, { align: "right" });
  doc.text(`Date : ${new Date(facture.date_facture).toLocaleDateString("fr-FR")}`, R, 24, { align: "right" });

  // Émetteur (le voiturier)
  let y = 40;
  doc.setFont("helvetica", "bold");
  doc.text(`${e.prenom || ""} ${e.nom || ""}`.trim(), L, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text(e.adresse || "Adresse : non renseignée", L, y);
  y += 5;
  doc.text(`SIRET : ${e.siret || "non renseigné"}`, L, y);

  // Client (SMEED)
  let yc = 40;
  const xc = 115;
  doc.setFont("helvetica", "bold");
  doc.text(CLIENT.nom, xc, yc);
  doc.setFont("helvetica", "normal");
  yc += 5;
  doc.text(CLIENT.adresse, xc, yc);
  yc += 5;
  doc.text(`SIRET : ${CLIENT.siret}`, xc, yc);

  const moisLabel = `${MOIS[facture.mois - 1]} ${facture.annee}`;
  doc.setFont("helvetica", "bold");
  doc.text(`Objet : Prestation du ${moisLabel}`, L, 68);

  const lignes = [
    ...(facture.creneaux || []).map((c) => [
      `Créneau du ${fmtDate(c.date)}${c.heure_debut && c.heure_fin ? ` (${c.heure_debut}–${c.heure_fin})` : ""} — ${c.nb_courses || 0} course(s)`,
      "1",
      fmtEur(c.montant),
      fmtEur(c.montant),
    ]),
    ...(facture.frais || []).map((f) => [`Frais du ${fmtDate(f.date)} : ${f.libelle}`, "1", fmtEur(f.montant), fmtEur(f.montant)]),
  ];

  autoTable(doc, {
    startY: 75,
    head: [["Description", "Qté", "Prix unitaire", "Montant"]],
    body: lignes,
    margin: { left: L, right: 15 },
    styles: { font: "helvetica", fontSize: 9.5, textColor: 0, lineColor: 0, lineWidth: 0.1 },
    headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: "bold" },
    columnStyles: { 1: { halign: "center", cellWidth: 14 }, 2: { halign: "right", cellWidth: 30 }, 3: { halign: "right", cellWidth: 30 } },
  });

  let ty = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total à payer", R - 60, ty);
  doc.text(fmtEur(facture.total), R, ty, { align: "right" });

  ty += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("TVA non applicable, art. 293 B du Code Général des Impôts.", L, ty);
  ty += 5;
  doc.text(`Facture réglée le ${new Date(facture.date_facture).toLocaleDateString("fr-FR")}.`, L, ty);

  doc.save(`${facture.numero}.pdf`);
}
