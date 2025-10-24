import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

function isValidHttpUrl(s?: string | null): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || "";

  if (!isValidHttpUrl(target)) {
    return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
  }

  try {
    const res = await fetch(target, { redirect: "follow" });
    const html = await res.text();
    const $ = cheerio.load(html);

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDesc = $('meta[property="og:description"]').attr("content");
    const metaDesc = $('meta[name="description"]').attr("content");
    const title = ogTitle || $("title").first().text() || undefined;
    const description = ogDesc || metaDesc || undefined;
    const u = new URL(target);
    const sourceName = u.hostname.replace(/^www\./, "");

    const article = {
      title,
      description,
      url: target,
      urlToImage: $('meta[property="og:image"]').attr("content") || undefined,
      source: { id: null, name: sourceName },
      author: null,
      publishedAt: null
    };

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Fetch failed", detail: String(e?.message || e) }), { status: 500 });
  }
}
