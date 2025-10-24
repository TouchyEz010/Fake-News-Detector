import { evaluateHeuristics } from "@/lib/credibility";
import StatusRow from "./StatusRow";

export type Article = {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  source?: { id?: string | null; name?: string };
  author?: string | null;
  publishedAt?: string | null;
};

export default function ArticleCard({ article }: { article: Article }) {
  const report = evaluateHeuristics(article.title, article.url, article.description);
  const bandClass =
    report.band === "low" ? "score low" :
    report.band === "high" ? "score high" : "score med";

  return (
    <div className="card article">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <span className={bandClass}>
          Risk: {report.band.toUpperCase()} ({Math.round(report.score)})
        </span>
        <span className="badge">{article.source?.name || "Unknown source"}</span>
      </div>

      <h3>
        <a href={article.url} target="_blank" rel="noreferrer">
          {article.title}
        </a>
      </h3>

      {/* ✅ เพิ่มแถวสถานะ FactCheck + SafeBrowsing */}
      <StatusRow url={article.url} title={article.title} description={article.description} />

      {article.publishedAt && (
        <div className="meta">{new Date(article.publishedAt).toLocaleString()}</div>
      )}

      {article.urlToImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.urlToImage}
          alt={article.title || ""}
          style={{ borderRadius: 12, border: "1px solid #333" }}
        />
      )}

      {article.description && (
        <p style={{ margin: 0, color: "#cbd5e1" }}>{article.description}</p>
      )}

      {report.signals.length > 0 && (
        <div className="meta">⚠️ Signals: {report.signals.join(" · ")}</div>
      )}
    </div>
  );
}
