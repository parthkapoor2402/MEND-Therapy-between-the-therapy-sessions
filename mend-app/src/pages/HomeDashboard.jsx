import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockDebriefEntries, mockPulsePatterns, mockUser } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import { Tag } from '../components/ui/Tag.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'

const THERAPIST_INITIALS = 'MN'

function BellIcon() {
  return (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIconSmall() {
  return (
    <svg className="h-3 w-3 shrink-0 text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIconBlue() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="#3B82F6" strokeWidth="2" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ClockIconMuted() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIconWhite() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ChartBarsGreen() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 18V10M12 18V6M19 18v-5" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronRightMuted() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HomeDashboard() {
  const navigate = useNavigate()
  const briefGenerated = useMendStore((s) => s.briefGenerated)

  const firstName = mockUser.name.split(' ')[0]
  const sessionLine = `${mockUser.nextSessionDate} · ${mockUser.nextSessionTime}`
  const memorySlice = mockDebriefEntries.slice(0, 3)
  const patternCount = mockPulsePatterns.length

  return (
    <PageTransition className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg font-sans">
      <div className="flex min-h-screen flex-col overflow-y-auto pb-24">
        {/* Section 1 — Header */}
        <div className="overflow-hidden rounded-b-3xl">
          <div
            className="px-6 pb-16 pt-10"
            style={{ background: 'linear-gradient(135deg, #4A7C59 0%, #3A6B49 100%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">mend</span>
              <button
                type="button"
                aria-label="Notifications"
                className="rounded-full p-1 transition-opacity hover:opacity-90 active:opacity-80"
              >
                <BellIcon />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xl font-semibold text-white">
                Good evening, {firstName} 👋
              </p>
              <p className="mt-1 text-sm text-white/70">Thursday session in 2 days</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <LockIconSmall />
              <span className="text-xs text-white/90">Nothing recording right now</span>
            </div>
          </div>
        </div>

        {/* Section 2 — Session card */}
        <div className="-mt-10 px-4">
          <div className="rounded-2xl border border-mend-border bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold tracking-widest text-mend-textMuted">
                NEXT SESSION
              </span>
              <span className="rounded-full bg-mend-greenLight px-2 py-0.5 text-xs font-medium text-mend-green">
                Confirmed
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mend-ydTeal to-mend-green text-sm font-bold text-white">
                {THERAPIST_INITIALS}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-mend-textPrimary">{mockUser.therapistName}</p>
                <p className="text-sm text-mend-textMuted">{sessionLine}</p>
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-mend-ydTealLight px-3 py-1 text-xs font-medium text-mend-ydTeal">
              via YourDost
            </span>
            <div className="mb-3 mt-3 border-t border-mend-border" />
            <div className="flex items-center gap-2 py-1">
              <CalendarIconBlue />
              <button
                type="button"
                className="cursor-pointer text-sm text-mend-blue transition-opacity hover:opacity-80 active:opacity-70"
                aria-label="Add to calendar"
              >
                Add to calendar
              </button>
            </div>
            <div className="flex items-center gap-2 py-1">
              <ClockIconMuted />
              <span className="text-sm text-mend-textMuted">Brief ready Wednesday evening</span>
            </div>
          </div>
        </div>

        {/* Section 3 — Today */}
        <div className="mt-6 px-4">
          <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">TODAY</p>
          {!briefGenerated ? (
            <div className="rounded-2xl border border-mend-warm/30 bg-mend-warmLight p-5">
              <div className="flex items-start">
                <span className="text-2xl" aria-hidden>
                  🎤
                </span>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-base font-bold text-mend-textPrimary">Debrief your last session</p>
                  <p className="mt-2 text-sm text-mend-textMuted">
                    You haven&apos;t captured your session yet. Takes 3 minutes.
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full min-h-[48px] rounded-full bg-mend-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mend-green/90 active:bg-mend-green/80"
                    aria-label="Start debrief"
                    onClick={() => navigate('/debrief')}
                  >
                    Start Debrief →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-mend-green/20 bg-mend-greenLight p-5">
              <div className="flex items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mend-green">
                  <CheckIconWhite />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-base font-bold text-mend-textPrimary">Session debriefed ✓</p>
                  <p className="mt-2 text-sm text-mend-textMuted">
                    Your brief is being prepared for Thursday.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4 — Memory jar */}
        <div className="mt-6 px-4">
          <div className="flex items-center">
            <p className="text-xs font-semibold tracking-widest text-mend-textMuted">YOUR MEMORY JAR</p>
            <button
              type="button"
              className="ml-auto text-xs text-mend-blue transition-opacity hover:opacity-80"
              aria-label="See all memories"
            >
              See all →
            </button>
          </div>
          <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {memorySlice.map((entry) => (
              <article
                key={entry.id}
                className="w-52 shrink-0 rounded-2xl border border-mend-border bg-white p-4"
              >
                <Tag emoji={entry.tag} tagLabel={entry.tagLabel} />
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-mend-textPrimary">
                  {entry.answer}
                </p>
                <p className="mt-2 text-xs text-mend-textMuted">Session {mockUser.sessionCount}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Section 5 — Pulse teaser */}
        <div className="mt-6 px-4 pb-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/pulse')}
            className="flex w-full cursor-pointer items-center rounded-2xl border border-mend-border bg-white p-5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
            aria-label="View pattern pulse"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mend-greenLight">
              <ChartBarsGreen />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-bold text-mend-textPrimary">
                {patternCount} patterns spotted this week
              </p>
              <p className="mt-0.5 text-xs text-mend-textMuted">Your Sunday digest is ready</p>
            </div>
            <ChevronRightMuted />
          </motion.button>
        </div>
      </div>
    </PageTransition>
  )
}

export default HomeDashboard
