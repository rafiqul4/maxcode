/**
 * Custom hook for managing settings with localStorage
 */

import { useEffect, useRef, useState } from "react";
import type { Settings } from "../types";

const STORAGE_KEY = "quran.settings";

const DEFAULT_SETTINGS: Settings = {
  arabicFont: "amiri",
  arabicSize: 34,
  translationSize: 16,
};

export function useSettings(): [Settings, (settings: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Partial<Settings>) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return DEFAULT_SETTINGS;
    }
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return [settings, updateSettings];
}
