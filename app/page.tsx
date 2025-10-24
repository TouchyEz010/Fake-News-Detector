"use client";
import React from "react";
import SearchBar from "@/components/SearchBar";
import ResultList from "@/components/ResultList";
import SafeBadge from "@/components/SafeBadge";
import type { Article } from "@/components/ArticleCard";

export default function Page() {
  const [items, setItems] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [factChecks, setFactChecks] = React.useState<any[]>([]);

const onSearch = async (q: string, lang: string, sortBy: string) => {
  setError(null);
  setLoading(true);
  try {
    const looksLikeUrl = /^https?:\/\/\S+/i.test(q.trim());

    if (looksLikeUrl) {
      const res = await fetch(`/api/analyze-url?url=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (data.error) { setError(data.error); setItems([]); }
      else { setItems(data.article ? [data.article] : []); }

      // 🔎 เรียก fact-check จาก title ของข่าว
      if (data.article?.title) {
        const fcRes = await fetch(`/api/factcheck?q=${encodeURIComponent(data.article.title)}`);
        const fc = await fcRes.json();
        setFactChecks(fc.claims || []);
      } else {
        setFactChecks([]);
      }
    } else {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}&sortBy=${encodeURIComponent(sortBy)}`);
      const data = await res.json();
      if (data.error) { setError(data.error); setItems([]); setFactChecks([]); }
      else { setItems(data.articles || []); }

      // 🔎 fact-check ตามคำค้นหา
      const fcRes = await fetch(`/api/factcheck?q=${encodeURIComponent(q)}`);
      const fc = await fcRes.json();
      setFactChecks(fc.claims || []);
    }
  } catch (e:any) {
    setError(e?.message || "Unknown error");
  } finally {
    setLoading(false);
  }
};


  return (
    <main>
      <SearchBar onSearch={onSearch} loading={loading} />
      {error && <div className="card danger">Error: {error}</div>}
      <ResultList items={items} />
      <div className="footer-note">
        Disclaimer: This tool uses simple heuristics (source reputation, clickbait signals, wording) to estimate risk and is not a definitive fact-check.
        Always verify with reliable fact-checking organizations.
      </div>
    </main>
  );
}
