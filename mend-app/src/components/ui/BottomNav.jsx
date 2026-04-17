import { useLocation, useNavigate } from 'react-router-dom'

function HomeIcon({ active }) {
  const stroke = active ? '#4A7C59' : '#6B7280'
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon({ active }) {
  const stroke = active ? '#4A7C59' : '#6B7280'
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DocumentIcon({ active }) {
  const stroke = active ? '#4A7C59' : '#6B7280'
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h8a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 0 1 2-2Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChartIcon({ active }) {
  const stroke = active ? '#4A7C59' : '#6B7280'
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 18V8M12 18V4M19 18v-6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { path: '/home', label: 'Home', Icon: HomeIcon },
  { path: '/debrief', label: 'Debrief', Icon: MicIcon },
  { path: '/brief', label: 'Brief', Icon: DocumentIcon },
  { path: '/pulse', label: 'Pulse', Icon: ChartIcon },
]

function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-mend-border bg-white px-2 pb-4 pt-2"
      aria-label="Main navigation"
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            type="button"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(path)}
            className="flex min-h-[48px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-1 transition-colors hover:opacity-90 active:opacity-80"
          >
            <Icon active={active} />
            {active ? (
              <span className="text-xs font-semibold text-mend-green">{label}</span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export { BottomNav }
export default BottomNav
