import ArticleCard, { Article } from "./ArticleCard";

export default function ResultList({ items }: { items: Article[] }) {
  if (!items?.length) return <div className="card">No results.</div>;
  return (
    <div className="grid">
      {items.map((a, idx) => <ArticleCard key={idx} article={a} />)}
    </div>
  );
}
