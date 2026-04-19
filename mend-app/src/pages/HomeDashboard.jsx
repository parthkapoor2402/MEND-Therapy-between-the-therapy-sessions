import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMendStore } from '../store/useMendStore.js'
import { Tag } from '../components/ui/Tag.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'
import MomentPaywall from '../components/ui/MomentPaywall.jsx'
import { formatRelativeTime } from '../utils/formatRelativeTime.js'

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
  const allDebriefs = useMendStore((s) => s.allDebriefs)
  const briefGenerated = useMendStore((s) => s.briefGenerated)
  const currentBrief = useMendStore((s) => s.currentBrief)
  const onboardingComplete = useMendStore((s) => s.onboardingComplete)
  const profile = useMendStore((s) => s.profile)
  const pulsePatterns = useMendStore((s) => s.pulsePatterns)
  const notificationSettings = useMendStore((s) => s.notificationSettings)
  const isPro = useMendStore((s) => s.isPro)
  const momentUsed = useMendStore((s) => s.momentUsed)
  const moments = useMendStore((s) => s.moments)
  const unlockPro = useMendStore((s) => s.unlockPro)

  const [notifyBannerDismissed, setNotifyBannerDismissed] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const wantsBrowserNotifications =
    notificationSettings.sessionReminders ||
    notificationSettings.preSessionBrief ||
    notificationSettings.pulseDigest
  const showBrowserNotifyBanner =
    !notifyBannerDismissed &&
    wantsBrowserNotifications &&
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'default'

  const firstName = profile.fullName.split(' ')[0]
  const sessionLine = `${profile.nextSessionDate} · ${profile.nextSessionTime}`
  const nextSessionNumber = allDebriefs.length + 1

  const memoryEntries =
    allDebriefs.length > 0
      ? allDebriefs
          .slice(-3)
          .reverse()
          .map((d, i) => ({
            debriefId: d.id,
            answer:
              d.answers.emotion ||
              d.answers.belief ||
              Object.values(d.answers)[0] ||
              '',
            tag: '💛',
            tagLabel: 'Captured',
            sessionDate: new Date(d.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            }),
            sessionNum: allDebriefs.length - i,
          }))
      : []

  const today = new Date().toDateString()
  const lastDebriefDate =
    allDebriefs.length > 0 ? new Date(allDebriefs[allDebriefs.length - 1].date).toDateString() : null
  const debriefedToday = lastDebriefDate === today

  const patternCount = pulsePatterns.length || 3

  return (
    <PageTransition
      className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg font-sans"
      data-onboarding-complete={onboardingComplete ? 'true' : 'false'}
    >
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
                aria-label="Settings"
                onClick={() => navigate('/settings')}
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
                Session {nextSessionNumber}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mend-ydTeal to-mend-green text-sm font-bold text-white">
                {profile.therapistInitials}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-mend-textPrimary">{profile.therapistName}</p>
                <p className="text-sm text-mend-textMuted">{sessionLine}</p>
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-mend-ydTealLight px-3 py-1 text-xs font-medium text-mend-ydTeal">
              via {profile.platform}
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

        {/* Section 3 — Today (debrief stays above Mend Moment) */}
        <div className="mt-6 px-4">
          <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">TODAY</p>
          {debriefedToday ? (
            <div className="rounded-2xl border border-mend-green/20 bg-mend-greenLight p-5">
              <div className="flex items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mend-green">
                  <CheckIconWhite />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-base font-bold text-mend-textPrimary">Session debriefed ✓</p>
                  <p className="mt-2 text-sm text-mend-textMuted">
                    {Array.isArray(currentBrief) && currentBrief.length > 0
                      ? 'Your pre-session brief is ready in the Brief tab.'
                      : briefGenerated
                        ? 'Your brief is being prepared for Thursday.'
                        : 'Thanks for debriefing — your brief will appear in the Brief tab.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {showBrowserNotifyBanner ? (
          <div className="mt-4 px-4">
            <div className="flex flex-col gap-2 rounded-2xl border border-mend-ydTeal/30 bg-mend-ydTealLight/50 px-4 py-3">
              <p className="text-sm font-semibold text-mend-textPrimary">Allow session nudges?</p>
              <p className="text-xs leading-relaxed text-mend-textMuted">
                Your browser needs permission for reminders and digests you turned on in onboarding. You can change this
                anytime in Settings.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  className="min-h-[40px] rounded-full bg-mend-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mend-green/90"
                  aria-label="Allow browser notifications for session reminders"
                  onClick={() => {
                    void Notification.requestPermission()
                    setNotifyBannerDismissed(true)
                  }}
                >
                  Allow notifications
                </button>
                <button
                  type="button"
                  className="min-h-[40px] rounded-full border border-mend-border bg-white px-4 py-2 text-sm font-medium text-mend-textMuted transition-colors hover:bg-gray-50"
                  onClick={() => setNotifyBannerDismissed(true)}
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Mend Moments strip */}
        {moments.length > 0 ? (
          <div className="mt-6 px-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  ⚡
                </span>
                <span className="text-xs font-semibold tracking-widest text-mend-textMuted">
                  BETWEEN SESSIONS
                </span>
              </div>
              {moments.length > 1 ? (
                <button
                  type="button"
                  className="text-xs text-mend-blue transition-opacity hover:opacity-80"
                  onClick={() => navigate('/moments')}
                >
                  See all →
                </button>
              ) : null}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-[#1A2420] p-4"
            >
              <div className="flex items-center">
                <span className="text-sm text-mend-green" aria-hidden>
                  ⚡
                </span>
                <span className="ml-2 text-xs text-white/40">
                  {formatRelativeTime(moments[0].timestamp)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm italic leading-relaxed text-white/80">
                &quot;{moments[0].keyCapture}&quot;
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span>{moments[0].tagEmoji}</span>
                <span className="text-xs font-medium text-white/50">{moments[0].emotionTag}</span>
                {moments[0].patternDetected && moments[0].patternLabel ? (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-xs text-mend-green">🔁 {moments[0].patternLabel}</span>
                  </>
                ) : null}
                <span className="ml-auto text-xs text-white/30">In next brief ✓</span>
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* Mend Moment (compact) + Memory jar — same band so layout stays aligned */}
        <div className="mt-6 px-4">
          <div className="mb-5 rounded-2xl border-2 border-white bg-black p-4 text-white shadow-[6px_6px_0_0_rgba(255,255,255,0.35)] ring-1 ring-white/15">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-5">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">Between sessions</p>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <p className="text-lg font-black uppercase leading-none tracking-tight text-white">Mend Moment</p>
                  <span className="border-2 border-white px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                    PRO
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {!momentUsed ? (
                    <span className="border border-white/50 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      First one free
                    </span>
                  ) : isPro ? (
                    <span className="border border-white/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                      Included
                    </span>
                  ) : (
                    <span className="border border-white/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Locked
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs font-medium leading-relaxed text-white/75">
                  {!momentUsed
                    ? 'Your first Mend Moment is free — a quick capture between sessions can show up in your next brief.'
                    : isPro
                      ? "Jot something between sessions; we'll weave it into your care journey."
                      : "You've used your free capture. Unlock PRO for unlimited Mend Moments."}
                </p>
              </div>
              <motion.button
                type="button"
                data-testid="moment-fab"
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 self-center rounded-none border-2 border-white bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/90 active:bg-white/80 sm:w-auto sm:min-w-[9rem] sm:self-center"
                aria-label="Capture Mend Moment"
                onClick={() => {
                  if (!isPro && momentUsed) {
                    setPaywallOpen(true)
                  } else {
                    navigate('/moment')
                  }
                }}
              >
                <span aria-hidden>⚡</span>
                <span>{!isPro && momentUsed ? 'Unlock' : 'Capture'}</span>
              </motion.button>
            </div>
          </div>

          <div className="flex items-center">
            <p className="text-xs font-semibold tracking-widest text-mend-textMuted">YOUR MEMORY JAR</p>
            <button
              type="button"
              className="ml-auto text-xs text-mend-blue transition-opacity hover:opacity-80"
              aria-label="See all memories"
              onClick={() => navigate('/memory')}
            >
              See all →
            </button>
          </div>
          <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {memoryEntries.length === 0
              ? [0, 1, 2].map((slot) => (
                  <div
                    key={slot}
                    className="flex w-52 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mend-border bg-transparent p-4 text-center"
                  >
                    <span className="text-2xl" aria-hidden>
                      🌱
                    </span>
                    <p className="mt-2 text-xs text-mend-textMuted">Your captures will appear here</p>
                  </div>
                ))
              : memoryEntries.map((entry) => (
                  <article
                    key={entry.debriefId}
                    className="w-52 shrink-0 rounded-2xl border border-mend-border bg-white p-4"
                  >
                    <Tag emoji={entry.tag} tagLabel={entry.tagLabel} />
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-mend-textPrimary">
                      {entry.answer}
                    </p>
                    <p className="mt-2 text-xs text-mend-textMuted">
                      Session {entry.sessionNum} · {entry.sessionDate}
                    </p>
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

      <MomentPaywall
        isOpen={paywallOpen}
        firstMoment={moments[0] ?? null}
        onClose={() => setPaywallOpen(false)}
        onUnlock={() => {
          unlockPro()
          setPaywallOpen(false)
          navigate('/moment')
        }}
      />
    </PageTransition>
  )
}

export default HomeDashboard
