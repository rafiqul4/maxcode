import quranData from "@/data/quran_en.json";
import type { Surah, SurahMeta, Verse } from "@/types";

const surahs = quranData as Surah[];

export const getSurahs = () => surahs;

export const getSurahList = (): SurahMeta[] =>
  surahs.map(({ verses, ...meta }) => meta);

export const getSurahById = (id: number) => surahs.find((surah) => surah.id === id) ?? null;

