import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "en";
  const sortBy = searchParams.get("sortBy") || "relevancy";

  if (!process.env.NEWSAPI_KEY) {
    return new Response(JSON.stringify({ error: "Missing NEWSAPI_KEY" }), { status: 500 });
  }
  if (!q || q.trim().length < 2) {
    return new Response(JSON.stringify({ articles: [] }), { status: 200 });
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q);
  url.searchParams.set("language", lang);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("pageSize", "20");

  const res = await fetch(url.toString(), { headers: { "X-Api-Key": process.env.NEWSAPI_KEY! } });
  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: "NewsAPI error", detail: text }), { status: 500 });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } });
}
