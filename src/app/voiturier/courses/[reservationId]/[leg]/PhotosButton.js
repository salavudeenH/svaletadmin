"use client";

import { useState } from "react";
import { Camera, ChevronDown } from "lucide-react";

export default function PhotosButton({ label, urls = [] }) {
  const [open, setOpen] = useState(false);

  if (urls.length === 0) {
    return (
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm text-gray-400 italic">Aucune photo</div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-ink"
      >
        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Camera size={16} />
        </span>
        {label} ({urls.length})
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="grid grid-cols-3 gap-2 mt-2 ml-10">
          {urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
