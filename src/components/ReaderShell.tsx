"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Surah, SurahMeta } from "@/lib/quran";

type ReaderShellProps = {
  surah: Surah;
  surahList: SurahMeta[];
};

type Settings = {
  arabicFont: "amiri" | "scheherazade";
  arabicSize: number;
  translationSize: number;
};

type SearchResult = {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  ayahId: number;
  text: string;
  translation: string;
};

const defaultSettings: Settings = {
  arabicFont: "amiri",
  arabicSize: 34,
  translationSize: 16,
};

const arabicFontOptions = {
  amiri: {
    label: "Amiri",
    cssValue: "var(--font-amiri)",
  },
  scheherazade: {
    label: "Scheherazade New",
    cssValue: "var(--font-scheherazade)",
  },
};

const settingsStorageKey = "quran.settings";

const formatSurahNumber = (id: number) => id.toString().padStart(2, "0");

const revelationLabel = (type: Surah["type"]) =>
  type === "meccan" ? "Makkah" : "Madinah";

export default function ReaderShell({ surah, surahList }: ReaderShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surahDrawerOpen, setSurahDrawerOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeAyahKey, setActiveAyahKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const surahOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    for (const meta of surahList) {
      offsets.push(total);
      total += meta.total_verses;
    }
    return offsets;
  }, [surahList]);

  const getGlobalAyahId = (surahId: number, ayahId: number) => {
    const offset = surahOffsets[surahId - 1] ?? 0;
    return offset + ayahId;
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(settingsStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Settings;
        setSettings(parsed);
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const fontValue = arabicFontOptions[settings.arabicFont].cssValue;
    root.style.setProperty("--arabic-font", fontValue);
    root.style.setProperty("--arabic-size", `${settings.arabicSize}px`);
    root.style.setProperty("--translation-size", `${settings.translationSize}px`);

    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const handle = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  const playAyah = (surahId: number, ayahId: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const key = `${surahId}:${ayahId}`;
    const globalAyahId = getGlobalAyahId(surahId, ayahId);
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahId}.mp3`;

    if (activeAyahKey === key) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      audio.play().then(() => setIsPlaying(true)).catch(() => undefined);
      return;
    }

    audio.src = url;
    audio
      .play()
      .then(() => {
        setActiveAyahKey(key);
        setIsPlaying(true);
      })
      .catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-16 flex-col items-center gap-5 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] px-2 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)]">
            <BookIcon className="h-5 w-5" />
          </div>
          <IconButton label="Home">
            <HomeIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Bookmarks">
            <BookmarkIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Notes">
            <NoteIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon className="h-5 w-5" />
          </IconButton>
        </aside>

        <aside className="hidden lg:flex w-72 flex-col border-r border-[var(--border-color)] bg-[var(--surface-1)]">
          <div className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Surahs</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">All Chapters</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            {surahList.map((item) => {
              const active = item.id === surah.id;
              return (
                <Link
                  key={item.id}
                  href={`/surah/${item.id}`}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                    active
                      ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] text-xs font-semibold">
                    {formatSurahNumber(item.id)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.transliteration}</span>
                    <span className="text-xs text-[var(--text-dim)]">{item.translation}</span>
                  </div>
                  <span className="ml-auto text-lg font-medium arabic-text">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border-color)] bg-[var(--surface-1)] px-4 py-4 md:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] lg:hidden"
                  onClick={() => setSurahDrawerOpen(true)}
                  aria-label="Open surah list"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold">Quran Mazid</p>
                  <p className="text-xs text-[var(--text-muted)]">Read, Study, and Learn</p>
                </div>
              </div>

              <div className="relative flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-4 py-2">
                  <SearchIcon className="h-4 w-4 text-[var(--text-dim)]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by Arabic or translation"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none"
                  />
                </div>
                {(query.trim().length > 0 || results.length > 0) && (
                  <div className="absolute left-0 right-0 z-20 mt-3 max-h-[320px] overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface-3)] p-3 shadow-xl">
                    {isSearching ? (
                      <p className="px-3 py-4 text-sm text-[var(--text-muted)]">Searching...</p>
                    ) : results.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-[var(--text-muted)]">No results found.</p>
                    ) : (
                      results.slice(0, 20).map((result) => (
                        <Link
                          key={`${result.surahId}:${result.ayahId}`}
                          href={`/surah/${result.surahId}`}
                          className="flex flex-col gap-1 rounded-xl px-3 py-3 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
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

          <section className="flex flex-col gap-6 px-4 py-6 md:px-8">
            <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-[var(--border-color)] bg-[var(--surface-2)] px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-3)] text-[var(--accent)]">
                <CompassIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-dim)]">
                  Surah {formatSurahNumber(surah.id)}
                </p>
                <h1 className="mt-2 text-2xl font-semibold">{surah.transliteration}</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  {surah.translation} | {surah.total_verses} Ayahs | {revelationLabel(surah.type)}
                </p>
              </div>
              <div className="rounded-full border border-[var(--border-color)] bg-[var(--surface-3)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
                {revelationLabel(surah.type)}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {surah.verses.map((verse) => {
                const key = `${surah.id}:${verse.id}`;
                const isActive = activeAyahKey === key && isPlaying;

                return (
                  <div
                    key={key}
                    className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface-1)] px-5 py-5 shadow-[var(--card-shadow)]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-semibold text-[var(--text-dim)]">
                        {formatSurahNumber(surah.id)}:{verse.id}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <IconButton label={isActive ? "Pause" : "Play"} onClick={() => playAyah(surah.id, verse.id)}>
                          {isActive ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
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
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">Saheeh International</p>
                        <p className="translation-text text-[var(--text-muted)]">{verse.translation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {surahDrawerOpen && (
        <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setSurahDrawerOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-80 bg-[var(--surface-1)] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-dim)]">Surahs</p>
              <button
                className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs"
                onClick={() => setSurahDrawerOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-[calc(100%-60px)] overflow-y-auto">
              {surahList.map((item) => (
                <Link
                  key={item.id}
                  href={`/surah/${item.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                  onClick={() => setSurahDrawerOpen(false)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] text-xs font-semibold">
                    {formatSurahNumber(item.id)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{item.transliteration}</span>
                    <span className="text-xs text-[var(--text-dim)]">{item.translation}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSettingsOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--surface-1)] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-dim)]">Settings</p>
                <h2 className="mt-2 text-xl font-semibold">Reading preferences</h2>
              </div>
              <button
                className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs"
                onClick={() => setSettingsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold">Arabic Font</p>
                <div className="grid gap-2">
                  {(Object.keys(arabicFontOptions) as Array<Settings["arabicFont"]>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSettings((prev) => ({ ...prev, arabicFont: key }))}
                      className={`rounded-xl border px-4 py-2 text-left text-sm transition ${
                        settings.arabicFont === key
                          ? "border-[var(--accent)] bg-[var(--surface-2)]"
                          : "border-[var(--border-color)] bg-transparent hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      {arabicFontOptions[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Arabic Font Size</p>
                <input
                  type="range"
                  min={24}
                  max={48}
                  value={settings.arabicSize}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, arabicSize: Number(event.target.value) }))
                  }
                  className="w-full"
                />
                <p className="text-xs text-[var(--text-dim)]">{settings.arabicSize}px</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Translation Font Size</p>
                <input
                  type="range"
                  min={12}
                  max={22}
                  value={settings.translationSize}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, translationSize: Number(event.target.value) }))
                  }
                  className="w-full"
                />
                <p className="text-xs text-[var(--text-dim)]">{settings.translationSize}px</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} preload="none" />
    </div>
  );
}

type IconProps = { className?: string };

type IconButtonProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function IconButton({ label, children, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:bg-[var(--surface-3)]"
      aria-label={label}
    >
      {children}
    </button>
  );
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
