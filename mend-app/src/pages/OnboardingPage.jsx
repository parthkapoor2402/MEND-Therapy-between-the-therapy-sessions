import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ProgressDots } from '../components/ProgressDots.jsx'
import { PrivacyBadge } from '../components/PrivacyBadge.jsx'
import { Toggle } from '../components/Toggle.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'
import { mockUser } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'

const PLATFORMS = ['YourDost', 'BetterHelp', 'Independent therapist']
const REFLECTION_TIMES = ['Morning', 'Evening', 'Night']

function MendLeafWhite({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3 C8 3 4 6 4 10 C4 14 8 18 12 21 C16 18 20 14 20 10 C20 6 16 3 12 3Z" />
      <path d="M12 21 L12 10" />
    </svg>
  )
}

function SmallCheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
      <path
        d="M2 6 L5 9 L10 3"
        stroke="#4A7C59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function OnboardingTopBar({ title, onBack }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack}
        className="rounded-full p-2 text-mend-textPrimary transition-colors hover:bg-mend-greenLight active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {title ? (
        <span className="text-sm font-semibold text-mend-textPrimary">{title}</span>
      ) : (
        <span className="text-sm font-semibold text-mend-textPrimary" aria-hidden>
          {'\u00a0'}
        </span>
      )}
    </div>
  )
}

function formatDayWithOrdinal(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const month = date.toLocaleString('en-US', { month: 'long' })
  const day = date.getDate()
  const mod10 = day % 10
  const mod100 = day % 100
  const ord =
    mod10 === 1 && mod100 !== 11
      ? 'st'
      : mod10 === 2 && mod100 !== 12
        ? 'nd'
        : mod10 === 3 && mod100 !== 13
          ? 'rd'
          : 'th'
  return `${month} ${day}${ord}`
}

function formatReminderCopy(sessionDate) {
  const day = formatDayWithOrdinal(sessionDate || '2026-04-24')
  const time = mockUser.nextSessionTime.replace(':00', '')
  return `I'll remind you on ${day} at ${time}`
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const setOnboardingComplete = useMendStore((s) => s.setOnboardingComplete)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState('YourDost')
  const [sessionDate, setSessionDate] = useState('2026-04-24')
  const [selectedTime, setSelectedTime] = useState('Evening')
  const [remindersOn, setRemindersOn] = useState(true)
  const [briefOn, setBriefOn] = useState(true)
  const [pulseOn, setPulseOn] = useState(true)

  const firstName = mockUser.name.split(' ')[0]
  const allSetupFieldsFilled = Boolean(selectedPlatform && sessionDate && selectedTime)

  const primaryBtnClass =
    'mt-4 w-full min-h-[48px] rounded-full bg-mend-green px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mend-green/90 active:bg-mend-green/80 active:scale-[0.99]'

  return (
    <PageTransition className="flex min-h-full min-h-[844px] flex-col bg-mend-bg font-sans">
      <AnimatePresence mode="wait">
        {currentScreen === 0 && (
          <motion.div
            key="onboarding-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
              <div className="flex flex-1 flex-col items-center justify-center px-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mend-green">
                    <MendLeafWhite className="h-7 w-7" />
                  </div>
                  <span className="text-xl font-bold text-mend-green">mend</span>
                </div>

                <div className="mb-6 mt-8 flex justify-center">
                  <svg
                    className="h-32 w-32"
                    viewBox="0 0 24 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M12 2 L3 7 L3 13 C3 18.5 7 23.5 12 25 C17 23.5 21 18.5 21 13 L21 7 Z"
                      stroke="#4A7C59"
                      strokeWidth="2"
                      fill="#EAF2ED"
                    />
                    <motion.path
                      d="M8 13 L11 16 L16 10"
                      fill="none"
                      stroke="#4A7C59"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ strokeDashoffset: 20 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      strokeDasharray="20"
                    />
                  </svg>
                </div>

                <h1 className="mt-4 text-center text-2xl font-bold text-mend-textPrimary">
                  Only listens when you ask it to.
                </h1>
                <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-mend-textMuted">
                  Mend never records in the background. Ever. You tap. We listen. You stop. We stop.
                </p>

                <ul className="mt-6 flex w-full max-w-sm flex-col gap-3">
                  {[
                    'Audio processed on your device',
                    'Delete anything, anytime, instantly',
                    'Never shared without your permission',
                  ].map((text, i) => (
                    <motion.li
                      key={text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.35 }}
                      className="flex flex-row items-center gap-3"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mend-greenLight">
                        <SmallCheckIcon />
                      </span>
                      <span className="text-sm font-medium text-mend-textPrimary">{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-8 pt-4">
                <ProgressDots total={4} active={0} />
                <button
                  type="button"
                  className={primaryBtnClass}
                  aria-label="Continue onboarding"
                  onClick={() => setCurrentScreen(1)}
                >
                  I&apos;m in — let&apos;s set up
                </button>
              </div>
          </motion.div>
        )}

        {currentScreen === 1 && (
          <motion.div
            key="onboarding-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
              <OnboardingTopBar title="Setup" onBack={() => setCurrentScreen(0)} />
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pt-4">
                <div>
                  <h1 className="text-xl font-bold text-mend-textPrimary">
                    Let&apos;s get you set up
                  </h1>
                  <p className="mb-2 mt-1 text-sm text-mend-textMuted">
                    3 quick things — takes 30 seconds.
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-mend-textPrimary">
                    Which app do you use for therapy?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        aria-pressed={selectedPlatform === p}
                        data-platform={p}
                        onClick={() => setSelectedPlatform(p)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedPlatform === p
                            ? 'border-mend-green bg-mend-green text-white'
                            : 'cursor-pointer border-mend-border bg-white text-mend-textMuted hover:border-mend-green'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="session-date"
                    className="mb-2 block text-sm font-semibold text-mend-textPrimary"
                  >
                    When is your next session?
                  </label>
                  <input
                    id="session-date"
                    name="session-date"
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full rounded-xl border border-mend-border bg-white px-4 py-3 text-sm text-mend-textPrimary focus:border-mend-green focus:outline-none focus:ring-1 focus:ring-mend-green"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-mend-textPrimary">
                    When do you usually reflect?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REFLECTION_TIMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={selectedTime === t}
                        data-time={t}
                        onClick={() => setSelectedTime(t)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTime === t
                            ? 'border-mend-green bg-mend-green text-white'
                            : 'cursor-pointer border-mend-border bg-white text-mend-textMuted hover:border-mend-green'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {allSetupFieldsFilled && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-mend-green/20 bg-mend-greenLight p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-mend-green">
                        <MendLeafWhite className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-mend-green">mend</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-mend-textPrimary">
                      Got it, {firstName} 👋 I&apos;ll be ready before your{' '}
                      {formatDayWithOrdinal(sessionDate)} session.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="px-6 pb-8">
                <ProgressDots total={4} active={1} />
                <button
                  type="button"
                  className={primaryBtnClass}
                  aria-label="Continue to consent"
                  onClick={() => setCurrentScreen(2)}
                >
                  Continue
                </button>
              </div>
          </motion.div>
        )}

        {currentScreen === 2 && (
          <motion.div
            key="onboarding-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
              <OnboardingTopBar title="Your controls" onBack={() => setCurrentScreen(1)} />
              <PrivacyBadge />
              <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4">
                <h1 className="text-xl font-bold text-mend-textPrimary">
                  You&apos;re always in control.
                </h1>
                <p className="mb-4 mt-1 text-sm text-mend-textMuted">
                  Turn on what feels right. Change anytime.
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path d="M12 3a5 5 0 0 0-5 5v3.09L5.2 16h13.6L17 11.09V8a5 5 0 0 0-5-5Z" />
                          <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-semibold text-mend-textPrimary">
                          Session reminders
                        </p>
                        <p className="mt-0.5 text-xs text-mend-textMuted">
                          Nudge me 30 mins after a session
                        </p>
                      </div>
                    </div>
                    <Toggle
                      on={remindersOn}
                      onToggle={setRemindersOn}
                      ariaLabel="Session reminders"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <rect x="4" y="5" width="16" height="15" rx="2" />
                          <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-semibold text-mend-textPrimary">
                          Pre-session brief
                        </p>
                        <p className="mt-0.5 text-xs text-mend-textMuted">
                          Send my brief 24hrs before therapy
                        </p>
                      </div>
                    </div>
                    <Toggle on={briefOn} onToggle={setBriefOn} ariaLabel="Pre-session brief" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path d="M5 18V6M12 18V10M19 18V14" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-semibold text-mend-textPrimary">Weekly pulse</p>
                        <p className="mt-0.5 text-xs text-mend-textMuted">
                          Sunday evening pattern digest
                        </p>
                      </div>
                    </div>
                    <Toggle on={pulseOn} onToggle={setPulseOn} ariaLabel="Weekly pulse" />
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-mend-textMuted">
                  You can change these anytime in Settings.
                </p>
              </div>

              <div className="px-6 pb-8">
                <ProgressDots total={4} active={2} />
                <button
                  type="button"
                  className={primaryBtnClass}
                  aria-label="Continue to finish"
                  onClick={() => setCurrentScreen(3)}
                >
                  These look good
                </button>
              </div>
          </motion.div>
        )}

        {currentScreen === 3 && (
          <motion.div
            key="onboarding-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
              <OnboardingTopBar title="" onBack={() => setCurrentScreen(2)} />
              <div className="flex flex-1 flex-col items-center px-6 pt-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mend-green">
                    <MendLeafWhite className="h-7 w-7" />
                  </div>
                  <span className="text-xl font-bold text-mend-green">mend</span>
                </div>

                <h1 className="mt-6 text-center text-2xl font-bold text-mend-textPrimary">
                  Had any therapy recently?
                </h1>
                <p className="mb-6 mt-2 text-center text-sm text-mend-textMuted">
                  Debrief it now before it fades — 3 minutes, voice or text.
                </p>

                <div className="flex w-full flex-col gap-4">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setOnboardingComplete(true)
                      navigate('/debrief')
                    }}
                    className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-2xl border-2 border-mend-green bg-mend-greenLight p-5 text-left transition-colors hover:bg-mend-greenLight/80 active:bg-mend-greenLight"
                    aria-label="Yes, debrief now"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mend-green text-2xl">
                      🎤
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-mend-textPrimary">Yes, debrief now</p>
                      <p className="mt-1 text-xs text-mend-textMuted">
                        Takes 3 minutes. Voice or text.
                      </p>
                    </div>
                    <svg
                      className="ml-auto h-5 w-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#4A7C59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setOnboardingComplete(true)
                      navigate('/home')
                    }}
                    className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-2xl border border-mend-border bg-white p-5 text-left shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                    aria-label="Remind me after my next session"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      ⏰
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-mend-textPrimary">
                        Remind me after my next session
                      </p>
                      <p className="mt-1 text-xs text-mend-textMuted">
                        {formatReminderCopy(sessionDate)}
                      </p>
                    </div>
                  </motion.button>
                </div>

                <p className="mt-6 text-center text-xs text-mend-textMuted">
                  Either way, your brief will be ready before Thursday.
                </p>
              </div>

              <div className="px-6 pb-8">
                <ProgressDots total={4} active={3} />
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

export default OnboardingPage
