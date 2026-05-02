import ReaderShell from "@/components/ReaderShell";
import { getSurahById, getSurahList } from "@/lib/quran";

export async function generateStaticParams() {
  return getSurahList().map((surah) => ({
    surahId: surah.id.toString(),
  }));
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ surahId: string }>;
}) {
  const { surahId } = await params;
  const id = Number(surahId);
  const surah = getSurahById(id);

  if (!surah) {
    return <div className="p-8 text-sm">Surah not found.</div>;
  }

  return <ReaderShell surah={surah} surahList={getSurahList()} />;
}
