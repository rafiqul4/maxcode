import ReaderShell from "@/components/ReaderShell";
import { getSurahById, getSurahList } from "@/lib/quran";

export default function Home() {
  const surah = getSurahById(1);

  if (!surah) {
    return <div className="p-8 text-sm">Surah not found.</div>;
  }

  return <ReaderShell surah={surah} surahList={getSurahList()} />;
}
