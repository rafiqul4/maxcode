import quranData from "@/data/quran_en.json";

export type Verse = {
  id: number;
  text: string;
  translation: string;
};

export type Surah = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: Verse[];
};

export type SurahMeta = Omit<Surah, "verses">;

const surahs = quranData as Surah[];

const surahOffsets = surahs.reduce<number[]>((acc, surah, index) => {
  const previousTotal = index === 0 ? 0 : acc[index - 1] + surahs[index - 1].total_verses;
  acc.push(previousTotal);
  return acc;
}, []);

export const getSurahs = () => surahs;

export const getSurahList = (): SurahMeta[] =>
  surahs.map(({ verses, ...meta }) => meta);

export const getSurahById = (id: number) => surahs.find((surah) => surah.id === id) ?? null;

export const getGlobalAyahId = (surahId: number, ayahId: number) => {
  const index = Math.max(0, Math.min(surahOffsets.length - 1, surahId - 1));
  return surahOffsets[index] + ayahId;
};

export type SearchResult = {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  ayahId: number;
  text: string;
  translation: string;
};

export const searchAyahs = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [] as SearchResult[];

  const results: SearchResult[] = [];

  for (const surah of surahs) {
    for (const verse of surah.verses) {
      const english = verse.translation.toLowerCase();
      const matchesEnglish = english.includes(normalized);
      const matchesArabic = verse.text.includes(query.trim());

      if (matchesEnglish || matchesArabic) {
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

  return results;
};
