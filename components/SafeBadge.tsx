"use client";
import React from "react";

export default function SafeBadge({ url }: { url?: string }) {
  const [state, setState] = React.useState<"loading"|"safe"|"unsafe"|"error">("loading");
  const [engine, setEngine] = React.useState("safebrowsing");

  React.useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!url) { setState("error"); return; }
      try {
        const res = await fetch("/api/url-safety", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
        const data = await res.json();
        if (!ignore) {
          setEngine(data.engine || "safebrowsing");
          setState(data.unsafe ? "unsafe" : "safe");
        }
      } catch {
        if (!ignore) setState("error");
      }
    };
    run();
    return () => { ignore = true; };
  }, [url]);

  const base: React.CSSProperties = {
    display:"inline-block", padding:"4px 10px", borderRadius:999,
    fontWeight:600, fontSize:"0.8rem"
  };

  if (state === "loading") return <span style={{...base, background:"#334155", color:"#e2e8f0"}}>Checking…</span>;
  if (state === "error")   return <span style={{...base, background:"#475569", color:"#fff"}}>SB error</span>;
  if (state === "unsafe")  return <span style={{...base, background:"#ef4444", color:"#fff"}}>⚠️ Unsafe ({engine})</span>;
  return                       <span style={{...base, background:"#22c55e", color:"#052e16"}}>✅ Safe ({engine})</span>;
}
