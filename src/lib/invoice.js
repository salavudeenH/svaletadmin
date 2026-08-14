// Générateur de facture SVALET (back-office).
// Doit rester identique à la logique TVA du site client (src/app/Components/InvoicePDFGenerator.js
// dans le projet svalet) : SVALET est assujetti à la TVA (20%) depuis le 25/07/2026 (avant :
// franchise en base, art. 293B CGI). Le statut appliqué dépend de la date de paiement de la réservation.
const VAT_EFFECTIVE_DATE = new Date("2026-07-25T00:00:00Z");
const VAT_RATE = 0.20;
const VAT_NUMBER = "FR62982789984";

const isVatApplicable = (reservation) => {
  const ref = reservation?.date_paiement || reservation?.createdAt || reservation?.created;
  return ref ? new Date(ref) >= VAT_EFFECTIVE_DATE : false;
};

const loadImageDataUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function generateInvoicePDF(reservation) {
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PAGE_W = doc.internal.pageSize.getWidth();
  const MARGIN_L = 15;
  const MARGIN_R = 15;
  const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

  const colors = {
    text: [33, 28, 23], // encre
    subtext: [110, 100, 89], // gris texte secondaire
    border: [228, 222, 212], // gris clair (en-tête tableau)
    brand: [226, 117, 43], // orange SVALET
  };

  const fmtPrice = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(n || 0));
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const safe = (s) => (s && String(s).trim().length ? String(s) : "—");

  const invoiceNumber =
    reservation?.numero_reservation || `FACT-${String(reservation?._id || "XXXX").slice(-8).toUpperCase()}`;
  const today = new Date().toLocaleDateString("fr-FR");

  const clientName =
    `${reservation?.contact_prenom || reservation?.user?.firstname || ""} ${
      reservation?.contact_nom || reservation?.user?.lastname || ""
    }`.trim() || "Client SVALET";
  const clientEmail = reservation?.contact_email || reservation?.user?.email || "";
  const clientPhone = reservation?.contact_telephone || reservation?.user?.phone || "";

  const dateAller = fmtDate(reservation?.date_aller);
  const dateRetour = fmtDate(reservation?.date_retour);
  const heureAller = safe(reservation?.heure_aller);
  const heureRetour = safe(reservation?.heure_retour);

  const montantTotal = Number(reservation?.montant_total ?? 0);
  const montantOptions = Number(reservation?.montant_options ?? 0);
  const basePrice = Math.max(0, montantTotal - montantOptions);
  const reduction = Number(reservation?.montant_reduction ?? 0);
  const totalFinal = Math.max(0, montantTotal - reduction);

  // La remise s'applique sur le TTC : on calcule HT/TVA sur le montant plein (avant remise),
  // puis on soustrait la remise du TTC pour obtenir le net à payer.
  const vatApplicable = isVatApplicable(reservation);
  const grossHT = vatApplicable ? montantTotal / (1 + VAT_RATE) : montantTotal;
  const grossTVA = vatApplicable ? montantTotal - grossHT : 0;

  let logoDataUrl = null;
  try {
    logoDataUrl = await loadImageDataUrl("/logo-svalet.png");
  } catch {
    // Pas bloquant : on retombe sur le texte seul si le logo ne charge pas
  }

  // ===== EN-TÊTE =====
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", MARGIN_L, 8, 18, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.text);
    doc.text("SVALET", MARGIN_L + 22, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.subtext);
    doc.text("VOITURIER - PARKING ROISSY CDG", MARGIN_L + 22, 21);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.text);
    doc.text("SVALET", MARGIN_L, 20);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...colors.brand);
  doc.text("FACTURE", PAGE_W - MARGIN_R, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...colors.subtext);
  doc.text(`N° : ${invoiceNumber}`, PAGE_W - MARGIN_R, 27, { align: "right" });
  doc.text(`Date d'émission : ${today}`, PAGE_W - MARGIN_R, 33, { align: "right" });

  // ===== ÉMETTEUR / CLIENT =====
  const drawStack = (x, yStart, lines, align = "left") => {
    let y = yStart;
    for (const ln of lines) {
      if (!ln?.text) continue;
      doc.setFont("helvetica", ln.bold ? "bold" : "normal");
      doc.setFontSize(ln.bold ? 9.5 : 9);
      doc.setTextColor(...(ln.bold ? colors.text : colors.subtext));
      doc.text(ln.text, x, y, { align });
      y += 4.4;
    }
    return y;
  };

  const infoY = 55;
  drawStack(MARGIN_L, infoY, [
    { text: "SVALET / SMEED", bold: true },
    { text: "4 rue Averroès" },
    { text: "95400 Villiers-le-Bel" },
    { text: "Siret : 98278998400019" },
    ...(vatApplicable ? [{ text: `N° TVA : ${VAT_NUMBER}` }] : []),
  ]);

  const clientX = MARGIN_L + CONTENT_W * 0.55;
  drawStack(clientX, infoY, [
    { text: clientName, bold: true },
    ...(clientEmail ? [{ text: clientEmail }] : []),
    ...(clientPhone ? [{ text: `Tél : ${clientPhone}` }] : []),
  ]);

  // ===== TABLEAU =====
  const tableStartY = 90;

  const toHT = (v) => (vatApplicable ? Number(v || 0) / (1 + VAT_RATE) : Number(v || 0));
  const items = [
    [
      "Parking + voiturier Aéroport Roissy CDG",
      `Période : du ${dateAller} à ${heureAller} au ${dateRetour} à ${heureRetour}`,
      "1",
      fmtPrice(toHT(basePrice)),
      fmtPrice(toHT(basePrice)),
    ],
  ];

  if (Array.isArray(reservation?.options) && reservation.options.length) {
    for (const opt of reservation.options) {
      const p = Number(opt?.prix ?? 0) * Number(opt?.qty ?? 1);
      items.push([opt?.nom || "Option", opt?.texte || "", String(opt?.qty ?? 1), fmtPrice(toHT(opt?.prix ?? 0)), fmtPrice(toHT(p))]);
    }
  }

  autoTable(doc, {
    startY: tableStartY,
    head: [["Désignation", "Description", "Qté", "Prix unit. HT", "Total HT"]],
    body: items,
    tableWidth: CONTENT_W,
    margin: { left: MARGIN_L, right: MARGIN_R },
    styles: {
      fontSize: 9,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
      lineWidth: 0,
      textColor: colors.text,
      fillColor: [255, 255, 255],
    },
    headStyles: {
      fillColor: colors.border,
      textColor: colors.text,
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 75 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 22, halign: "right" },
      4: { cellWidth: 23, halign: "right" },
    },
  });

  const afterTableY = doc.lastAutoTable?.finalY || tableStartY + 20;
  doc.setDrawColor(...colors.text);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_L, afterTableY, PAGE_W - MARGIN_R, afterTableY);

  // ===== TOTAUX (HT -> TVA -> TTC, remise sur le TTC) =====
  const totalsW = 75;
  const totalsX = PAGE_W - MARGIN_R - totalsW;

  const rows = vatApplicable
    ? [
        { label: "Total HT", value: grossHT },
        { label: "TVA (20%)", value: grossTVA },
        reduction > 0
          ? { label: "Total TTC", value: montantTotal }
          : { label: "Total TTC", value: montantTotal, bold: true, final: true },
        ...(reduction > 0
          ? [
              { label: "Remise", value: -reduction },
              { label: "Net à payer", value: totalFinal, bold: true, final: true },
            ]
          : []),
      ]
    : [
        { label: "Total HT", value: montantTotal, bold: reduction === 0, final: reduction === 0 },
        ...(reduction > 0
          ? [
              { label: "Remise", value: -reduction },
              { label: "Net à payer", value: totalFinal, bold: true, final: true },
            ]
          : []),
      ];

  let ty = afterTableY + 8;
  doc.setDrawColor(...colors.text);
  doc.setLineWidth(0.3);
  doc.line(totalsX, ty, totalsX + totalsW, ty);

  rows.forEach((r) => {
    ty += 7;
    doc.setFont("helvetica", r.bold ? "bold" : "normal");
    doc.setFontSize(r.final ? 10.5 : 9);
    doc.setTextColor(...(r.bold ? colors.text : colors.subtext));
    doc.text(r.label, totalsX + 2, ty);
    doc.setTextColor(...colors.text);
    doc.text(fmtPrice(r.value), totalsX + totalsW - 2, ty, { align: "right" });
    doc.setDrawColor(...colors.text);
    doc.setLineWidth(r.final ? 0.5 : 0.2);
    doc.line(totalsX, ty + 2.2, totalsX + totalsW, ty + 2.2);
  });

  // ===== MENTION LÉGALE (franchise en base, obligatoire hors TVA) =====
  if (!vatApplicable) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...colors.subtext);
    doc.text("TVA non applicable, art. 293 B du Code Général des Impôts.", MARGIN_L, ty + 10);
  }

  // ===== PIED DE PAGE =====
  const footerY = 272;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  doc.text("SMEED", PAGE_W / 2, footerY, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.6);
  doc.setTextColor(...colors.subtext);
  doc.text("4 rue Averroès, 95400 Villiers-le-Bel", PAGE_W / 2, footerY + 4.5, { align: "center" });
  const siretLine = vatApplicable
    ? `Numéro de SIRET : 98278998400019 — N° TVA : ${VAT_NUMBER}`
    : "Numéro de SIRET : 98278998400019";
  doc.text(siretLine, PAGE_W / 2, footerY + 9, { align: "center" });

  const fileName = `Facture_SVALET_${invoiceNumber}.pdf`;

  const pdfBlob = doc.output("blob");
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
