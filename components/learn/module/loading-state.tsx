import React from "react";

const BRAND = "learn.sol";

export const LoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-flex items-center font-bold font-space-grotesk text-xl tracking-wide ${className ?? ""}`}
    aria-label="Loading"
    role="status"
  >
    {BRAND.split("").map((char, i) => (
      <span
        key={i}
        className="opacity-0 animate-fade-in"
        style={{ animationDelay: `${i * 0.08 + 0.1}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>
);

// Tailwind CSS: Add this to your globals.css or tailwind.config.ts
// @layer utilities {
//   .animate-fade-in {
//     animation: fadeIn 0.5s forwards;
//   }
//   @keyframes fadeIn {
//     to { opacity: 1; }
//   }
// }
