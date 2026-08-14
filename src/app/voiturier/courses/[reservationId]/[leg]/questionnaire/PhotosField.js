"use client";

import { useState, useRef } from "react";

// Redimensionne + compresse côté téléphone avant l'envoi — indispensable vu le volume de photos
// (walkaround complet du véhicule), sans quoi l'upload serait énorme et lent en 4G.
async function compressImage(file, maxDimension = 1600, quality = 0.72) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export default function PhotosField({ reservationId, leg, photoType, value = [], onChange, uploading, setUploading }) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setError(null);
    setUploading(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));

      const presignRes = await fetch(`/api/voiturier/courses/${reservationId}/${leg}/photos/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: photoType,
          files: files.map((f) => ({ filename: f.name, contentType: "image/jpeg" })),
        }),
      });
      const presignJson = await presignRes.json();
      if (!presignRes.ok || presignJson.error) throw new Error(presignJson.error || "Erreur de préparation de l'envoi");

      await Promise.all(
        presignJson.data.map((p, i) =>
          fetch(p.uploadUrl, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: compressed[i] })
        )
      );

      onChange([...value, ...presignJson.data.map((p) => p.key)]);
      setPreviews((prev) => [...prev, ...compressed.map((blob) => URL.createObjectURL(blob))]);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi des photos");
    } finally {
      setUploading(false);
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
        {uploading ? "Envoi en cours..." : "+ Ajouter des photos"}
      </button>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />
          ))}
        </div>
      )}
      {previews.length === 0 && value.length > 0 && (
        <p className="text-white/70 text-sm mt-3">{value.length} photo(s) déjà envoyée(s).</p>
      )}
      {error && <p className="text-white bg-black/20 rounded-lg px-3 py-2 mt-3 text-sm">{error}</p>}
    </div>
  );
}
