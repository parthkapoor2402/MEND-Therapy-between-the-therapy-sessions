import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultProfile = {
  fullName: 'Priya Sharma',
  therapistName: 'Dr. Meera Nair',
  therapistInitials: 'MN',
  nextSessionDate: 'Thursday, April 24',
  nextSessionTime: '6:00 PM',
  platform: 'YourDost',
}

const defaultNotificationSettings = {
  sessionReminders: true,
  preSessionBrief: true,
  pulseDigest: true,
}

/** Full reset: empty memory jar, Mend session state, and show YourDOST discovery again. */
const freshAppSlice = () => ({
  onboardingComplete: false,
  currentDebriefStep: 0,
  debriefAnswers: {},
  allDebriefs: [],
  briefGenerated: false,
  currentBrief: null,
  pulsePatterns: [],
  addedToBriefIds: [],
  profile: { ...defaultProfile },
  notificationSettings: { ...defaultNotificationSettings },
})

export const useMendStore = create(
  persist(
    (set) => ({
      ...freshAppSlice(),

      setOnboardingComplete: (val) => set({ onboardingComplete: val }),
      setDebriefStep: (step) => set({ currentDebriefStep: step }),
      setDebriefAnswer: (promptId, answer) =>
        set((state) => ({
          debriefAnswers: { ...state.debriefAnswers, [promptId]: answer },
        })),
      saveCompletedDebrief: (answers) =>
        set((state) => ({
          allDebriefs: [
            ...state.allDebriefs,
            {
              id: Date.now(),
              date: new Date().toISOString(),
              answers,
            },
          ],
          debriefAnswers: answers,
          briefGenerated: true,
        })),
      setCurrentBrief: (bullets) => set({ currentBrief: bullets }),
      setPulsePatterns: (patterns) => set({ pulsePatterns: patterns }),
      addPulseToBreif: (id) =>
        set((state) => ({
          addedToBriefIds: [...state.addedToBriefIds, id],
        })),
      resetDebrief: () => set({ currentDebriefStep: 0, debriefAnswers: {} }),
      restartFromYourDostDiscovery: () => set(freshAppSlice()),
      setNotificationSettings: (partial) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...partial },
        })),
      setProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),
    }),
    {
      name: 'mend-storage',
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        profile: { ...defaultProfile, ...(persisted?.profile ?? {}) },
        notificationSettings: {
          ...defaultNotificationSettings,
          ...(persisted?.notificationSettings ?? {}),
        },
      }),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        allDebriefs: state.allDebriefs,
        currentBrief: state.currentBrief,
        pulsePatterns: state.pulsePatterns,
        briefGenerated: state.briefGenerated,
        profile: state.profile,
        notificationSettings: state.notificationSettings,
      }),
    },
  ),
)
