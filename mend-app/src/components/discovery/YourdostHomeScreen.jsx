import {
  mockYourDostArticles,
  mockYourDostCounselors,
  mockYourDostUser,
} from '../../data/mockData'
import { MendRecommendedCard } from './MendRecommendedCard'

const MOODS = ['😞', '😕', '😐', '🙂', '😊']
const MOOD_LABELS = ['Sad', 'Low', 'Neutral', 'Good', 'Great']

function StatusBarRightIcons() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <svg width="18" height="10" viewBox="0 0 18 10" className="text-white">
        <rect x="0" y="6" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.85" />
        <rect x="4" y="4" width="3" height="6" rx="0.5" fill="currentColor" opacity="0.9" />
        <rect x="8" y="2" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.95" />
        <rect x="12" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
      </svg>
      <svg width="22" height="10" viewBox="0 0 22 10" className="text-white">
        <rect x="1" y="2" width="16" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <rect x="18" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
      </svg>
    </div>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      {[0, 7, 14].map((y) => (
        <rect key={y} y={y} width="22" height="2" rx="1" fill="white" />
      ))}
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a5 5 0 0 0-5 5v3.09L5.2 16h13.6L17 11.09V8a5 5 0 0 0-5-5Z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ChatBubbleIcon() {
  return (
    <svg className="mx-auto h-7 w-7 text-mend-ydTeal" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-4 3v-3H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="mx-auto h-7 w-7 text-gray-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="mx-auto h-7 w-7 text-gray-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg className="mx-auto h-7 w-7 text-gray-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="4" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function YourdostHomeScreen() {
  return (
    <div className="flex min-h-[844px] flex-col bg-white font-sans">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        {/* Status bar mock */}
        <div className="flex h-6 items-center justify-between bg-mend-ydTeal px-3 text-[11px] font-medium text-white">
          <span>9:41</span>
          <StatusBarRightIcons />
        </div>

        {/* YourDOST header */}
        <header className="flex items-center justify-between bg-mend-ydTeal px-4 py-3 text-white">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-md p-1 transition-colors hover:bg-white/10 active:bg-white/20"
          >
            <HamburgerIcon />
          </button>
          <h1 className="text-lg font-bold tracking-wide">YourDOST</h1>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-md p-1 transition-colors hover:bg-white/10 active:bg-white/20"
          >
            <BellIcon />
            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-mend-ydTeal" />
          </button>
        </header>

        {/* Greeting */}
        <section className="bg-white px-4 py-4">
          <p className="text-xl font-bold text-gray-800">
            Hi {mockYourDostUser.name} 👋
          </p>
          <p className="text-sm text-gray-500">How are you feeling today?</p>
          <div className="mt-4 flex justify-between gap-2">
            {MOODS.map((emoji, i) => (
              <button
                key={emoji}
                type="button"
                aria-label={`Mood: ${MOOD_LABELS[i]}`}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-2xl transition-colors hover:border-mend-ydTeal active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">Track your mood</p>
        </section>

        {/* Counselors */}
        <section className="mt-2 bg-white px-4 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Your Counsellors</h2>
            <button
              type="button"
              className="text-sm text-mend-ydTeal transition-colors hover:underline active:opacity-80"
              aria-label="See all counsellors"
            >
              See all →
            </button>
          </div>
          <div className="-mx-1 flex gap-0 overflow-x-auto px-1 pb-1">
            {mockYourDostCounselors.map((c, idx) => (
              <div
                key={c.id}
                className={`w-36 shrink-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm ${idx < mockYourDostCounselors.length - 1 ? 'mr-3' : ''}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-mend-ydTeal to-mend-green text-sm font-bold text-white">
                  {c.initials}
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-gray-900">{c.name}</p>
                <p className="line-clamp-1 text-xs text-gray-500">{c.specialty}</p>
                <p className="mt-1 text-xs text-gray-600">
                  <span aria-hidden>⭐</span> {c.rating}
                </p>
                <p
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    c.available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.available ? 'Available now' : 'Busy'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="border-y border-gray-100 bg-white px-4 py-3">
          <div className="flex">
            <button
              type="button"
              aria-label="Talk now"
              className="w-1/4 py-2 text-center transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <ChatBubbleIcon />
              <span className="mt-1 block text-xs text-gray-600">Talk Now</span>
            </button>
            <button
              type="button"
              aria-label="Book session"
              className="w-1/4 py-2 text-center transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <CalendarIcon />
              <span className="mt-1 block text-xs text-gray-600">Book Session</span>
            </button>
            <button
              type="button"
              aria-label="Articles"
              className="w-1/4 py-2 text-center transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <BookIcon />
              <span className="mt-1 block text-xs text-gray-600">Articles</span>
            </button>
            <button
              type="button"
              aria-label="Tests"
              className="w-1/4 py-2 text-center transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <ClipboardIcon />
              <span className="mt-1 block text-xs text-gray-600">Tests</span>
            </button>
          </div>
        </section>

        <MendRecommendedCard />

        {/* Articles */}
        <section className="px-4 pb-24 pt-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Explore Articles</h2>
            <button
              type="button"
              className="text-sm text-mend-ydTeal transition-colors hover:underline active:opacity-80"
              aria-label="See all articles"
            >
              See all →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {mockYourDostArticles.map((article, i) => (
              <article
                key={article.id}
                className="flex flex-row gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div
                  className={`h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br ${
                    i % 2 === 0
                      ? 'from-mend-ydTeal to-mend-warm'
                      : 'from-mend-warm to-mend-ydTeal'
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-mend-ydTealLight px-2 py-0.5 text-xs text-mend-ydTeal">
                    {article.tag}
                  </span>
                  <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{article.readTime}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky bottom CTA */}
      <div className="flex shrink-0 items-center justify-between bg-[#00897B] px-4 py-3 text-white">
        <span className="text-sm font-medium">Ready to talk?</span>
        <button
          type="button"
          aria-label="Book a session"
          className="rounded-full border border-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 active:bg-white/20"
        >
          Book Session
        </button>
      </div>
    </div>
  )
}
