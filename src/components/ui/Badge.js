const VARIANTS = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-700",
  brand: "bg-brand-light text-brand-dark",
  neutral: "bg-gray-100 text-gray-600",
};

export default function Badge({ variant = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${VARIANTS[variant] || VARIANTS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
