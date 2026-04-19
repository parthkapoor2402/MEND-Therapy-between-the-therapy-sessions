import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { tagMoment } from '../services/geminiService.js'
import { useMendStore } from '../store/useMendStore.js'
import MomentPaywall from '../components/ui/MomentPaywall.jsx'

function CloseIcon() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 10v2a7 7 0 0 1-14 0v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19v4M8 23h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StopSquareIcon() {
  return (
    <svg className="h-8 w-8 text-mend-red" viewBox="0 0 24 24" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
    </svg>
  )
}

function SpeechBubbleIcon() {
  return (
    <svg className="h-5 w-5 text-white/40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-2l-3 3v-3H9a3 3 0 0 1-3-3V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LeafProcessing() {
  return (
    <svg
      className="h-12 w-12 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 3 C8 3 4 6 4 10 C4 14 8 18 12 21 C16 18 20 14 20 10 C20 6 16 3 12 3Z" />
      <path d="M12 21 L12 10" />
    </svg>
  )
}

const BAR_HEIGHTS = [8, 32, 16, 40, 12]

export function MomentCapturePage() {
  const navigate = useNavigate()
  const [captureStep, setCaptureStep] = useState('idle')
  const [rawText, setRawText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [showTextMode, setShowTextMode] = useState(false)
  const [savedMoment, setSavedMoment] = useState(null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [clock, setClock] = useState('')
  const [heroTime, setHeroTime] = useState('')

  const latestTranscriptRef = useRef('')
  const captureStepRef = useRef('idle')

  const isPro = useMendStore((s) => s.isPro)
  const momentUsed = useMendStore((s) => s.momentUsed)
  const moments = useMendStore((s) => s.moments)
  const addMoment = useMendStore((s) => s.addMoment)
  const unlockPro = useMendStore((s) => s.unlockPro)

  useEffect(() => {
    captureStepRef.current = captureStep
  }, [captureStep])

  useEffect(() => {
    const { momentUsed: used, isPro: pro } = useMendStore.getState()
    if (used && !pro) {
      setPaywallOpen(true)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      setClock(t)
      setHeroTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    }
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  const onSpeechResult = useCallback((transcript, isFinal) => {
    latestTranscriptRef.current = transcript
    if (isFinal) {
      setRawText(transcript)
      setInterimText('')
    } else {
      setInterimText(transcript)
    }
  }, [])

  const onSpeechEnd = useCallback(() => {
    if (captureStepRef.current === 'recording') {
      const t = latestTranscriptRef.current.trim()
      setRawText(t)
      setInterimText('')
      setCaptureStep(t ? 'typed' : 'idle')
    }
  }, [])

  const { startListening, stopListening } = useSpeechRecognition({
    onResult: onSpeechResult,
    onEnd: onSpeechEnd,
  })

  const handleMicStart = () => {
    setCaptureStep('recording')
    latestTranscriptRef.current = ''
    setInterimText('')
    setRawText('')
    startListening()
  }

  const handleStopRecording = () => {
    stopListening()
    const t = latestTranscriptRef.current.trim()
    setRawText(t)
    setInterimText('')
    setCaptureStep(t ? 'typed' : 'idle')
  }

  const handleSaveMoment = async () => {
    const text = rawText.trim()
    if (text.length < 1) return
    setCaptureStep('processing')
    const tagged = await tagMoment(text)
    const newMoment = {
      id: Date.now(),
      rawText: text,
      keyCapture: tagged.keyCapture,
      emotionTag: tagged.emotionTag,
      tagEmoji: tagged.tagEmoji,
      patternDetected: tagged.patternDetected,
      patternLabel: tagged.patternLabel,
      momentLabel: tagged.momentLabel,
      timestamp: new Date().toISOString(),
      addedToBrief: true,
    }
    addMoment(newMoment)
    setSavedMoment(newMoment)
    setCaptureStep('saved')
  }

  const dateLine = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div
      data-testid={`moment-capture-${captureStep}`}
      className="relative flex min-h-screen min-h-[844px] flex-col overflow-hidden bg-[#1A2420]"
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-mend-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-1/3 h-48 w-48 rounded-full bg-mend-green/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-6 pb-4 pt-10">
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
        >
          <CloseIcon />
        </button>
        <div className="flex items-center">
          <span className="text-lg" aria-hidden>
            ⚡
          </span>
          <span className="ml-1 text-sm font-semibold text-white">Mend Moment</span>
          <span className="ml-2 rounded-full bg-mend-green px-1.5 py-0.5 text-[10px] font-bold text-white">
            PRO
          </span>
        </div>
        <span className="text-sm font-light text-white/40">{clock}</span>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {captureStep === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center"
            >
              <div className="text-center">
                <p className="text-5xl font-extralight text-white/80">{heroTime}</p>
                <p className="mt-1 text-sm text-white/30">{dateLine}</p>
              </div>
              <motion.button
                type="button"
                data-testid="moment-mic"
                whileTap={{ scale: 0.95 }}
                onClick={handleMicStart}
                className="relative mt-16 flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/10"
              >
                <MicIcon />
              </motion.button>
              <p className="mt-6 px-10 text-center text-base text-white/60">Tap and speak.</p>
              <p className="mt-1 text-center text-xs text-white/30">No prompts. No structure.</p>
              <button
                type="button"
                data-testid="moment-type-instead"
                className="mt-8 cursor-pointer text-xs text-white/30 transition-colors hover:text-white/60"
                onClick={() => setShowTextMode(true)}
              >
                Type instead →
              </button>
            </motion.div>
          ) : null}

          {captureStep === 'recording' ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center"
            >
              <div className="mx-auto flex h-16 w-48 items-end justify-center gap-1.5">
                {BAR_HEIGHTS.map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full bg-mend-green"
                    animate={{ height: [8, h, 16, h * 0.6, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: 'easeInOut',
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-white/70">Listening...</p>
              <p className="mt-4 min-h-12 px-8 text-center text-base italic leading-relaxed text-white/50">
                {interimText || rawText}
              </p>
              <motion.button
                type="button"
                data-testid="moment-stop"
                whileTap={{ scale: 0.95 }}
                onClick={handleStopRecording}
                className="mt-8 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-mend-red/40 bg-mend-red/20"
              >
                <StopSquareIcon />
              </motion.button>
              <p className="mt-3 text-center text-xs text-white/30">Tap to stop</p>
            </motion.div>
          ) : null}

          {captureStep === 'typed' ? (
            <motion.div
              key="typed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="mx-6 rounded-2xl bg-white/10 p-5">
                <SpeechBubbleIcon />
                <p className="mt-2 text-base leading-relaxed text-white/80">{rawText}</p>
                <button
                  type="button"
                  className="mt-3 w-full cursor-pointer text-right text-xs text-white/30"
                  onClick={() => {
                    setShowTextMode(true)
                    setCaptureStep('idle')
                  }}
                >
                  Edit ✎
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-3 px-6">
                <motion.button
                  type="button"
                  data-testid="moment-save"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveMoment}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-mend-green py-4 text-base font-bold text-white"
                >
                  <span aria-hidden>⚡</span>
                  Save this Moment
                </motion.button>
                <button
                  type="button"
                  data-testid="moment-rerecord"
                  className="w-full rounded-2xl bg-white/10 py-4 text-sm font-medium text-white/60"
                  onClick={() => {
                    setRawText('')
                    setInterimText('')
                    latestTranscriptRef.current = ''
                    setCaptureStep('idle')
                  }}
                >
                  ↩ Re-record
                </button>
              </div>
            </motion.div>
          ) : null}

          {captureStep === 'processing' ? (
            <motion.div
              key="processing"
              data-testid="moment-processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <LeafProcessing />
              </motion.div>
              <p data-testid="moment-processing-holding" className="mt-4 text-center text-sm text-white/60">
                Holding this for you...
              </p>
              <p className="mt-1 text-center text-xs text-white/30">Mend is reading what you felt.</p>
            </motion.div>
          ) : null}

          {captureStep === 'saved' && savedMoment ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full flex-col items-center px-4"
            >
              <motion.div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <motion.span
                  className="text-4xl text-mend-green"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  aria-hidden
                >
                  ✓
                </motion.span>
              </motion.div>
              <p className="mt-4 text-center text-2xl font-bold text-white">Moment saved.</p>
              <div className="mt-6 w-full rounded-2xl bg-white/10 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{savedMoment.tagEmoji}</span>
                  <span className="font-semibold text-white">{savedMoment.momentLabel}</span>
                </div>
                <p className="mt-2 text-sm italic text-white/70">&quot;{savedMoment.keyCapture}&quot;</p>
                {savedMoment.patternDetected && savedMoment.patternLabel ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mend-green/20 px-3 py-1">
                    <span className="text-xs">🔁</span>
                    <span className="text-xs font-medium text-mend-green">{savedMoment.patternLabel}</span>
                  </div>
                ) : null}
                <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/40">
                  📋 Added to your next session brief
                </div>
              </div>
              <button
                type="button"
                data-testid="moment-back-home"
                className="mt-8 w-full max-w-sm rounded-2xl bg-white/10 py-4 text-sm font-medium text-white/60"
                onClick={() => navigate('/home')}
              >
                Back to home
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTextMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-20 flex flex-col bg-[#1A2420] px-6 pb-8 pt-16"
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                className="text-xs text-white/40"
                onClick={() => setShowTextMode(false)}
              >
                ← Back to mic
              </button>
              <span className="text-sm font-semibold text-white">Type your moment</span>
              <span className="w-16" />
            </div>
            <textarea
              data-testid="moment-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="What's happening right now? Say it however it comes..."
              className="min-h-[200px] w-full flex-1 resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-base text-white placeholder-white/20 focus:border-mend-green/50 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              data-testid="moment-text-save"
              disabled={rawText.trim().length < 5}
              className="mt-4 w-full rounded-2xl bg-mend-green py-4 font-bold text-white disabled:opacity-40"
              onClick={() => {
                setShowTextMode(false)
                setCaptureStep('typed')
              }}
            >
              Save this Moment ⚡
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <MomentPaywall
        isOpen={paywallOpen}
        firstMoment={moments[0] ?? null}
        onClose={() => {
          setPaywallOpen(false)
          navigate(-1)
        }}
        onUnlock={() => {
          unlockPro()
        }}
      />
    </div>
  )
}

export default MomentCapturePage
