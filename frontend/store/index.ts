import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Roadmap, User, ChatMessage } from '@/types'

interface AppState {
  user: User | null
  currentRoadmap: Roadmap | null
  savedRoadmaps: Roadmap[]
  chatHistory: ChatMessage[]
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setCurrentRoadmap: (roadmap: Roadmap | null) => void
  setSavedRoadmaps: (roadmaps: Roadmap[]) => void
  addSavedRoadmap: (roadmap: Roadmap) => void
  setChatHistory: (messages: ChatMessage[]) => void
  addChatMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentRoadmap: null,
      savedRoadmaps: [],
      chatHistory: [],
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),

      setSavedRoadmaps: (roadmaps) => set({ savedRoadmaps: roadmaps }),

      addSavedRoadmap: (roadmap) =>
        set((state) => ({
          savedRoadmaps: [roadmap, ...state.savedRoadmaps.filter(r => r.id !== roadmap.id)]
        })),

      setChatHistory: (messages) => set({ chatHistory: messages }),

      addChatMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message]
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      logout: () =>
        set({
          user: null,
          currentRoadmap: null,
          chatHistory: []
        }),
    }),
    {
      name: 'roadmapai-storage',
      partialize: (state) => ({
        user: state.user,
        savedRoadmaps: state.savedRoadmaps,
      }),
    }
  )
)
