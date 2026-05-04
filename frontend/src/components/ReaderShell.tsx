"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useSearch } from "@/hooks/useSearch";
import { formatSurahNumber, formatRevelationLabel } from "@/utils/format";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { IconButton } from "@/components/ui/IconButton";
import type { Surah, SurahMeta } from "@/types";

interface ReaderShellProps {
  surah: Surah;
  surahList: SurahMeta[];
}

interface AudioPlayState {
  surahId: number;
  ayahId: number;
}

const ARABIC_FONT_OPTIONS = [
  { value: "amiri" as const, label: "Amiri", sample: "أميري" },
  { value: "scheherazade" as const, label: "Scheherazade New", sample: "شهرزاد" },
];

/**
 * Main Quran reader component
 * Handles UI layout, search, audio playback, and settings
 */
export default function ReaderShell({ surah, surahList }: ReaderShellProps) {
  const [settings, updateSettings] = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surahDrawerOpen, setSurahDrawerOpen] = useState(false);
  const [activeAyah, setActiveAyah] = useState<AudioPlayState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { query, setQuery, results, isLoading: isSearching, error: searchError } = useSearch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate global ayah ID for audio URL
  const getGlobalAyahId = (surahId: number, ayahId: number): number => {
    let offset = 0;
    for (let i = 0; i < surahId - 1; i++) {
      offset += surahList[i].total_verses;
    }
    return offset + ayahId;
  };

  // Apply CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--arabic-font",
      settings.arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)"
    );
    root.style.setProperty("--arabic-size", `${settings.arabicSize}px`);
    root.style.setProperty("--translation-size", `${settings.translationSize}px`);
  }, [settings]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (surahDrawerOpen || settingsOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [settingsOpen, surahDrawerOpen]);

  // Handle audio playback
  const playAyah = async (surahId: number, ayahId: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const isCurrentAyah = activeAyah?.surahId === surahId && activeAyah?.ayahId === ayahId;

    // Toggle play/pause if same ayah
    if (isCurrentAyah && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Load new ayah or resume
    if (!isCurrentAyah) {
      const globalAyahId = getGlobalAyahId(surahId, ayahId);
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahId}.mp3`;

      audio.src = audioUrl;
      setActiveAyah({ surahId, ayahId });
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to play audio";
      setError(`Audio error: ${message}`);
      setIsPlaying(false);
    }
  };

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-[76px] shrink-0 flex-col items-center border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] px-2 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--accent)] shadow-[var(--card-shadow)]">
            <BookIcon className="h-6 w-6" />
          </div>

          <div className="mt-6 flex flex-1 flex-col items-center gap-3">
            <Link
              href="/surah/1"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Open surah reader"
            >
              <HomeIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Open surah list"
              onClick={() => setSurahDrawerOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Bookmarks"
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Notes"
            >
              <NoteIcon className="h-5 w-5" />
            </button>
          </div>
        </aside>

        <aside className="hidden xl:flex w-[350px] shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--surface-1)]">
          <div className="border-b border-[var(--border-color)] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-dim)]">Surah Library</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">114 Chapters</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Choose any surah to open its ayah reader.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {surahList.map((item) => {
              const active = item.id === surah.id;

              return (
                <Link
                  key={item.id}
                  href={`/surah/${item.id}`}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                    active
                      ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-[var(--card-shadow)]"
                      : "border-transparent bg-transparent hover:border-[var(--border-color)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "border-[var(--border-color)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                    }`}
                  >
                    {formatSurahNumber(item.id)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {item.transliteration}
                      </span>
                      <span className="rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
                        {item.type === "meccan" ? "Makkah" : "Madinah"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{item.translation}</p>
                  </div>
                  <span className="shrink-0 arabic-text text-right text-2xl text-[var(--text-primary)]">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border-color)] bg-[var(--surface-1)]/95 px-4 py-4 backdrop-blur md:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] xl:hidden"
                  onClick={() => setSurahDrawerOpen(true)}
                  aria-label="Open surah list"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold tracking-[0.16em] text-[var(--text-primary)]">Quran Mazid</p>
                  <p className="text-xs text-[var(--text-muted)]">Read, Study, and Learn the Quran</p>
                </div>
              </div>

              <div className="relative min-w-[250px] flex-1">
                <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-4 py-2.5">
                  <SearchIcon className="h-4 w-4 text-[var(--text-dim)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Arabic or English translation"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none"
                  />
                </div>

                {(query.trim().length > 0 || results.length > 0) && (
                  <div className="absolute left-0 right-0 z-20 mt-3 max-h-[340px] overflow-y-auto rounded-3xl border border-[var(--border-color)] bg-[var(--surface-3)] p-3 shadow-[var(--card-shadow)]">
                    {isSearching ? (
                      <LoadingSpinner />
                    ) : results.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-[var(--text-muted)]">No results found.</p>
                    ) : (
                      results.slice(0, 20).map((result) => (
                        <Link
                          key={`${result.surahId}:${result.ayahId}`}
                          href={`/surah/${result.surahId}`}
                          className="flex flex-col gap-1 rounded-2xl px-3 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                          onClick={() => setQuery("")}
                        >
                          <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
                            {formatSurahNumber(result.surahId)}:{result.ayahId} {result.surahTransliteration}
                          </span>
                          <span className="arabic-text text-right text-base text-[var(--text-primary)]">
                            {result.text}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">{result.translation}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
                  <SettingsIcon className="h-5 w-5" />
                </IconButton>
                <IconButton label="Theme">
                  <MoonIcon className="h-5 w-5" />
                </IconButton>
                <IconButton label="Profile">
                  <UserIcon className="h-5 w-5" />
                </IconButton>
              </div>
            </div>
          </header>

          {(error || searchError) && (
            <div className="px-4 py-2 md:px-6 lg:px-8">
              <ErrorBanner message={error || searchError || "Unknown error"} onDismiss={() => setError(null)} />
            </div>
          )}

          <section className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-2)] shadow-[var(--card-shadow)]">
              <div className="flex flex-wrap items-center gap-4 border-b border-[var(--border-color)] px-5 py-5 md:px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-3)] text-[var(--accent)]">
                  <CompassIcon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-dim)]">
                    Surah {formatSurahNumber(surah.id)} • {formatRevelationLabel(surah.type)}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
                    {surah.transliteration}
                  </h1>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {surah.name} • {surah.translation} • {surah.total_verses} Ayahs
                  </p>
                </div>
                <div className="rounded-full border border-[var(--border-color)] bg-[var(--surface-3)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--text-dim)]">
                  {formatRevelationLabel(surah.type)}
                </div>
              </div>

              <div className="space-y-4 p-4 md:p-6">
                {surah.verses.map((verse) => {
                  const isActive = activeAyah?.surahId === surah.id && activeAyah?.ayahId === verse.id;

                  return (
                    <article
                      key={`${surah.id}:${verse.id}`}
                      className={`rounded-[1.75rem] border px-5 py-5 transition ${
                        isActive
                          ? "border-[var(--accent)] bg-[rgba(240,180,41,0.06)]"
                          : "border-[var(--border-color)] bg-[var(--surface-1)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-semibold text-[var(--text-dim)]">
                          {formatSurahNumber(surah.id)}:{verse.id}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <IconButton
                            label={isActive && isPlaying ? "Pause" : "Play"}
                            onClick={() => playAyah(surah.id, verse.id)}
                            variant={isActive && isPlaying ? "primary" : "default"}
                          >
                            {isActive && isPlaying ? (
                              <PauseIcon className="h-5 w-5" />
                            ) : (
                              <PlayIcon className="h-5 w-5" />
                            )}
                          </IconButton>
                          <IconButton label="Bookmark">
                            <BookmarkIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton label="Copy">
                            <CopyIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton label="Share">
                            <ShareIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <p className="arabic-text text-right text-[var(--text-primary)]">{verse.text}</p>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
                            Saheeh International
                          </p>
                          <p className="translation-text text-[var(--text-muted)]">{verse.translation}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>

      {surahDrawerOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setSurahDrawerOpen(false)}>
          <aside
            className="absolute left-0 top-0 flex h-full w-[min(90vw,22rem)] flex-col border-r border-[var(--border-color)] bg-[var(--surface-1)] shadow-[var(--card-shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-dim)]">Surah Library</p>
                <h3 className="mt-2 text-lg font-semibold">114 Chapters</h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-primary)]"
                onClick={() => setSurahDrawerOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {surahList.map((item) => {
                const active = item.id === surah.id;

                return (
                  <Link
                    key={item.id}
                    href={`/surah/${item.id}`}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                      active
                        ? "border-[var(--accent)] bg-[var(--surface-2)]"
                        : "border-transparent bg-transparent hover:border-[var(--border-color)] hover:bg-[var(--surface-2)]"
                    }`}
                    onClick={() => setSurahDrawerOpen(false)}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                          : "border-[var(--border-color)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                      }`}
                    >
                      {formatSurahNumber(item.id)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {item.transliteration}
                        </span>
                        <span className="rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
                          {item.type === "meccan" ? "Makkah" : "Madinah"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{item.translation}</p>
                    </div>
                    <span className="arabic-text text-right text-xl text-[var(--text-primary)]">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSettingsOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[var(--border-color)] bg-[var(--surface-1)] shadow-[var(--card-shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-dim)]">Settings</p>
                <h2 className="mt-2 text-xl font-semibold">Reading preferences</h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-primary)]"
                onClick={() => setSettingsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-7 px-6 py-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Arabic Font</p>
                <div className="grid gap-3">
                  {ARABIC_FONT_OPTIONS.map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => updateSettings({ arabicFont: font.value })}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        settings.arabicFont === font.value
                          ? "border-[var(--accent)] bg-[rgba(240,180,41,0.08)]"
                          : "border-[var(--border-color)] bg-[var(--surface-2)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{font.label}</p>
                          <p className="text-xs text-[var(--text-dim)]">{font.sample}</p>
                        </div>
                        <span className="text-lg text-[var(--text-dim)] arabic-text">{font.sample}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Arabic Font Size</p>
                  <span className="text-xs text-[var(--text-dim)]">{settings.arabicSize}px</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={48}
                  value={settings.arabicSize}
                  onChange={(e) => updateSettings({ arabicSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Translation Font Size</p>
                  <span className="text-xs text-[var(--text-dim)]">{settings.translationSize}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={22}
                  value={settings.translationSize}
                  onChange={(e) => updateSettings({ translationSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-dim)]">Preview</p>
                <p className="mt-3 arabic-text text-right text-[var(--text-primary)]">ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ</p>
                <p className="mt-3 translation-text text-[var(--text-muted)]">
                  [All] praise is [due] to Allah, Lord of the worlds -
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <audio ref={audioRef} preload="none" />
    </div>
  );
}

/**
 * SVG Icon components
 */

interface IconProps {
  className?: string;
}

function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4.5 5.5c0-1.1.9-2 2-2h11v16h-11c-1.1 0-2 .9-2 2v-16Z" />
      <path d="M17.5 3.5v16" />
    </svg>
  );
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5v9h13v-9" />
    </svg>
  );
}

function BookmarkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M6.5 4.5h11v15l-5.5-3-5.5 3v-15Z" />
    </svg>
  );
}

function NoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M7 4.5h7l4 4v11H7z" />
      <path d="M14 4.5v4h4" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="m11.5 3.5 1 2.3 2.5.3-1.9 1.8.5 2.6-2.1-1.2-2.1 1.2.5-2.6-1.9-1.8 2.5-.3 1-2.3Z" />
      <path d="M5 13.5h3" />
      <path d="M16 13.5h3" />
      <circle cx="12" cy="14.5" r="3.5" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5 19 12 8 18.5v-13Z" />
    </svg>
  );
}

function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7 5.5h4v13H7z" />
      <path d="M13 5.5h4v13h-4z" />
    </svg>
  );
}

function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M9 9h9v10H9z" />
      <path d="M6 5h9v4" />
    </svg>
  );
}

function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M15 7 9 12l6 5" />
      <path d="M5 7v10" />
    </svg>
  );
}

function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M18 14.5A7.5 7.5 0 0 1 9.5 6 7.5 7.5 0 1 0 18 14.5Z" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 19.5c1.8-3.3 13.2-3.3 15 0" />
    </svg>
  );
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-5 2 2 5 5-2-2-5Z" />
    </svg>
  );
}
