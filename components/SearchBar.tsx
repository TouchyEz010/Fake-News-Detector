"use client";
import React from "react";

type Props = {
  onSearch: (q: string, lang: string, sortBy: string) => void;
  loading: boolean;
};

export default function SearchBar({ onSearch, loading }: Props) {
  const [q, setQ] = React.useState("");
  const [lang, setLang] = React.useState("en");
  const [sortBy, setSortBy] = React.useState("relevancy");

  return (
    <div className="card">
      <div className="searchRow">
        <input
          type="text"
          placeholder="Search topic or paste a full URL (https://...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(q, lang, sortBy); }}
        />
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="th">Thai</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevancy">Relevancy</option>
          <option value="popularity">Popularity</option>
          <option value="publishedAt">Latest</option>
        </select>
        <button className="primary" disabled={loading} onClick={() => onSearch(q, lang, sortBy)}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
