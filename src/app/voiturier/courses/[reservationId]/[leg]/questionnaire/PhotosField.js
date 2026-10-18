"use client";

import { useState, useRef, useEffect } from "react";

// Aucune compression : une photo redimensionnée/recompressée peut faire disparaître une rayure
// fine sur la carrosserie, ce qui est justement ce que ces photos doivent prouver.
// On envoie les fichiers par petits lots plutôt que tous d'un coup : au-delà
// d'une poignée d'envois simultanés (ex. 60 photos sélectionnées en une fois), la connexion
// mobile sature et les requêtes échouent en cascade — d'où le besoin de traiter par paquets et
// d'enregistrer au fur et à mesure, pour ne jamais perdre les photos déjà envoyées avec succès.
const BATCH_SIZE = 5;
const MAX_APERCUS = 8;

async function uploadOne(file, uploadUrl) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error(`Échec de l'envoi (${res.status})`);
}

async function uploadWithRetry(file, uploadUrl) {
  try {
    await uploadOne(file, uploadUrl);
  } catch {
    // Un échec réseau ponctuel en 4G/5G est fréquent — on retente une fois avant d'abandonner.
    await uploadOne(file, uploadUrl);
  }
}

export default function PhotosField({ reservationId, leg, photoType, value = [], onChange, uploading, setUploading }) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null); // { done, total }
  const inputRef = useRef(null);
  const previewsRef = useRef([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  // Libère la mémoire des aperçus quand on quitte l'étape.
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setError(null);
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let accumulated = [...value];
    const echouees = [];

    try {
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const originaux = files.slice(i, i + BATCH_SIZE);
        const batchFiles = originaux;

        const presignRes = await fetch(`/api/voiturier/courses/${reservationId}/${leg}/photos/presign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: photoType,
            files: batchFiles.map((f) => ({ filename: f.name, contentType: f.type || "application/octet-stream" })),
          }),
        });
        const presignJson = await presignRes.json();
        if (!presignRes.ok || presignJson.error) throw new Error(presignJson.error || "Erreur de préparation de l'envoi");
        const batchPresigned = presignJson.data;

        const results = await Promise.allSettled(
          batchFiles.map((file, j) => uploadWithRetry(file, batchPresigned[j].uploadUrl))
        );

        const nouvellesCles = [];
        const nouveauxApercus = [];
        results.forEach((r, j) => {
          if (r.status === "fulfilled") {
            nouvellesCles.push(batchPresigned[j].key);
            nouveauxApercus.push(URL.createObjectURL(batchFiles[j]));
          } else {
            echouees.push(batchFiles[j].name);
          }
        });

        if (nouvellesCles.length) {
          accumulated = [...accumulated, ...nouvellesCles];
          onChange(accumulated);
          setPreviews((prev) => [...prev, ...nouveauxApercus]);
        }
        setProgress({ done: Math.min(i + BATCH_SIZE, files.length), total: files.length });
      }

      if (echouees.length) {
        setError(
          `${echouees.length} photo(s) sur ${files.length} n'ont pas pu être envoyées (${echouees.join(", ")}). Les autres ont bien été enregistrées — réessayez pour celles-ci.`
        );
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi des photos");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-white/50 rounded-xl py-6 text-white font-medium disabled:opacity-60"
      >
        {uploading
          ? progress
            ? `Envoi en cours... ${progress.done} / ${progress.total}`
            : "Envoi en cours..."
          : "+ Ajouter des photos"}
      </button>

      {/* Pas de galerie complète : décoder des dizaines de photos pleine taille ralentit (voire fige)
          le téléphone. On montre seulement les dernières miniatures, et le nombre total envoyé. */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {previews.slice(-MAX_APERCUS).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" decoding="async" loading="lazy" className="w-full aspect-square object-cover rounded-lg" />
          ))}
        </div>
      )}
      {value.length > 0 && (
        <p className="text-white/70 text-sm mt-3">
          {value.length} photo(s) envoyée(s)
          {previews.length > MAX_APERCUS ? ` — ${MAX_APERCUS} dernières affichées` : ""}.
        </p>
      )}
      {error && <p className="text-white bg-black/20 rounded-lg px-3 py-2 mt-3 text-sm">{error}</p>}
    </div>
  );
}
