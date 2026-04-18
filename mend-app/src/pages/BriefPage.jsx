import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockBriefBullets, mockUser } from '../data/mockData.js'
import { useMendStore } from '../store/useMendStore.js'
import PageTransition from '../components/ui/PageTransition.jsx'

function sessionPillText() {
  const d = mockUser.nextSessionDate.replace(/^.*,\s*/, '')
  return `${d} · ${mockUser.nextSessionTime}`
}

function headerSessionLine() {
  const day = mockUser.nextSessionDate.split(',')[0]?.trim() ?? mockUser.nextSessionDate
  return `For ${day}'s session with ${mockUser.therapistName}`
}

const BULLET_STYLES = {
  emotion: 'border-l-4 border-mend-warm bg-mend-warmLight',
  belief: 'border-l-4 border-mend-blue bg-mend-blueLight',
  pattern: 'border-l-4 border-mend-green bg-mend-greenLight',
  commitment: 'border-l-4 border-mend-green bg-mend-greenLight',
  openLoop: 'border-l-4 border-mend-border bg-white',
}

function BackArrowIcon() {
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

function PaperPlaneIcon({ className = 'h-5 w-5', stroke = '#4A7C59' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 2L11 13 M22 2L15 22L11 13L2 9L22 2Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIconWhite() {
  return (
    <svg className="h-4 w-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LeafIconSmall() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4A7C59"
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

function CheckIconWhite() {
  return (
    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ShareArrowIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 2L11 13 M22 2L15 22L11 13L2 9L22 2Z"
        stroke="#4A7C59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="#3B82F6" strokeWidth="2" />
      <path
        d="M4 16V6a2 2 0 0 1 2-2h10"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LockIconMuted() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BriefPage() {
  const navigate = useNavigate()
  const { currentBrief } = useMendStore()
  const bullets = currentBrief || mockBriefBullets
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [bulletChecked, setBulletChecked] = useState({})

  const toggleBullet = (id) => {
    setBulletChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const primaryBtnClass =
    'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-mend-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mend-green/90 active:bg-mend-green/80'

  return (
    <PageTransition className="relative flex min-h-screen min-h-[844px] flex-col bg-mend-bg font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-mend-border bg-white px-6 pb-4 pt-10">
        <button
          type="button"
          aria-label="Back to home"
          onClick={() => navigate('/home')}
          className="rounded-full p-2 text-mend-textPrimary transition-colors hover:bg-mend-greenLight active:scale-95"
        >
          <BackArrowIcon />
        </button>
        <h1 className="text-base font-semibold text-mend-textPrimary">Your Brief</h1>
        <button
          type="button"
          aria-label="Share brief"
          onClick={() => setShareModalOpen(true)}
          className="rounded-full p-2 transition-opacity hover:opacity-80 active:opacity-70"
        >
          <PaperPlaneIcon />
        </button>
      </header>

      {/* Header gradient */}
      <div
        className="rounded-b-3xl px-6 pb-8 pt-6 text-white"
        style={{ background: 'linear-gradient(135deg, #4A7C59, #3A6B49)' }}
      >
        <p className="text-xl font-bold">Your week, in your words</p>
        <p className="mt-1 text-sm opacity-80">{headerSessionLine()}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
          <CalendarIconWhite />
          <span className="text-sm font-medium text-white">{sessionPillText()}</span>
        </div>
        <div className="mt-3 flex gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
            Session {mockUser.sessionCount}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
            {bullets.length} insights
          </span>
        </div>
      </div>

      {/* Bullets */}
      <div className="mt-4 flex flex-col gap-3 overflow-y-auto px-4">
        {bullets.map((bullet, index) => {
          const style = BULLET_STYLES[bullet.type] ?? BULLET_STYLES.openLoop
          const isCommitment = bullet.type === 'commitment'
          const checked = Boolean(bulletChecked[bullet.id])

          return (
            <motion.article
              key={bullet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.35 }}
              className={`rounded-r-2xl p-4 ${style}`}
            >
              <div className="flex items-start">
                <span className="text-2xl" aria-hidden>
                  {bullet.emoji}
                </span>
                <div className="ml-2 flex min-w-0 flex-1 items-center gap-2">
                  <p
                    className={`text-sm font-semibold text-mend-textPrimary ${
                      isCommitment && checked ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {bullet.label}
                  </p>
                  {isCommitment && (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label="Mark commitment done"
                      data-testid={`commitment-checkbox-${bullet.id}`}
                      onClick={() => toggleBullet(bullet.id)}
                      className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-mend-green transition-colors ${
                        checked ? 'bg-mend-green' : 'bg-white'
                      }`}
                    >
                      {checked ? <CheckIconWhite /> : null}
                    </button>
                  )}
                </div>
              </div>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  bullet.type === 'belief'
                    ? 'italic text-mend-textPrimary'
                    : 'text-mend-textMuted'
                }`}
              >
                {bullet.detail}
              </p>
            </motion.article>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="mt-4 px-4">
        <div className="flex items-start gap-3 rounded-2xl border border-mend-border bg-white p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mend-greenLight">
            <LeafIconSmall />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-mend-green">mend</p>
            <p className="mt-1 text-xs leading-relaxed text-mend-textMuted">
              These are your words, reflected back. Mend didn&apos;t write this — it listened to you
              and remembered.
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 px-4 pb-28">
        <button
          type="button"
          className={primaryBtnClass}
          aria-label={`Share with ${mockUser.therapistName}`}
          onClick={() => setShareModalOpen(true)}
        >
          <PaperPlaneIcon className="h-4 w-4" stroke="white" />
          Share with {mockUser.therapistName}
        </button>
        <p className="mt-3 text-center text-xs text-mend-textMuted">
          🔒 Sharing is optional. Brief stays private by default.
        </p>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <>
            <motion.button
              key="brief-share-scrim"
              type="button"
              aria-label="Close share modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 bg-black/40"
              onClick={() => setShareModalOpen(false)}
            />
            <motion.div
              key="brief-share-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-sheet-title"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-xl"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-mend-border mx-auto" />
              <h2 id="share-sheet-title" className="mb-4 text-lg font-bold text-mend-textPrimary">
                Share your brief
              </h2>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-4 rounded-2xl bg-mend-bg p-4 text-left transition-colors hover:bg-mend-greenLight"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShareArrowIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-mend-textPrimary">Send as PDF</p>
                    <p className="mt-0.5 text-xs text-mend-textMuted">
                      A clean 1-page summary for your therapist
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-4 rounded-2xl bg-mend-bg p-4 text-left transition-colors hover:bg-mend-greenLight"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <CopyIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-mend-textPrimary">Copy to clipboard</p>
                    <p className="mt-0.5 text-xs text-mend-textMuted">Paste anywhere you like</p>
                  </div>
                </button>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-4 rounded-2xl bg-mend-bg p-4 text-left transition-colors hover:bg-mend-greenLight"
                  onClick={() => setShareModalOpen(false)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <LockIconMuted />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-mend-textPrimary">Keep private</p>
                    <p className="mt-0.5 text-xs text-mend-textMuted">Don&apos;t share — just for me</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

export default BriefPage
