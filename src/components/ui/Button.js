import Link from "next/link";

const VARIANTS = {
  primary: "bg-brand hover:bg-brand-dark text-white",
  secondary: "bg-white hover:bg-gray-50 text-ink border border-gray-300",
  danger: "bg-white hover:bg-red-50 text-red-600 border border-red-200",
  ghost: "text-gray-500 hover:text-brand hover:underline",
};

export default function Button({ href, variant = "primary", className = "", children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
