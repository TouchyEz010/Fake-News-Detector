"use client";
import SafeBadge from "@/components/SafeBadge";
import FactCheckBadge from "@/components/FactCheckBadge";

export default function StatusRow({
  url, title, description,
}: { url?: string; title?: string; description?: string }) {
  const query = title?.trim() || description?.trim() || url?.trim(); // fallback ให้แน่ใจว่า factcheck ยิงได้

  return (
    <div style={{display:"flex", gap:8, alignItems:"center", margin:"8px 0 2px"}}>
      <SafeBadge url={url} />
      <FactCheckBadge query={query} />
    </div>
  );
}
