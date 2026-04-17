export function Tag({ emoji, tagLabel }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mend-greenLight px-2 py-0.5 text-xs font-medium text-mend-green">
      <span aria-hidden>{emoji}</span>
      <span>{tagLabel}</span>
    </span>
  )
}
