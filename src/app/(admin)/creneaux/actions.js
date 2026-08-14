"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";

function parseCourses(raw) {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function createCreneauAction(prevState, formData) {
  const valet = formData.get("valet")?.toString();
  const date = formData.get("date")?.toString();
  const courses = parseCourses(formData.get("courses")?.toString());
  const prixFinalRaw = formData.get("prix_final")?.toString();
  const note = formData.get("note")?.toString().trim() || undefined;
  const heureDebut = formData.get("heure_debut")?.toString() || undefined;
  const heureFin = formData.get("heure_fin")?.toString() || undefined;

  if (!valet || !date) {
    return { error: "Choisissez une date et un voiturier." };
  }
  if (!courses || courses.length === 0) {
    return { error: "Sélectionnez au moins une course." };
  }

  try {
    await apiFetch("/admin/creneaux", {
      method: "POST",
      body: {
        valet,
        date,
        courses,
        prix_final: prixFinalRaw ? Number(prixFinalRaw) : undefined,
        note,
        heure_debut: heureDebut,
        heure_fin: heureFin,
      },
    });
  } catch (err) {
    return { error: err.message || "Erreur lors de la création du créneau." };
  }
  revalidatePath("/creneaux");
  redirect("/creneaux");
}

export async function updateCreneauAction(id, prevState, formData) {
  const valet = formData.get("valet")?.toString();
  const date = formData.get("date")?.toString();
  const coursesRaw = formData.get("courses")?.toString();
  const prixFinalRaw = formData.get("prix_final")?.toString();
  const note = formData.get("note")?.toString().trim();
  const heureDebut = formData.get("heure_debut")?.toString();
  const heureFin = formData.get("heure_fin")?.toString();

  const body = { valet, date };
  if (prixFinalRaw) body.prix_final = Number(prixFinalRaw);
  if (note !== undefined) body.note = note;
  if (heureDebut !== undefined) body.heure_debut = heureDebut;
  if (heureFin !== undefined) body.heure_fin = heureFin;

  if (coursesRaw) {
    const courses = parseCourses(coursesRaw);
    if (!courses || courses.length === 0) {
      return { error: "Sélectionnez au moins une course." };
    }
    body.courses = courses;
  }

  try {
    await apiFetch(`/admin/creneaux/${id}`, { method: "PUT", body });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour." };
  }
  revalidatePath("/creneaux");
  revalidatePath(`/creneaux/${id}`);
  redirect("/creneaux");
}

export async function deleteCreneauAction(id) {
  await apiFetch(`/admin/creneaux/${id}`, { method: "DELETE" });
  revalidatePath("/creneaux");
}

export async function updateCreneauSettingsAction(prevState, formData) {
  const body = {
    tarif_course: formData.get("tarif_course"),
    tarif_heure: formData.get("tarif_heure"),
    tarif_nuit_profonde: formData.get("tarif_nuit_profonde"),
    tarif_nuit_matin: formData.get("tarif_nuit_matin"),
    tolerance_minutes: formData.get("tolerance_minutes"),
  };

  try {
    await apiFetch("/admin/creneaux-settings", { method: "PUT", body });
  } catch (err) {
    return { error: err.message || "Erreur lors de la mise à jour des réglages." };
  }
  revalidatePath("/creneaux/parametres");
  return { success: true };
}
