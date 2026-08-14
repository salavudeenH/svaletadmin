export default function Card({ children, className = "", padded = true }) {
  return (
    <div className={`bg-white rounded-card border border-gray-200 ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}
