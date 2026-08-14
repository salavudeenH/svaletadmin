import Link from "next/link";

export default function Pager({ label, prevHref, nextHref }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-2 bg-gray-50 border-b border-gray-200">
      {prevHref ? (
        <Link
          href={prevHref}
          className="w-9 h-9 flex items-center justify-center rounded-full text-ink hover:bg-gray-200"
          aria-label="Précédent"
        >
          ←
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300">←</span>
      )}

      <span className="text-sm font-medium text-ink capitalize text-center flex-1">{label}</span>

      {nextHref ? (
        <Link
          href={nextHref}
          className="w-9 h-9 flex items-center justify-center rounded-full text-ink hover:bg-gray-200"
          aria-label="Suivant"
        >
          →
        </Link>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300">→</span>
      )}
    </div>
  );
}
