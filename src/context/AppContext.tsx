import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { safePick } from '../utils/safeStorage'

const STORAGE_KEY = 'bible-study-app-settings'
const DEFAULT_TRANSLATION = 'ESV'

type AppSettings = {
  translationId: string
}

const SETTINGS_KEYS = ['translationId'] as const
const defaultSettings: AppSettings = {
  translationId: DEFAULT_TRANSLATION,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      const safe = safePick<AppSettings>(parsed, SETTINGS_KEYS)
      return { ...defaultSettings, ...safe }
    }
  } catch {
    // ignore
  }
  return defaultSettings
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

type AppContextValue = {
  translationId: string
  setTranslationId: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setTranslationId = useCallback((translationId: string) => {
    setSettings((prev) => ({ ...prev, translationId }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        translationId: settings.translationId,
        setTranslationId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { DEFAULT_TRANSLATION }
