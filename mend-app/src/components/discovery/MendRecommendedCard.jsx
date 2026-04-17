import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function MendLeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
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

export function MendRecommendedCard() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="mx-4 my-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div className="overflow-hidden rounded-2xl border border-mend-greenLight bg-white shadow-sm">
        <div className="flex flex-row items-center justify-between bg-mend-green px-4 py-2">
          <span className="text-xs font-semibold text-white">✨ Recommended for you</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">New</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex flex-row items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mend-green"
              aria-hidden
            >
              <MendLeafIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-mend-textPrimary">mend</p>
              <p className="text-xs text-mend-textMuted">Between-session memory</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-base font-semibold text-mend-textPrimary">
              {"Don't lose what happened in therapy."}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-mend-textMuted">
              {
                "Mend captures your session insights, prepares you before the next one, and notices patterns you can't see yourself."
              }
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-mend-greenLight px-3 py-1 text-xs font-medium text-mend-green">
              🎤 3-min voice debrief
            </span>
            <span className="rounded-full bg-mend-greenLight px-3 py-1 text-xs font-medium text-mend-green">
              📋 Pre-session brief
            </span>
            <span className="rounded-full bg-mend-greenLight px-3 py-1 text-xs font-medium text-mend-green">
              🔁 Pattern detection
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-mend-textMuted">🔒 Opt-in only</span>
            <motion.button
              type="button"
              aria-label="Try Mend free, go to onboarding"
              className="rounded-full bg-mend-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mend-green/90 active:bg-mend-green/80"
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/onboarding')}
            >
              Try free →
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
