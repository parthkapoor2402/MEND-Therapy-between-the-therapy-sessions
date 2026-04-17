import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockDebriefEntries } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import { PrivacyBadge } from '../components/PrivacyBadge.jsx'
import { Tag } from '../components/ui/Tag.jsx'
import { MicButton } from '../components/debrief/MicButton.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'

function DebriefTopBar({ title, onBack }) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-4 pt-3">
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
      <span className="text-sm font-semibold text-mend-textPrimary">{title}</span>
    </div>
  )
}

function FloatingDots() {
  return (
    <div className="mt-4 inline-flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-mend-green"
          animate={{ y: [-4, 0, -4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function DebriefPage() {
  const navigate = useNavigate()
  const setDebriefAnswer = useMendStore((s) => s.setDebriefAnswer)
  const setBriefGenerated = useMendStore((s) => s.setBriefGenerated)
  const debriefAnswers = useMendStore((s) => s.debriefAnswers)

  const [currentStep, setCurrentStep] = useState(-1)
  const [isRecording, setIsRecording] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [answers, setAnswers] = useState({})
  const [preferTypeMode, setPreferTypeMode] = useState(false)
  const [typedText, setTypedText] = useState('')

  const entry = currentStep >= 0 && currentStep <= 4 ? mockDebriefEntries[currentStep] : null
  const fullAnswer = entry?.answer ?? ''

  useEffect(() => {
    if (currentStep < 0 || currentStep > 4) return
    setCurrentTranscript('')
    setTypedText('')
    setPreferTypeMode(false)
    setIsRecording(false)
  }, [currentStep])

  useEffect(() => {
    if (!isRecording || currentStep < 0 || currentStep > 4) return

    const full = mockDebriefEntries[currentStep].answer
    let i = 0
    setCurrentTranscript('')

    const id = window.setInterval(() => {
      i += 1
      setCurrentTranscript(full.slice(0, i))
      if (i >= full.length) {
        window.clearInterval(id)
        setIsRecording(false)
      }
    }, 30)

    return () => window.clearInterval(id)
  }, [isRecording, currentStep])

  const toggleMic = useCallback(() => {
    setPreferTypeMode(false)
    setIsRecording((r) => !r)
  }, [])

  const hasAnswer =
    currentTranscript.trim().length > 0 || typedText.trim().length > 0

  const handleNext = () => {
    if (!entry) return
    const text = preferTypeMode ? typedText.trim() : currentTranscript.trim()
    if (!text) return

    setDebriefAnswer(entry.id, text)
    setAnswers((prev) => ({ ...prev, [entry.id]: text }))
    setCurrentTranscript('')
    setTypedText('')
    setPreferTypeMode(false)
    setIsRecording(false)

    if (currentStep < 4) {
      setCurrentStep((s) => s + 1)
    } else {
      setBriefGenerated(true)
      setCurrentStep(5)
    }
  }

  const voiceDone =
    !isRecording &&
    fullAnswer.length > 0 &&
    currentTranscript.length === fullAnswer.length

  const statusLabel = (() => {
    if (isRecording) return 'listening'
    if (voiceDone) return 'done'
    return 'idle'
  })()

  const primaryBtnClass =
    'min-h-[48px] w-full rounded-full bg-mend-green px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mend-green/90 active:bg-mend-green/80 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <PageTransition className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg font-sans">
      {/* Step -1 */}
      {currentStep === -1 && (
        <div className="flex min-h-[844px] flex-col items-center justify-center px-8 pb-28">
          <div className="absolute left-0 right-0 top-0">
            <DebriefTopBar title="Session Debrief" onBack={() => navigate('/home')} />
          </div>
          <div className="mt-10 flex justify-center">
            <PrivacyBadge className="!mt-2" />
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-mend-green shadow-lg">
              <svg className="h-10 w-10" viewBox="0 0 24 28" fill="none" aria-hidden>
                <path
                  d="M12 1 a3 3 0 0 1 3 3 v8 a3 3 0 0 1-6 0 V4 a3 3 0 0 1 3-3z"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M19 10 v2 a7 7 0 0 1-14 0 v-2 M12 19 v4 M8 23 h8"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <FloatingDots />
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold text-mend-textPrimary">
            Capture before it fades
          </h1>
          <p className="mt-2 whitespace-pre-line text-center text-sm leading-relaxed text-mend-textMuted">
            {'5 questions. 3 minutes. Voice or text.\nNothing leaves your phone.'}
          </p>
          <p className="mt-4 rounded-full bg-mend-greenLight px-4 py-2 text-xs text-mend-textMuted">
            🔒 Audio processed on device only
          </p>

          <button
            type="button"
            className={`absolute bottom-8 left-6 right-6 ${primaryBtnClass}`}
            aria-label="Start debrief"
            onClick={() => setCurrentStep(0)}
          >
            Start Debrief
          </button>
        </div>
      )}

      {/* Steps 0–4 */}
      {currentStep >= 0 && currentStep <= 4 && entry && (
        <div className="flex min-h-[844px] flex-col pb-32">
          <DebriefTopBar
            title={`Question ${currentStep + 1} of 5`}
            onBack={() => {
              if (currentStep > 0) setCurrentStep((s) => s - 1)
              else navigate('/home')
            }}
          />

          <div className="mt-2 px-6">
            <div className="h-1.5 w-full rounded-full bg-mend-border">
              <motion.div
                data-testid="debrief-progress-inner"
                data-progress-pct={Math.round(((currentStep + 1) / 5) * 100)}
                className="h-full rounded-full bg-mend-green"
                initial={{ width: `${(currentStep / 5) * 100}%` }}
                animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-4 px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <Tag emoji={entry.tag} tagLabel={entry.tagLabel} />
                <div className="mt-3 rounded-2xl bg-mend-greenLight p-5">
                  <p className="text-lg font-semibold leading-snug text-mend-textPrimary">
                    {entry.question}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-1 flex-col items-center px-6">
            <MicButton recording={isRecording} onToggle={toggleMic} />

            <div className="mt-3 text-sm">
              {statusLabel === 'listening' && (
                <p className="font-medium text-mend-green">
                  Listening...
                  <span className="ml-0.5 inline-block animate-pulse">|</span>
                </p>
              )}
              {statusLabel === 'idle' && (
                <p className="text-mend-textMuted">Tap to speak</p>
              )}
              {statusLabel === 'done' && (
                <p className="font-medium text-mend-green">Got it ✓</p>
              )}
            </div>

            {!preferTypeMode ? (
              <div className="mt-4 min-h-20 w-full rounded-2xl border border-mend-border bg-white p-4">
                {currentTranscript.length === 0 ? (
                  <p className="text-sm italic text-mend-textMuted">
                    Your answer will appear here...
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-mend-textPrimary">{currentTranscript}</p>
                )}
              </div>
            ) : (
              <textarea
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="mt-4 h-24 w-full resize-none rounded-2xl border border-mend-border p-4 text-sm text-mend-textPrimary focus:border-mend-green focus:outline-none focus:ring-1 focus:ring-mend-green"
                aria-label="Type your answer"
              />
            )}

            <button
              type="button"
              className="mt-3 cursor-pointer text-xs text-mend-blue transition-opacity hover:opacity-80"
              onClick={() => {
                setIsRecording(false)
                setPreferTypeMode((v) => !v)
              }}
              aria-label={preferTypeMode ? 'Use voice input' : 'Prefer to type'}
            >
              {preferTypeMode ? '← Use voice instead' : 'Prefer to type? →'}
            </button>
          </div>

          <AnimatePresence>
            <motion.div
              key="next-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={
                hasAnswer
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0.45, y: 6 }
              }
              transition={{ duration: 0.2 }}
              className="absolute bottom-8 left-6 right-6"
            >
              <button
                type="button"
                data-testid="debrief-next"
                className={primaryBtnClass}
                disabled={!hasAnswer}
                aria-label={currentStep < 4 ? 'Next question' : 'Complete debrief'}
                onClick={handleNext}
              >
                {currentStep < 4 ? 'Next question →' : 'Complete Debrief ✓'}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Step 5 */}
      {currentStep === 5 && (
        <div className="flex min-h-[844px] flex-col items-center justify-center px-8 pb-28">
          <div className="flex justify-center">
            <svg className="h-24 w-24" viewBox="0 0 96 96" fill="none" aria-hidden>
              <motion.circle
                cx="48"
                cy="48"
                r="44"
                stroke="#4A7C59"
                strokeWidth="3"
                fill="#EAF2ED"
                initial={{ strokeDashoffset: 276 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6 }}
                strokeDasharray="276"
              />
              <motion.path
                d="M22 48 L40 66 L74 30"
                stroke="#4A7C59"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDashoffset: 60 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                strokeDasharray="60"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-center text-3xl font-bold text-mend-green">Saved. ✓</h1>
          <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-mend-textMuted">
            Your debrief is locked in. I&apos;ll use this to prepare your brief before Thursday.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
            {mockDebriefEntries.map((e) => (
              <div
                key={e.id}
                data-testid="debrief-summary-card"
                className="flex items-start gap-3 rounded-xl border border-mend-border bg-white p-3"
              >
                <span className="w-8 shrink-0 text-lg" aria-hidden>
                  {e.tag}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-mend-textMuted">{e.tagLabel}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-mend-textPrimary">
                    {answers[e.id] ?? debriefAnswers[e.id] ?? e.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`absolute bottom-8 left-6 right-6 ${primaryBtnClass}`}
            aria-label="Back to home"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </button>
        </div>
      )}
    </PageTransition>
  )
}

export default DebriefPage
