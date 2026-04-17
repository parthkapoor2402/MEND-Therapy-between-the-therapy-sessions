export function ProgressDots({ total, active }) {
  return (
    <div
      className="flex justify-center gap-2"
      role="list"
      aria-label="Onboarding progress"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          data-testid={`progress-dot-${i}`}
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            i <= active ? 'bg-mend-green' : 'bg-mend-border'
          }`}
        />
      ))}
    </div>
  )
}
