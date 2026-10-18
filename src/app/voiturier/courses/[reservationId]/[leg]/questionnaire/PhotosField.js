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
const TENTATIVES = 3;

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Réessaie quelques fois avec une pause croissante : une coupure réseau ponctuelle en 4G/5G
// est fréquente et ne doit pas faire échouer l'envoi.
async function avecReessais(fn) {
  let derniere;
  for (let t = 0; t < TENTATIVES; t++) {
    try {
      return await fn();
    } catch (e) {
      derniere = e;
      if (t < TENTATIVES - 1) await attendre(1000 * (t + 1));
    }
  }
  throw derniere;
}

async function uploadOne(file, uploadUrl) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error(`Échec de l'envoi (${res.status})`);
}

async function demanderAutorisations(reservationId, leg, photoType, files) {
  const res = await fetch(`/api/voiturier/courses/${reservationId}/${leg}/photos/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: photoType,
      files: files.map((f) => ({ filename: f.name, contentType: f.type || "application/octet-stream" })),
    }),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error || "Erreur de préparation de l'envoi");
  return json.data;
}

export default function PhotosField({ reservationId, leg, photoType, value = [], onChange, uploading, setUploading }) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null); // { done, total }
  const [aReessayer, setAReessayer] = useState([]); // fichiers dont l'envoi a échoué
  const inputRef = useRef(null);
  const previewsRef = useRef([]);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  // Libère la mémoire des aperçus quand on quitte l'étape.
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  async function envoyer(files) {
    if (files.length === 0) return;

    setError(null);
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let accumulated = [...valueRef.current];
    const echecs = [];

    try {
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batchFiles = files.slice(i, i + BATCH_SIZE);

        let batchPresigned;
        try {
          batchPresigned = await avecReessais(() => demanderAutorisations(reservationId, leg, photoType, batchFiles));
        } catch {
          // Autorisation impossible pour ce lot (réseau coupé) : on garde ces photos pour réessayer
          // sans abandonner les lots suivants ni celles déjà envoyées.
          echecs.push(...batchFiles);
          setProgress({ done: Math.min(i + BATCH_SIZE, files.length), total: files.length });
          continue;
        }

        const results = await Promise.allSettled(
          batchFiles.map((file, j) => avecReessais(() => uploadOne(file, batchPresigned[j].uploadUrl)))
        );

        const nouvellesCles = [];
        const nouveauxApercus = [];
        results.forEach((r, j) => {
          if (r.status === "fulfilled") {
            nouvellesCles.push(batchPresigned[j].key);
            nouveauxApercus.push(URL.createObjectURL(batchFiles[j]));
          } else {
            echecs.push(batchFiles[j]);
          }
        });

        if (nouvellesCles.length) {
          accumulated = [...accumulated, ...nouvellesCles];
          onChange(accumulated);
          setPreviews((prev) => [...prev, ...nouveauxApercus]);
        }
        setProgress({ done: Math.min(i + BATCH_SIZE, files.length), total: files.length });
      }

      setAReessayer(echecs);
      if (echecs.length) {
        setError(
          `${echecs.length} photo(s) n'ont pas pu être envoyées (connexion instable). Les autres sont bien enregistrées : appuyez sur « Réessayer ».`
        );
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi des photos");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    // Les photos encore en échec restent à réessayer en plus des nouvelles.
    envoyer([...aReessayer, ...files]);
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

      {aReessayer.length > 0 && !uploading && (
        <button
          type="button"
          onClick={() => envoyer(aReessayer)}
          className="w-full mt-3 bg-white text-brand font-semibold rounded-xl py-3"
        >
          Réessayer ({aReessayer.length} photo{aReessayer.length > 1 ? "s" : ""})
        </button>
      )}

      {/* Pas de galerie complète : décoder des dizaines de photos pleine taille ralentit (voire fige)
          le téléphone. On montre seulement les dernières miniatures, et le nombre total envoyé. */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {previews.slice(-MAX_APERCUS).map((src) => (
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
