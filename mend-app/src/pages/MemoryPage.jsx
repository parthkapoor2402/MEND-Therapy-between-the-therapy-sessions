import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockDebriefEntries } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import { PrivacyBadge } from '../components/PrivacyBadge.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ChevronIcon({ expanded }) {
  return (
    <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
      <svg className="h-5 w-5 text-mend-textMuted" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.span>
  )
}

export function MemoryPage() {
  const navigate = useNavigate()
  const allDebriefs = useMendStore((s) => s.allDebriefs)
  const restartFromYourDostDiscovery = useMendStore((s) => s.restartFromYourDostDiscovery)
  const [expandedId, setExpandedId] = useState(null)

  const reversed = [...allDebriefs].reverse()
  const primaryBtnClass =
    'mt-6 min-h-[48px] rounded-full bg-mend-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mend-green/90 active:bg-mend-green/80'

  return (
    <PageTransition className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg font-sans">
      <div className="flex shrink-0 items-center gap-2 px-4 pt-3">
        <button
          type="button"
          aria-label="Back to home"
          onClick={() => navigate('/home')}
          className="rounded-full p-2 text-mend-textPrimary transition-colors hover:bg-mend-greenLight active:scale-95"
        >
          <BackArrow />
        </button>
        <span className="min-w-0 flex-1 text-sm font-semibold text-mend-textPrimary">Memory Jar</span>
        <button
          type="button"
          className="shrink-0 text-xs text-mend-blue transition-opacity hover:opacity-80"
          aria-label="Refresh memory jar"
          onClick={() => {
            setExpandedId(null)
            void useMendStore.persist.rehydrate()
          }}
        >
          Refresh
        </button>
      </div>
      <div className="mt-2 flex justify-center px-4">
        <PrivacyBadge className="!mt-0" />
      </div>

      {allDebriefs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
          <p className="text-6xl" aria-hidden>
            🫙
          </p>
          <p className="mt-4 text-lg font-bold text-mend-textPrimary">Your jar is empty</p>
          <p className="mt-2 text-sm text-mend-textMuted">Complete a debrief to start capturing.</p>
          <button type="button" className={primaryBtnClass} onClick={() => navigate('/debrief')}>
            Start debrief
          </button>
        </div>
      ) : (
        <>
          <p className="px-4 pt-4 text-xs font-semibold tracking-widest text-mend-textMuted">
            {allDebriefs.length} sessions captured
          </p>
          <div className="mt-2 pb-6">
            {reversed.map((d, index) => {
              const sessionNum = allDebriefs.length - index
              const expanded = expandedId === d.id
              const dateLabel = new Date(d.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <div key={d.id} className="mb-3 overflow-hidden rounded-2xl border border-mend-border bg-white px-4 shadow-sm">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedId(expanded ? null : d.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setExpandedId(expanded ? null : d.id)
                      }
                    }}
                    className="flex cursor-pointer items-center justify-between py-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mend-greenLight">
                        <span className="text-xs font-bold text-mend-green">{sessionNum}</span>
                      </div>
                      <p className="ml-3 text-sm font-semibold text-mend-textPrimary">
                        Session {sessionNum}
                        <span className="ml-2 text-xs font-normal text-mend-textMuted">{dateLabel}</span>
                      </p>
                    </div>
                    <ChevronIcon expanded={expanded} />
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden border-t border-mend-border"
                      >
                        <div className="flex flex-col gap-3 px-0 pb-4 pt-2">
                          {mockDebriefEntries.map((entry) => {
                            const text = d.answers[entry.prompt] ?? ''
                            return (
                              <div key={entry.id} className="flex items-start gap-3">
                                <span className="w-8 shrink-0 text-lg" aria-hidden>
                                  {entry.tag}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-mend-textMuted">{entry.tagLabel}</p>
                                  <p className="mt-0.5 text-sm text-mend-textPrimary">{text || '—'}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
          <div className="border-t border-mend-border px-4 pb-24 pt-4">
            <button
              type="button"
              className="w-full rounded-2xl border border-mend-red/25 bg-white px-4 py-3 text-left text-sm text-mend-red shadow-sm transition-colors hover:bg-mend-redLight/25"
              onClick={() => {
                if (
                  window.confirm(
                    'Clear your entire memory jar and Mend progress, then open the YourDOST home screen again? This cannot be undone.',
                  )
                ) {
                  restartFromYourDostDiscovery()
                  navigate('/', { replace: true })
                }
              }}
            >
              <span className="font-semibold">Start fresh from YourDOST</span>
              <span className="mt-1 block text-xs font-normal text-mend-textMuted">
                Removes all saved sessions, brief, and pulse data and takes you back to discovery.
              </span>
            </button>
          </div>
        </>
      )}
    </PageTransition>
  )
}

export default MemoryPage
