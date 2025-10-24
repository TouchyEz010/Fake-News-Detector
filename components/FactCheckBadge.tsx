"use client";
import React from "react";

export default function FactCheckBadge({ query }: { query?: string }) {
  const [state, setState] = React.useState<"idle"|"loading"|"none"|"ok"|"error">("idle");
  const [pub, setPub] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!query) { setState("none"); return; }
      setState("loading");
      try {
        const res = await fetch(`/api/factcheck?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (ignore) return;
        const claim = data?.claims?.[0];
        if (!claim) { setState("none"); return; }
        const review = claim.claimReview?.[0];
        setPub(review?.publisher?.name || "Fact-check");
        setRating(review?.textualRating || "See");
        setLink(review?.url || "");
        setState("ok");
      } catch {
        if (!ignore) setState("error");
      }
    };
    run();
    return () => { ignore = true; };
  }, [query]);

  const pill: React.CSSProperties = {
    display:"inline-block", padding:"4px 10px", borderRadius:999,
    fontWeight:600, fontSize:"0.8rem"
  };

  if (state === "loading") return <span style={{...pill, background:"#334155", color:"#e2e8f0"}}>Fact-check…</span>;
  if (state === "error")   return <span style={{...pill, background:"#ef4444", color:"#fff"}}>FC error</span>;
  if (state === "none")    return <span style={{...pill, background:"#475569", color:"#fff"}}>No fact-check</span>;

  return (
    <a href={link} target="_blank" rel="noreferrer"
       style={{...pill, background:"#0ea5e9", color:"#081226", textDecoration:"none"}}
       title={pub}>
      🔍 {pub}: <b style={{marginLeft:4}}>{rating}</b>
    </a>
  );
}
