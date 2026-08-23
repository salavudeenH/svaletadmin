"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const emptyStatus = { uploading: false, error: null };

export default function PhotosManager({ reservationId, sections }) {
  const router = useRouter();
  const [status, setStatus] = useState({});
  const inputRefs = useRef({});

  async function handleFiles(type, fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setStatus((s) => ({ ...s, [type]: { uploading: true, error: null } }));

    try {
      const presignRes = await fetch(`/api/admin/reservations/${reservationId}/photos/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          files: files.map((f) => ({ filename: f.name, contentType: f.type || "image/jpeg" })),
        }),
      });
      const presignJson = await presignRes.json();
      if (!presignRes.ok || presignJson.error) {
        throw new Error(presignJson.error || "Erreur de préparation de l'upload");
      }
      const presigned = presignJson.data;

      await Promise.all(
        files.map((file, i) =>
          fetch(presigned[i].uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type || "image/jpeg" },
            body: file,
          })
        )
      );

      const addRes = await fetch(`/api/admin/reservations/${reservationId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, keys: presigned.map((p) => p.key) }),
      });
      const addJson = await addRes.json();
      if (!addRes.ok || addJson.error) {
        throw new Error(addJson.error || "Erreur d'enregistrement des photos");
      }

      setStatus((s) => ({ ...s, [type]: emptyStatus }));
      router.refresh();
    } catch (err) {
      setStatus((s) => ({ ...s, [type]: { uploading: false, error: err.message } }));
    }
  }

  async function handleDelete(type, key) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, key }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur de suppression");
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-5">
      {sections.map((section) => {
        const st = status[section.type] || emptyStatus;
        return (
          <div key={section.type} className="mt-3">
            <div className="flex items-center justify-between mb-1 gap-2">
              <p className="text-gray-500 text-sm">{section.label}</p>
              <div>
                <input
                  ref={(el) => (inputRefs.current[section.type] = el)}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(section.type, e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  disabled={st.uploading}
                  onClick={() => inputRefs.current[section.type]?.click()}
                  className="text-xs font-medium text-brand hover:underline disabled:opacity-50"
                >
                  {st.uploading ? "Envoi..." : "+ Ajouter des photos"}
                </button>
              </div>
            </div>

            {st.error && <p className="text-xs text-red-600 mb-1">{st.error}</p>}

            {section.urls && section.urls.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {section.urls.map((url, i) => (
                  <div key={section.keys?.[i] || i} className="relative group">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        alt={`${section.label} ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                      />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(section.type, section.keys?.[i])}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Non renseigné</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
