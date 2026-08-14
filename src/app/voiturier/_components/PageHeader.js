import Link from "next/link";

export default function PageHeader({ title, subtitle, backHref, action }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
      {backHref && (
        <Link href={backHref} className="text-ink text-xl leading-none" aria-label="Retour">
          ←
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-lg text-ink truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 capitalize truncate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
