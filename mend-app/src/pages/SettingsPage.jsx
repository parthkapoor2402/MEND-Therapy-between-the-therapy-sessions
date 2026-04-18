import { useNavigate } from 'react-router-dom'
import { useMendStore } from '../store/useMendStore.js'
import { Toggle } from '../components/Toggle.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'

function BackArrow() {
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

function MendLeafLogo({ className = 'h-8 w-8' }) {
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

function DownloadIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReminderBellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" aria-hidden>
      <path d="M12 3a5 5 0 0 0-5 5v3.09L5.2 16h13.6L17 11.09V8a5 5 0 0 0-5-5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" aria-hidden>
      <path d="M5 18V6M12 18V10M19 18V14" strokeLinecap="round" />
    </svg>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const allDebriefs = useMendStore((s) => s.allDebriefs)
  const profile = useMendStore((s) => s.profile)
  const notificationSettings = useMendStore((s) => s.notificationSettings)
  const setNotificationSettings = useMendStore((s) => s.setNotificationSettings)

  const nextSessionFormatted = `${profile.nextSessionDate.replace(/^.*,\s*/, '')}, ${profile.nextSessionTime}`

  const exportData = () => {
    const dataStr = JSON.stringify(allDebriefs, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mend-data.json'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    if (window.confirm('Delete all your Mend data? This cannot be undone.')) {
      useMendStore.getState().restartFromYourDostDiscovery()
      window.location.href = '/'
    }
  }

  const rowClass = 'flex items-center justify-between px-4 py-3'

  return (
    <PageTransition className="relative flex min-h-full min-h-[844px] flex-1 flex-col bg-mend-bg pb-10 font-sans">
      <div className="flex shrink-0 items-center gap-2 px-4 pt-3">
        <button
          type="button"
          aria-label="Back to home"
          onClick={() => navigate('/home')}
          className="rounded-full p-2 text-mend-textPrimary transition-colors hover:bg-mend-greenLight active:scale-95"
        >
          <BackArrow />
        </button>
        <span className="text-sm font-semibold text-mend-textPrimary">Settings</span>
      </div>

      <section className="px-4 pt-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">YOUR SETUP</p>
        <div className="divide-y divide-mend-border overflow-hidden rounded-2xl border border-mend-border bg-white">
          <div className={rowClass}>
            <span className="text-sm font-medium text-mend-textPrimary">Name</span>
            <span className="text-sm text-mend-textMuted">{profile.fullName}</span>
          </div>
          <div className={rowClass}>
            <span className="text-sm font-medium text-mend-textPrimary">Therapist</span>
            <span className="text-sm text-mend-textMuted">{profile.therapistName}</span>
          </div>
          <div className={rowClass}>
            <span className="text-sm font-medium text-mend-textPrimary">Platform</span>
            <span className="rounded-full bg-mend-ydTealLight px-3 py-1 text-xs font-medium text-mend-ydTeal">
              {profile.platform}
            </span>
          </div>
          <div className={rowClass}>
            <span className="text-sm font-medium text-mend-textPrimary">Next session</span>
            <span className="text-sm text-mend-textMuted">{nextSessionFormatted}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">NOTIFICATIONS</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                <ReminderBellIcon />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-mend-textPrimary">Session reminders</p>
                <p className="mt-0.5 text-xs text-mend-textMuted">Nudge me 30 mins after a session</p>
              </div>
            </div>
            <Toggle
              on={notificationSettings.sessionReminders}
              onToggle={(v) => setNotificationSettings({ sessionReminders: v })}
              ariaLabel="Session reminders"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                <CalendarIcon />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-mend-textPrimary">Pre-session brief</p>
                <p className="mt-0.5 text-xs text-mend-textMuted">Send my brief 24hrs before therapy</p>
              </div>
            </div>
            <Toggle
              on={notificationSettings.preSessionBrief}
              onToggle={(v) => setNotificationSettings({ preSessionBrief: v })}
              ariaLabel="Pre-session brief"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mend-border bg-white p-4 shadow-sm">
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mend-greenLight">
                <ChartIcon />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-mend-textPrimary">Weekly pulse</p>
                <p className="mt-0.5 text-xs text-mend-textMuted">Sunday evening pattern digest</p>
              </div>
            </div>
            <Toggle
              on={notificationSettings.pulseDigest}
              onToggle={(v) => setNotificationSettings({ pulseDigest: v })}
              ariaLabel="Weekly pulse"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-mend-textMuted">PRIVACY & DATA</p>
        <button
          type="button"
          onClick={exportData}
          className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-mend-border bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mend-blueLight">
            <DownloadIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-mend-textPrimary">Export my data</p>
            <p className="mt-0.5 text-xs text-mend-textMuted">Download all your debriefs as JSON</p>
          </div>
        </button>

        <button
          type="button"
          onClick={deleteAllData}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-mend-red/20 bg-white p-4 text-left shadow-sm transition-colors hover:bg-mend-redLight/30"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mend-redLight">
            <TrashIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-mend-red">Delete all my data</p>
            <p className="mt-0.5 text-xs text-mend-textMuted">This cannot be undone</p>
          </div>
        </button>
      </section>

      <section className="mt-6 px-4 pb-8">
        <div className="rounded-2xl border border-mend-border bg-white p-4 text-center shadow-sm">
          <div className="flex justify-center">
            <MendLeafLogo />
          </div>
          <p className="mt-2 text-sm font-bold text-mend-green">mend</p>
          <p className="mt-1 text-xs text-mend-textMuted">MVP 1.0 · Product Arena 3.0</p>
          <p className="mt-1 text-xs text-mend-textMuted">Built with care for your mental wellness 🌿</p>
        </div>
      </section>
    </PageTransition>
  )
}

export default SettingsPage
