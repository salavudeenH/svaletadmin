"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const input = "w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand bg-white";

export default function NouveauFraisForm({ mois }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [montant, setMontant] = useState("");
  const [libelle, setLibelle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!file) return setError("Ajoutez la photo du justificatif.");
    setLoading(true);
    try {
      const presignRes = await fetch("/api/voiturier/frais/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "image/jpeg" }),
      });
      const presign = await presignRes.json();
      if (!presignRes.ok || presign.error) throw new Error(presign.error || "Erreur de préparation de l'envoi");

      const up = await fetch(presign.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!up.ok) throw new Error("Échec de l'envoi de la photo, réessayez.");

      const res = await fetch("/api/voiturier/frais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, montant: Number(montant), libelle, photo: presign.data.key }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur lors de l'enregistrement");
      router.push(`/voiturier/cagnotte/frais?mois=${date.slice(0, 7)}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="px-4 py-5 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={input} />
        <p className="text-xs text-gray-400 mt-1">Le frais est compté dans la cagnotte du mois de cette date.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
        <input required value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Ex : dépose-minute, Uber…" className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
        <input type="number" inputMode="decimal" step="0.01" min="0.01" required value={montant} onChange={(e) => setMontant(e.target.value)} className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Justificatif (photo)</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl py-5 text-gray-600 font-medium">
          {file ? "Changer la photo" : "+ Ajouter la photo"}
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="" className="mt-3 w-full max-h-64 object-contain rounded-xl border border-gray-200 bg-white" />}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl px-4 py-3.5 disabled:opacity-60">
        {loading ? "Envoi..." : "Enregistrer le frais"}
      </button>
    </form>
  );
}
