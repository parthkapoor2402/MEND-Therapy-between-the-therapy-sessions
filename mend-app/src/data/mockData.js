// YourDost mock data
export const mockYourDostUser = {
  name: 'Priya',
  counselorName: 'Dr. Meera Nair',
  counselorSpecialty: 'Anxiety & Relationships',
  counselorInitials: 'MN',
  sessionCount: 7,
  upcomingSession: 'Thursday, April 24 · 6:00 PM',
}

export const mockYourDostCounselors = [
  {
    id: 1,
    initials: 'MN',
    name: 'Dr. Meera Nair',
    specialty: 'Anxiety & Relationships',
    rating: '4.9',
    available: true,
  },
  {
    id: 2,
    initials: 'RS',
    name: 'Riya Sharma',
    specialty: 'Stress & Work-Life',
    rating: '4.8',
    available: true,
  },
  {
    id: 3,
    initials: 'AK',
    name: 'Dr. Arjun Khanna',
    specialty: 'Depression & CBT',
    rating: '4.7',
    available: false,
  },
]

export const mockYourDostArticles = [
  { id: 1, title: '5 ways to manage anxiety at work', tag: 'Anxiety', readTime: '3 min' },
  { id: 2, title: 'Why sleep affects your mental health', tag: 'Wellness', readTime: '4 min' },
]

// Mend user data
export const mockUser = {
  name: 'Priya Sharma',
  age: 26,
  platform: 'YourDost',
  therapistName: 'Dr. Meera Nair',
  nextSessionDate: 'Thursday, April 24',
  nextSessionTime: '6:00 PM',
  sessionCount: 7,
  reflectionTime: '9:00 PM',
}

export const mockDebriefEntries = [
  {
    id: 1,
    prompt: 'emotion',
    question: 'What was one moment today where you felt something strongly?',
    answer:
      "When she asked me about my mother, I got really quiet. I didn't expect that.",
    tag: '💛',
    tagLabel: 'Emotional Shift',
  },
  {
    id: 2,
    prompt: 'belief',
    question: 'Did anything you said today surprise you?',
    answer: "I said I don't actually believe I deserve to rest. That came out of nowhere.",
    tag: '💡',
    tagLabel: 'Belief Noticed',
  },
  {
    id: 3,
    prompt: 'pattern',
    question: 'Is there a feeling or situation that keeps coming up?',
    answer: "The feeling that I'm always performing — at work, even at home.",
    tag: '🔁',
    tagLabel: 'Pattern',
  },
  {
    id: 4,
    prompt: 'commitment',
    question: 'What did your therapist suggest you try before next time?',
    answer:
      "She said to notice when I'm performing vs. when I'm just being — name it in the moment.",
    tag: '✅',
    tagLabel: 'Commitment',
  },
  {
    id: 5,
    prompt: 'openLoop',
    question: 'Is there anything unfinished you want to bring up next time?',
    answer: 'I wanted to talk about my relationship with my sister but we ran out of time.',
    tag: '❓',
    tagLabel: 'Unfinished',
  },
]

export const mockBriefBullets = [
  {
    id: 1,
    emoji: '💛',
    label: 'You felt something shift',
    detail: 'when the conversation turned to your mother — unexpected, unresolved.',
    type: 'emotion',
  },
  {
    id: 2,
    emoji: '💡',
    label: 'You said something that surprised you:',
    detail: '"I don\'t believe I deserve to rest." That felt true when it came out.',
    type: 'belief',
  },
  {
    id: 3,
    emoji: '🔁',
    label: 'A pattern showed up again:',
    detail: 'The feeling of always performing — at work, at home, everywhere.',
    type: 'pattern',
  },
  {
    id: 4,
    emoji: '✅',
    label: 'You wanted to try:',
    detail:
      "Noticing when you're performing vs. just being — naming it in the moment.",
    type: 'commitment',
  },
  {
    id: 5,
    emoji: '❓',
    label: "You didn't get to:",
    detail: 'Your relationship with your sister. You wanted to bring this up.',
    type: 'openLoop',
  },
]

export const mockPulsePatterns = [
  {
    id: 1,
    type: 'recurring',
    icon: '🔁',
    title: '"Always performing" showed up 4 times this week',
    detail:
      'Different contexts — work, home, a conversation with a friend — but the same underlying feeling each time.',
    contexts: ['Work meeting', 'Home', 'With a friend', 'Commute'],
    addToBrief: false,
  },
  {
    id: 2,
    type: 'shift',
    icon: '📍',
    title: 'Tuesday changed something',
    detail:
      'Your mood dropped after Tuesday and didn\'t fully recover. You mentioned "that meeting" twice but didn\'t elaborate. Worth exploring?',
    addToBrief: false,
  },
  {
    id: 3,
    type: 'regression',
    icon: '⚠️',
    title: 'A pattern from Week 1 is back',
    detail: 'Same belief. Different words.',
    quote1: '"I don\'t believe I deserve to rest." — Week 1',
    quote2: '"I keep pushing through even when I\'m exhausted." — This week',
    addToBrief: false,
  },
]
