import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import fs from "node:fs";
import path from "node:path";

type Verse = {
  id: number;
  text: string;
  translation: string;
};

type Surah = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: Verse[];
};

type SearchResult = {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  ayahId: number;
  text: string;
  translation: string;
};

const dataPath = path.join(process.cwd(), "data", "quran_en.json");
const surahs = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as Surah[];

const searchAyahs = (query: string) => {
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

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.get("/search", (c) => {
  const query = (c.req.query("q") ?? "").trim();

  if (!query) {
    return c.json({ results: [] });
  }

  const results = searchAyahs(query).slice(0, 40);
  return c.json({ results });
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port });

console.log(`Hono API running on http://localhost:${port}`);
