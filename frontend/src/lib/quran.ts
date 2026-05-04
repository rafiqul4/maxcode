import quranData from "@/data/quran_en.json";
import type { Surah, SurahMeta } from "@/types";

const surahs = quranData as Surah[];

export const getSurahs = () => surahs;

export const getSurahList = (): SurahMeta[] =>
	surahs.map(({ verses, ...meta }) => {
		void verses;
		return meta;
	});

export const getSurahById = (id: number) => surahs.find((surah) => surah.id === id) ?? null;

