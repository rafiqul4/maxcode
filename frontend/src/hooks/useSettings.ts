/**
 * Custom hook for managing settings with localStorage
 */

import { useEffect, useState } from "react";
import type { Settings } from "../types";

const STORAGE_KEY = "quran.settings";

const DEFAULT_SETTINGS: Settings = {
  arabicFont: "amiri",
  arabicSize: 34,
  translationSize: 16,
};

export function useSettings(): [Settings, (settings: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Settings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings, isHydrated]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return [settings, updateSettings];
}
