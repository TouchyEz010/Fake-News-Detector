import { NextRequest } from "next/server";
export const runtime = "edge";

const THREAT_TYPES = ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE","POTENTIALLY_HARMFUL_APPLICATION"];

async function checkWithSafeBrowsing(url: string) {
  const key = process.env.SAFEBROWSING_API_KEY!;
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`;
  const body = {
    client: { clientId: "fake-news-mvp", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: THREAT_TYPES,
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { unsafe: Array.isArray((data as any).matches) && (data as any).matches.length > 0, raw: data, engine: "safebrowsing" };
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return new Response(JSON.stringify({ error: "Missing url" }), { status: 400 });
  if (!process.env.SAFEBROWSING_API_KEY)
    return new Response(JSON.stringify({ error: "Missing SAFEBROWSING_API_KEY" }), { status: 500 });
  const r = await checkWithSafeBrowsing(url);
  return new Response(JSON.stringify(r), { status: 200, headers: { "content-type": "application/json" } });
}
