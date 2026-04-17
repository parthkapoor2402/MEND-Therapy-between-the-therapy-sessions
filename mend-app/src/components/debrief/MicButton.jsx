import { motion } from 'framer-motion'

function MicIconWhite() {
  return (
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
  )
}

export function MicButton({ recording, onToggle }) {
  return (
    <motion.button
      type="button"
      data-testid="debrief-mic"
      aria-label={recording ? 'Stop recording' : 'Start recording'}
      aria-pressed={recording}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={`flex h-24 w-24 items-center justify-center rounded-full bg-mend-green shadow-lg transition-shadow ${
        recording ? 'ring-4 ring-mend-green/40 ring-offset-2 ring-offset-mend-bg' : ''
      }`}
    >
      <MicIconWhite />
    </motion.button>
  )
}
