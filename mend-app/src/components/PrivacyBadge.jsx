export function PrivacyBadge({ className = '' }) {
  return (
    <div
      className={`mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-mend-green/30 bg-mend-greenLight px-4 py-2 ${className}`}
    >
      <span className="text-sm" aria-hidden>
        🔒
      </span>
      <span className="text-xs font-semibold text-mend-green">Private by design</span>
    </div>
  )
}
