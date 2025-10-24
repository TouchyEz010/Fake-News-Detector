export type HeuristicReport = {
  score: number; // 0 trustworthy .. 100 high risk
  signals: string[];
  band: "low" | "medium" | "high";
};

const TRUSTED = new Set([
  "bbc.co.uk","bbc.com","reuters.com","apnews.com","nytimes.com","theguardian.com","washingtonpost.com",
  "bloomberg.com","wsj.com","aljazeera.com","npr.org","abcnews.go.com","cbsnews.com","nbcnews.com",
  "forbes.com","ft.com","time.com","usatoday.com","voanews.com"
]);

const LOW_TRUST = new Set([
  "beforeitsnews.com","infowars.com","yournewswire.com","naturalnews.com","worldtruth.tv","thepeoplesvoice.tv",
  "nationalreport.net","theonion.com"
]);

const CLICKBAIT_PATTERNS = [
  /you won\'t believe/i, /shocking/i, /what happens next/i, /exposed/i, /secret revealed/i, /this is why/i, /the truth about/i
];

function domainFromUrl(url?: string): string | null {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

function clickbaitScore(title?: string): {points: number, reasons: string[]} {
  if (!title) return {points: 0, reasons: []};
  const reasons: string[] = [];
  let points = 0;
  for (const p of CLICKBAIT_PATTERNS) if (p.test(title)) { points += 10; reasons.push(`Clickbait phrase matched: /${p.source}/`); }
  const exclam = (title.match(/!/g) || []).length;
  if (exclam >= 2) { points += 8; reasons.push("Multiple exclamation marks"); }
  const words = title.split(/\s+/);
  const allCaps = words.filter(w => /[A-Z]{3,}/.test(w)).length;
  if (allCaps / Math.max(1, words.length) > 0.15) { points += 6; reasons.push("Unusual ALL-CAPS ratio in title"); }
  return {points, reasons};
}

function sourceScore(url?: string): {points: number, reasons: string[]} {
  const d = domainFromUrl(url);
  if (!d) return {points: 10, reasons: ["Unknown source domain"]};
  if (TRUSTED.has(d)) return {points: -12, reasons: ["Recognized reputable source"]};
  if (LOW_TRUST.has(d)) return {points: 25, reasons: ["Historically low-credibility domain"]};
  return {points: 0, reasons: []};
}

function contentHintsScore(desc?: string): {points: number, reasons: string[]} {
  if (!desc) return {points: 0, reasons: []};
  let points = 0; const reasons: string[] = [];
  const sensational = /(miracle cure|guaranteed|100%|censored|banned|wake up|plandemic|bioweapon)/i;
  if (sensational.test(desc)) { points += 10; reasons.push("Sensational/absolute language found"); }
  return {points, reasons};
}

export function evaluateHeuristics(title?: string, url?: string, description?: string): HeuristicReport {
  const s1 = clickbaitScore(title);
  const s2 = sourceScore(url);
  const s3 = contentHintsScore(description);
  let score = Math.min(100, Math.max(0, 50 + s1.points + s2.points + s3.points));
  let band: HeuristicReport["band"] = "medium";
  if (score <= 40) band = "low"; else if (score >= 70) band = "high";
  const signals = [...s1.reasons, ...s2.reasons, ...s3.reasons];
  return { score, signals, band };
}
