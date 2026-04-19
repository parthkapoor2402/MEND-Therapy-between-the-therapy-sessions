import { AnimatePresence, motion } from 'framer-motion'
import { formatRelativeTime } from '../../utils/formatRelativeTime.js'

function LockIcon({ className = 'h-5 w-5 text-white' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MomentPaywall({ isOpen, onClose, onUnlock, firstMoment }) {
  const preview = firstMoment?.keyCapture || 'Your words stay here — safe until Thursday.'
  const ts = firstMoment?.timestamp
    ? formatRelativeTime(firstMoment.timestamp)
    : ''

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            key="moment-paywall-scrim"
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            key="moment-paywall-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="moment-paywall-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-[#1A2420] px-6 pb-10 pt-4"
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

            <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <span className="text-3xl" aria-hidden>
                ⚡
              </span>
            </div>

            <h2 id="moment-paywall-title" className="mt-4 text-center text-2xl font-bold text-white">
              Real life doesn&apos;t wait
            </h2>
            <p className="mt-2 px-4 text-center text-sm leading-relaxed text-white/60">
              You&apos;ve used your free Moment. Unlock unlimited captures so nothing important fades before
              Thursday.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base" aria-hidden>
                    ⚡
                  </span>
                  <span className="text-xs text-white/50">Your first Moment</span>
                </div>
                {ts ? <span className="text-xs text-white/40">{ts}</span> : null}
              </div>
              <div className="relative mt-2">
                <p className="line-clamp-2 blur-sm text-sm italic text-white/80">{preview}</p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <LockIcon className="h-5 w-5 shrink-0 text-white" />
                  <span className="ml-2 text-xs text-white/70">Unlock to continue capturing</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <p className="mb-1 text-xs font-semibold text-white/50">With Mend Pro:</p>
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  ⚡
                </span>
                <span className="text-sm text-white/80">
                  Unlimited Mend Moments — capture anything, anytime
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  📋
                </span>
                <span className="text-sm text-white/80">Moments auto-appear in your Pre-Session Brief</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  🔁
                </span>
                <span className="text-sm text-white/80">Patterns detected across Moments + Sessions</span>
              </div>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-mend-green py-4 text-base font-bold text-white"
              onClick={() => onUnlock()}
            >
              <span aria-hidden>⚡</span>
              Unlock Mend Pro →
            </motion.button>
            <p className="mt-3 text-center text-xs text-white/30">Try free forever · Upgrade anytime</p>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default MomentPaywall
