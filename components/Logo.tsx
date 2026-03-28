// components/Logo.tsx
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="11" fill="#f0fdfa"/>
      <rect x="10" y="6" width="13" height="17" rx="2" fill="#0d9488" opacity="0.2"/>
      <rect x="12" y="8" width="13" height="17" rx="2" fill="#0d9488" opacity="0.3"/>
      <rect x="14" y="10" width="13" height="17" rx="2" fill="#ffffff" stroke="#0d9488" strokeWidth="1"/>
      <path d="M17 15h7M17 18.5h5M17 22h6" stroke="#0d9488" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="29" cy="29" r="7" fill="#0d9488"/>
      <path d="M26.5 29l1.8 1.8L31 27" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
