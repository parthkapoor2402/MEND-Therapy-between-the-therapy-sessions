import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockBriefBullets, mockDebriefEntries } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import { generateBriefFromDebrief } from '../services/geminiService.js'
import { PrivacyBadge } from '../components/PrivacyBadge.jsx'
import { Tag } from '../components/ui/Tag.jsx'
import { MicButton } from '../components/debrief/MicButton.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'

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

function MendLeafIcon({ className = 'h-12 w-12' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 C8 3 4 6 4 10 C4 14 8 18 12 21 C16 18 20 14 20 10 C20 6 16 3 12 3Z"
        stroke="#4A7C59"
        strokeWidth="2"
        fill="#EAF2ED"
        strokeLinejoin="round"
      />
      <path d="M12 21 L12 10" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function DebriefPage() {
  const navigate = useNavigate()
  const saveCompletedDebrief = useMendStore((s) => s.saveCompletedDebrief)
  const setCurrentBrief = useMendStore((s) => s.setCurrentBrief)
  const debriefAnswers = useMendStore((s) => s.debriefAnswers)

  const [currentStep, setCurrentStep] = useState(-1)
  const [isRecording, setIsRecording] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [answers, setAnswers] = useState({})
  /** How each prompt was last saved — restores text vs voice UI when revisiting a question. */
  const [answerSource, setAnswerSource] = useState({})
  const [showTextFallback, setShowTextFallback] = useState(false)
  const [textInput, setTextInput] = useState('')

  const entryPromptRef = useRef(null)
  const answersRef = useRef({})

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const [speechAvailable] = useState(
    () =>
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  )

  const onSpeechResult = useCallback((transcript, isFinal) => {
    if (isFinal) {
      setFinalTranscript(transcript)
      setInterimTranscript('')
      const key = entryPromptRef.current
      const trimmed = transcript.trim()
      if (key && trimmed) {
        setAnswers((prev) => {
          const next = { ...prev, [key]: trimmed }
          answersRef.current = next
          return next
        })
        setAnswerSource((prev) => ({ ...prev, [key]: 'voice' }))
      }
    } else {
      setInterimTranscript(transcript)
    }
  }, [])

  const onSpeechEnd = useCallback(() => {
    setIsRecording(false)
  }, [])

  const { startListening, stopListening } = useSpeechRecognition({
    onResult: onSpeechResult,
    onEnd: onSpeechEnd,
  })

  const entry = currentStep >= 0 && currentStep <= 4 ? mockDebriefEntries[currentStep] : null

  useEffect(() => {
    entryPromptRef.current = entry?.prompt ?? null
  }, [entry])

  /** When the question index changes, load saved draft for that prompt (all 5 questions; includes going back). */
  useEffect(() => {
    if (currentStep < 0 || currentStep > 4) return
    setIsRecording(false)
    setInterimTranscript('')
    const key = entry?.prompt
    if (!key) return
    const saved = answers[key] ?? ''
    const source = answerSource[key]
    if (saved) {
      if (source === 'text') {
        setShowTextFallback(true)
        setTextInput(saved)
        setFinalTranscript('')
      } else {
        setShowTextFallback(false)
        setFinalTranscript(saved)
        setTextInput('')
      }
    } else {
      setShowTextFallback(false)
      setFinalTranscript('')
      setTextInput('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-hydrate when step changes; answers read from latest render
  }, [currentStep])

  const handleTextInputChange = (e) => {
    const v = e.target.value
    setTextInput(v)
    if (!entry) return
    const k = entry.prompt
    setAnswers((prev) => {
      const next = { ...prev, [k]: v }
      answersRef.current = next
      return next
    })
    setAnswerSource((prev) => ({ ...prev, [k]: 'text' }))
  }

  const handleCompleteDebrief = async (answersToSave) => {
    setCurrentStep(6)

    saveCompletedDebrief(answersToSave)

    const generatedBullets = await generateBriefFromDebrief(answersToSave)

    if (generatedBullets) {
      setCurrentBrief(generatedBullets)
    } else {
      setCurrentBrief(mockBriefBullets)
    }

    setCurrentStep(5)
  }

  const handleMicToggle = () => {
    if (showTextFallback) return
    if (isRecording) {
      stopListening()
      const promptKey = entry?.prompt
      setInterimTranscript((prevInterim) => {
        setFinalTranscript((existingFinal) => {
          const merged = (existingFinal?.trim() || prevInterim?.trim() || '').trim()
          if (promptKey && merged) {
            setAnswers((prev) => {
              const next = { ...prev, [promptKey]: merged }
              answersRef.current = next
              return next
            })
            setAnswerSource((prev) => ({ ...prev, [promptKey]: 'voice' }))
          }
          return merged || existingFinal || ''
        })
        return ''
      })
      setIsRecording(false)
      return
    }

    const ok = startListening()
    if (ok) setIsRecording(true)
  }

  const currentAnswer = (finalTranscript || interimTranscript || textInput).trim()
  const hasAnswer = currentAnswer.length > 0
  const nextDisabled = !hasAnswer || isRecording

  const handleRedo = () => {
    setFinalTranscript('')
    setInterimTranscript('')
    setTextInput('')
    setIsRecording(false)
    if (entry) {
      const k = entry.prompt
      setAnswers((prev) => {
        const next = { ...prev }
        delete next[k]
        answersRef.current = next
        return next
      })
      setAnswerSource((prev) => {
        const next = { ...prev }
        delete next[k]
        return next
      })
    }
  }

  const handleNext = () => {
    if (!entry || !currentAnswer) return
    if (isRecording) {
      stopListening()
      setIsRecording(false)
    }
    const key = entry.prompt
    const trimmed = currentAnswer.trim()
    const source = showTextFallback ? 'text' : 'voice'
    /** Always merge from latest ref so questions 2–5 never drop earlier prompts. */
    const newAnswers = { ...answersRef.current, [key]: trimmed }
    answersRef.current = newAnswers
    setAnswers(newAnswers)
    setAnswerSource((prev) => ({ ...prev, [key]: source }))
    setFinalTranscript('')
    setInterimTranscript('')
    setTextInput('')
    setShowTextFallback(false)

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      void handleCompleteDebrief(newAnswers)
    }
  }

  const primaryBtnClass =
    'min-h-[48px] w-full rounded-full bg-mend-green px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mend-green/90 active:bg-mend-green/80 disabled:cursor-not-allowed disabled:opacity-40'

  const statusLabel = (() => {
    if (isRecording) return 'listening'
    if (showTextFallback && textInput.trim()) return 'done'
    if (finalTranscript.trim()) return 'done'
    return 'idle'
  })()

  return (
    <PageTransition className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg font-sans">
      {currentStep === -1 && (
        <div className="flex min-h-[844px] flex-col items-center justify-center px-8 pb-28">
          <div className="absolute left-0 right-0 top-0">
            <DebriefTopBar title="Session Debrief" onBack={() => navigate('/home')} />
          </div>
          <div className="mt-10 flex justify-center">
            <PrivacyBadge className="!mt-2" />
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(0)}
            className="mt-8 flex flex-col items-center rounded-3xl p-1 outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-mend-green focus-visible:ring-offset-2"
            aria-label="Begin the five questions — live microphone is on the next screens"
          >
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
          </button>
          <p className="mt-2 max-w-xs text-center text-xs text-mend-textMuted">
            Tap the mic or &quot;Start Debrief&quot; below — voice records on each question.
          </p>

          <h1 className="mt-6 text-center text-2xl font-bold text-mend-textPrimary">
            Capture before it fades
          </h1>
          <p className="mt-2 whitespace-pre-line text-center text-sm leading-relaxed text-mend-textMuted">
            {'5 questions. 3 minutes. Voice or text.\nNothing leaves your phone.'}
          </p>

          {speechAvailable ? (
            <span className="mt-4 rounded-full bg-mend-greenLight px-4 py-2 text-xs text-mend-green">
              🎤 Voice ready — Chrome detected
            </span>
          ) : (
            <span className="mt-4 rounded-full bg-mend-warmLight px-4 py-2 text-xs text-mend-warm">
              ⌨️ Voice unavailable — text mode active
            </span>
          )}

          <p className="mt-3 rounded-full bg-mend-greenLight px-4 py-2 text-xs text-mend-textMuted">
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

      {currentStep >= 0 && currentStep <= 4 && entry && (
        <div className="relative flex min-h-[min(844px,100dvh)] flex-1 flex-col">
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
                  <p className="text-lg font-semibold leading-snug text-mend-textPrimary">{entry.question}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-1 flex-col items-center px-6">
            {!showTextFallback ? (
              <MicButton recording={isRecording} onToggle={handleMicToggle} />
            ) : (
              <textarea
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="Type your answer here..."
                rows={5}
                aria-label="Type your answer"
                className="h-28 w-full resize-none rounded-2xl border border-mend-border bg-white p-4 text-sm text-mend-textPrimary focus:border-mend-green focus:outline-none focus:ring-1 focus:ring-mend-green"
              />
            )}

            <div className="mt-3 min-h-[1.25rem] text-sm">
              {showTextFallback ? (
                <p className="text-mend-textMuted">Type your response below</p>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="mt-4 min-h-20 w-full rounded-2xl border border-mend-border bg-white p-4">
              {interimTranscript ? (
                <p className="text-sm italic leading-relaxed text-gray-400">{interimTranscript}</p>
              ) : finalTranscript || textInput ? (
                <p className="text-sm leading-relaxed text-mend-textPrimary">{finalTranscript || textInput}</p>
              ) : (
                <p className="text-sm italic text-mend-textMuted">Your answer will appear here...</p>
              )}
            </div>

            {(finalTranscript || textInput) && (
              <button
                type="button"
                className="mt-2 cursor-pointer text-xs text-mend-textMuted transition hover:text-mend-red"
                onClick={handleRedo}
              >
                {showTextFallback ? '↩ Clear answer' : '↩ Clear and re-record'}
              </button>
            )}

            {!showTextFallback ? (
              <button
                type="button"
                className="mt-3 cursor-pointer text-xs text-mend-blue transition-opacity hover:opacity-80"
                onClick={() => {
                  if (!entry) return
                  const k = entry.prompt
                  const v = (finalTranscript || textInput).trim()
                  setShowTextFallback(true)
                  if (v) {
                    setTextInput(v)
                    setAnswers((prev) => {
                      const next = { ...prev, [k]: v }
                      answersRef.current = next
                      return next
                    })
                    setAnswerSource((prev) => ({ ...prev, [k]: 'text' }))
                  }
                }}
              >
                Prefer to type? →
              </button>
            ) : (
              <button
                type="button"
                className="mt-3 cursor-pointer text-xs text-mend-blue transition-opacity hover:opacity-80"
                onClick={() => {
                  if (!entry) return
                  const k = entry.prompt
                  const v = textInput.trim()
                  setShowTextFallback(false)
                  if (v) {
                    setFinalTranscript(v)
                    setAnswers((prev) => {
                      const next = { ...prev, [k]: v }
                      answersRef.current = next
                      return next
                    })
                    setAnswerSource((prev) => ({ ...prev, [k]: 'voice' }))
                  }
                  setTextInput('')
                }}
              >
                Use voice instead ←
              </button>
            )}
          </div>

          {/* Sticky footer above BottomNav (~5.25rem) so Next is always visible in voice & text mode */}
          <div className="sticky bottom-0 z-30 mt-auto border-t border-mend-border/90 bg-mend-bg/95 px-6 pb-[max(1rem,calc(5.5rem+env(safe-area-inset-bottom)))] pt-3 backdrop-blur-sm">
            <AnimatePresence>
              <motion.div
                key="next-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={hasAnswer && !isRecording ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  data-testid="debrief-next"
                  className={primaryBtnClass}
                  disabled={nextDisabled}
                  aria-label={currentStep < 4 ? 'Next question' : 'Complete debrief'}
                  onClick={handleNext}
                >
                  {currentStep < 4 ? 'Next question →' : 'Complete Debrief ✓'}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="flex min-h-[844px] flex-col items-center justify-center bg-mend-bg px-8">
          <MendLeafIcon />
          <FloatingDots />
          <p className="mt-4 text-center text-sm text-mend-textMuted">Mend is preparing your brief...</p>
          <p className="mt-2 text-center text-xs text-mend-textMuted">Using your words, not ours.</p>
        </div>
      )}

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
                  <p className="mt-0.5 line-clamp-3 text-sm text-mend-textPrimary">
                    {answers[e.prompt] ?? debriefAnswers[e.prompt] ?? e.answer}
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
