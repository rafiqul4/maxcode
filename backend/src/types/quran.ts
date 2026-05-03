/**
 * Core Quran data types
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

export interface SurahMeta extends Omit<Surah, "verses"> {}

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  ayahId: number;
  text: string;
  translation: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export interface ErrorResponse {
  error: string;
  status: number;
  timestamp: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded";
  uptime: number;
  timestamp: string;
  environment: string;
}
