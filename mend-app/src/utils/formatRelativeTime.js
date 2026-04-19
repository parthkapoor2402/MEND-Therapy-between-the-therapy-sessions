/** Relative time for Mend Moments (home strip, brief, list). */
export function formatRelativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(ts).toLocaleDateString('en-IN', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
