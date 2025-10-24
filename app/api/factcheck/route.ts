import { NextRequest } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q) return new Response(JSON.stringify({ error: "Missing q" }), { status: 400 });

  const key = process.env.FACTCHECK_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "Missing FACTCHECK_API_KEY" }), { status: 500 });

  const api = "https://factchecktools.googleapis.com/v1alpha1/claims:search";
  const params = new URLSearchParams({
    key,
    query: q,
    languageCode: "en",
    pageSize: "10"
  });

  const res = await fetch(`${api}?${params.toString()}`);
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } });
}
