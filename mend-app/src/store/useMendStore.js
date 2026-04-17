import { create } from 'zustand'

export const useMendStore = create((set) => ({
  onboardingComplete: false,
  currentDebriefStep: 0,
  debriefAnswers: {},
  briefGenerated: false,
  pulsePatterns: [],
  sessionScheduled: true,
  setOnboardingComplete: (val) => set({ onboardingComplete: val }),
  setDebriefStep: (step) => set({ currentDebriefStep: step }),
  setDebriefAnswer: (promptId, answer) =>
    set((state) => ({
      debriefAnswers: { ...state.debriefAnswers, [promptId]: answer },
    })),
  setBriefGenerated: (val) => set({ briefGenerated: val }),
  addPulseToBreif: (id) =>
    set((state) => ({
      pulsePatterns: [
        ...state.pulsePatterns.filter((p) => p.id !== id),
        { id, addToBrief: true },
      ],
    })),
}))
