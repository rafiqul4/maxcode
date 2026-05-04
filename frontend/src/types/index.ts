/**
 * Shared types between frontend and backend
 */

export interface Verse {
  id: number;
  text: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: Verse[];
}

export type SurahMeta = Omit<Surah, "verses">;

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  ayahId: number;
  text: string;
  translation: string;
}

export interface Settings {
  arabicFont: "amiri" | "scheherazade";
  arabicSize: number;
  translationSize: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export * from "./api";
