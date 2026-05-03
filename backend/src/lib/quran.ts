import fs from "node:fs";
import path from "node:path";
import type { SearchResult, Surah } from "../types/quran.js";

let quranDataCache: Surah[] | null = null;

/**
 * Load Quran data from JSON file
 * Cached on first load for performance
 */
function loadQuranData(): Surah[] {
  if (quranDataCache) {
    return quranDataCache;
  }

  const dataPath = path.join(process.cwd(), "data", "quran_en.json");

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Quran data file not found: ${dataPath}`);
  }

  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    quranDataCache = JSON.parse(rawData) as Surah[];
    return quranDataCache;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to load Quran data: ${message}`);
  }
}

/**
 * Search Quran verses by query (Arabic or English)
 * Returns up to maxResults matches
 */
export function searchQuran(query: string, maxResults: number = 40): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized || normalized.length < 2) {
    return [];
  }

  const surahs = loadQuranData();
  const results: SearchResult[] = [];

  try {
    for (const surah of surahs) {
      for (const verse of surah.verses) {
        if (results.length >= maxResults) {
          return results;
        }

        const englishMatch = verse.translation.toLowerCase().includes(normalized);
        const arabicMatch = verse.text.includes(query.trim());

        if (englishMatch || arabicMatch) {
          results.push({
            surahId: surah.id,
            surahName: surah.name,
            surahTransliteration: surah.transliteration,
            ayahId: verse.id,
            text: verse.text,
            translation: verse.translation,
          });
        }
      }
    }
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Failed to search Quran data");
  }

  return results;
}

/**
 * Get all surahs metadata (without verses for performance)
 */
export function getAllSurahs(): Surah[] {
  return loadQuranData();
}

/**
 * Get specific surah by ID
 */
export function getSurahById(id: number): Surah | undefined {
  const surahs = loadQuranData();
  return surahs.find((s) => s.id === id);
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: unknown): query is string {
  return typeof query === "string" && query.trim().length >= 2;
}
