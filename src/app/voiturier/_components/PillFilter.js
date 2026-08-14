import Link from "next/link";

function pillClass(active) {
  return `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
    active ? "bg-ink text-white" : "bg-gray-100 text-gray-500"
  }`;
}

export function PillLink({ href, active, children }) {
  return (
    <Link href={href} className={pillClass(active)}>
      {children}
    </Link>
  );
}

export function PillButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={pillClass(active)}>
      {children}
    </button>
  );
}

export default function PillFilter({ children }) {
  return <div className="px-4 py-2.5 flex gap-2 bg-white border-b border-gray-200 overflow-x-auto">{children}</div>;
}
