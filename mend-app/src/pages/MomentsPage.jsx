import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMendStore } from '../store/useMendStore.js'
import { formatRelativeTime } from '../utils/formatRelativeTime.js'

function BackArrowWhite() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4 text-white/30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1-3h10l1 3M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

function groupLabel(ts) {
  const d = new Date(ts)
  const t0 = startOfDay(new Date())
  const t1 = t0 - 86400000
  const day = startOfDay(d)
  if (day === t0) return 'TODAY'
  if (day === t1) return 'YESTERDAY'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function groupMoments(moments) {
  const sorted = [...moments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const map = new Map()
  for (const m of sorted) {
    const label = groupLabel(m.timestamp)
    if (!map.has(label)) map.set(label, [])
    map.get(label).push(m)
  }
  return Array.from(map.entries())
}

export function MomentsPage() {
  const navigate = useNavigate()
  const moments = useMendStore((s) => s.moments)
  const deleteMoment = useMendStore((s) => s.deleteMoment)

  const groups = groupMoments(moments)

  return (
    <div className="flex min-h-screen min-h-[844px] flex-col bg-[#1A2420] pb-24 font-sans">
      <header className="flex items-center justify-between px-6 pb-4 pt-10">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="rounded-full p-2 text-white hover:bg-white/10"
        >
          <BackArrowWhite />
        </button>
        <div className="flex items-center gap-1">
          <span aria-hidden>⚡</span>
          <span className="text-base font-bold text-white">Mend Moments</span>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
          {moments.length} captured
        </span>
      </header>

      <div className="px-4 pt-2">
        {moments.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center">
            <span className="text-5xl" aria-hidden>
              ⚡
            </span>
            <p className="mt-4 text-lg font-bold text-white">Nothing captured yet</p>
            <p className="mt-2 px-8 text-center text-sm text-white/40">
              Tap the ⚡ button on home when something comes up
            </p>
            <button
              type="button"
              className="mt-6 rounded-2xl bg-mend-green px-6 py-3 font-medium text-white"
              onClick={() => navigate('/moment')}
            >
              Capture your first Moment
            </button>
          </div>
        ) : (
          groups.map(([label, items]) => (
            <div key={label}>
              <p className="mb-2 mt-4 text-xs tracking-widest text-white/30">{label}</p>
              {items.map((moment, index) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-3 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="w-1 shrink-0 self-stretch rounded-l-2xl bg-mend-green" />
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <span className="text-lg">{moment.tagEmoji}</span>
                        <span className="text-sm font-semibold text-white">{moment.momentLabel}</span>
                      </div>
                      <span className="shrink-0 text-xs text-white/30">
                        {formatRelativeTime(moment.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm italic leading-relaxed text-white/60">
                      &quot;{moment.keyCapture}&quot;
                    </p>
                    {moment.patternDetected && moment.patternLabel ? (
                      <p className="mt-2 text-xs font-medium text-mend-green">
                        🔁 {moment.patternLabel}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-white/30">📋 In next brief</span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        className="ml-auto rounded-full p-1"
                        aria-label="Delete moment"
                        onClick={() => {
                          if (window.confirm('Remove this moment?')) {
                            deleteMoment(moment.id)
                          }
                        }}
                      >
                        <TrashIcon />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MomentsPage
