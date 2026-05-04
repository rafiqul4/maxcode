import ReaderShell from "@/components/ReaderShell";
import { ApiStatusPanel } from "@/components/ApiStatusPanel";
import { getSurahById, getSurahList } from "@/lib/quran";

export default function Home() {
  const surah = getSurahById(1);

  if (!surah) {
    return <div className="p-8 text-sm">Surah not found.</div>;
  }

  return (
    <div className="space-y-4 p-4 md:p-6 lg:p-8">
      <ApiStatusPanel />
      <ReaderShell surah={surah} surahList={getSurahList()} />
    </div>
  );
}
