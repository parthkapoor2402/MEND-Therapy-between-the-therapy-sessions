import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockPulsePatterns } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import PageTransition from '../components/ui/PageTransition.jsx'

const WEEK_LABEL = 'Apr 14–20'

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

function PlusCircleIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckSmallIcon({ className = 'h-3.5 w-3.5 text-mend-green' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 12l4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpeechBubbleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-mend-textMuted" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-2l-3 3v-3H9a3 3 0 0 1-3-3V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="mx-auto my-1 h-4 w-4 text-mend-red" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function quoteDisplay(quoteWithSuffix) {
  if (!quoteWithSuffix) return ''
  const [main] = quoteWithSuffix.split(' — ')
  return main?.trim() ?? quoteWithSuffix
}

const PAST_WEEKS = [
  { label: 'Apr 7–13', n: 2 },
  { label: 'Mar 31–Apr 6', n: 4 },
  { label: 'Mar 24–30', n: 3 },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function PulsePage() {
  const navigate = useNavigate()
  const addPulseToBreif = useMendStore((s) => s.addPulseToBreif)

  const [addedToBrief, setAddedToBrief] = useState({})
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleAddToBrief = useCallback(
    (id) => {
      setAddedToBrief((prev) => ({ ...prev, [id]: true }))
      addPulseToBreif(id)
      setToastMessage("✓ Added to Thursday's brief")
      setToastVisible(true)
      window.setTimeout(() => setToastVisible(false), 2000)
    },
    [addPulseToBreif],
  )

  const p1 = mockPulsePatterns[0]
  const p2 = mockPulsePatterns[1]
  const p3 = mockPulsePatterns[2]

  return (
    <PageTransition className="relative flex min-h-screen min-h-[844px] flex-col bg-mend-bg pb-24 font-sans">
      <header className="flex items-center justify-between px-4 pt-10">
        <button
          type="button"
          aria-label="Back to home"
          onClick={() => navigate('/home')}
          className="rounded-full p-2 text-mend-textPrimary transition-colors hover:bg-mend-greenLight active:scale-95"
        >
          <BackArrow />
        </button>
        <span className="text-sm font-semibold text-mend-textPrimary">Weekly Pulse</span>
        <span className="rounded-full border border-mend-border bg-white px-3 py-1 text-xs text-mend-textMuted">
          {WEEK_LABEL}
        </span>
      </header>

      <p className="px-4 pt-4 text-xs font-semibold tracking-widest text-mend-textMuted">
        SUNDAY · YOUR WEEK IN 3 INSIGHTS
      </p>

      <div className="mt-3 px-4">
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #4A7C59, #3A6B49)' }}
        >
          <p className="text-xl font-bold">3 things Mend noticed</p>
          <p className="mt-1 text-sm opacity-80">Across 6 entries this week</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              📝 6 entries
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              😊 4 moods
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              🎤 1 debrief
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 px-4">
        {/* Card 1 — Recurring */}
        <motion.article
          data-testid="pulse-card-recurring"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-mend-border bg-white"
        >
          <div className="flex items-center gap-2 bg-mend-greenLight px-4 py-2">
            <span className="text-base" aria-hidden>
              🔁
            </span>
            <span className="text-xs font-semibold tracking-widest text-mend-green">
              RECURRING PATTERN
            </span>
          </div>
          <div className="px-4 pb-4 pt-3">
            <h2 className="text-sm font-bold text-mend-textPrimary">{p1.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-mend-textMuted">{p1.detail}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p1.contexts?.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-mend-greenLight px-3 py-1 text-xs font-medium text-mend-green"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-3 border-t border-mend-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-mend-textMuted">Spotted across 4 entries</span>
                {addedToBrief[p1.id] ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-mend-green opacity-70">
                    <CheckSmallIcon />
                    Added ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    data-testid="pulse-add-brief-1"
                    onClick={() => handleAddToBrief(p1.id)}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-mend-green transition-opacity hover:opacity-80"
                  >
                    <PlusCircleIcon />
                    Add to brief →
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Card 2 — Shift */}
        <motion.article
          data-testid="pulse-card-shift"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-mend-border bg-white"
        >
          <div className="flex items-center gap-2 bg-mend-warmLight px-4 py-2">
            <span className="text-base" aria-hidden>
              📍
            </span>
            <span className="text-xs font-semibold tracking-widest text-mend-warm">SHIFT POINT</span>
          </div>
          <div className="px-4 pb-4 pt-3">
            <h2 className="text-sm font-bold text-mend-textPrimary">{p2.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-mend-textMuted">{p2.detail}</p>
            <div className="mt-3 flex justify-between gap-1">
              {DAYS.map((d, i) => {
                const isTue = i === 1
                return (
                  <div key={d} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-mend-textMuted">{d}</span>
                    {isTue ? (
                      <motion.span
                        className="h-6 w-6 rounded-full bg-mend-warm"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-mend-border" />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 border-t border-mend-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-mend-textMuted">Spotted across 4 entries</span>
                {addedToBrief[p2.id] ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-mend-green opacity-70">
                    <CheckSmallIcon />
                    Added ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    data-testid="pulse-add-brief-2"
                    onClick={() => handleAddToBrief(p2.id)}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-mend-green transition-opacity hover:opacity-80"
                  >
                    <PlusCircleIcon />
                    Add to brief →
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Card 3 — Regression */}
        <motion.article
          data-testid="pulse-card-regression"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-mend-red/30 bg-mend-redLight"
        >
          <div className="flex items-center gap-2 bg-mend-red px-4 py-2">
            <span className="text-base" aria-hidden>
              ⚠️
            </span>
            <span className="text-xs font-semibold tracking-widest text-white">
              REGRESSION DETECTED
            </span>
          </div>
          <div className="px-4 pb-4 pt-3">
            <h2 className="text-sm font-bold text-mend-textPrimary">{p3.title}</h2>

            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-mend-textMuted">Week 1 · Session 1</p>
              <div className="flex gap-2 rounded-xl border border-mend-border bg-white p-3">
                <SpeechBubbleIcon />
                <p className="text-sm italic text-mend-textPrimary">
                  {quoteDisplay(p3.quote1)}
                </p>
              </div>
              <ChevronDownIcon />
              <p className="text-xs font-medium text-mend-textMuted">This week</p>
              <div className="rounded-xl border border-mend-red/30 bg-white p-3">
                <p className="text-sm italic text-mend-textPrimary">
                  {quoteDisplay(p3.quote2)}
                </p>
              </div>
              <span className="mt-2 self-start rounded-full bg-mend-red/10 px-3 py-1 text-xs font-semibold text-mend-red">
                {p3.detail}
              </span>
            </div>

            <div className="mt-3 border-t border-mend-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-mend-textMuted">Spotted across 4 entries</span>
                {addedToBrief[p3.id] ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-mend-red opacity-70">
                    <CheckSmallIcon className="h-3.5 w-3.5 text-mend-red" />
                    Added ✓
                  </span>
                ) : (
                  <motion.button
                    type="button"
                    data-testid="pulse-add-brief-3"
                    onClick={() => handleAddToBrief(p3.id)}
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-mend-red transition-opacity hover:opacity-80"
                  >
                    <PlusCircleIcon />
                    Add to brief →
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Past weeks */}
      <div className="mt-6 px-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">PAST WEEKS</p>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {PAST_WEEKS.map((w) => (
            <div
              key={w.label}
              className="relative w-32 shrink-0 rounded-xl border border-mend-border bg-white p-3 opacity-50"
            >
              <p className="text-xs font-semibold text-mend-textPrimary">{w.label}</p>
              <p className="mt-1 text-xs text-mend-textMuted">{w.n} patterns</p>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 text-xs font-medium text-mend-textMuted">
                Coming soon
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      <div className="pointer-events-none fixed bottom-24 left-0 right-0 z-40 flex justify-center px-4">
        <AnimatePresence>
          {toastVisible && (
            <motion.div
              data-testid="pulse-toast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-mend-green px-5 py-3 text-sm font-medium text-white shadow-lg"
              role="status"
            >
              <svg className="h-4 w-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 12l4 4 8-8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

export default PulsePage
