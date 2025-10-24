import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake News Detector",
  description: "MVP: Search via NewsAPI or paste a URL to analyze heuristics."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <div>
              <div className="title">🕵️‍♂️ Fake News Detector</div>
              <div className="subtitle">NewsAPI + Direct URL + Google Fact Check Tools API + Google Safe Browsing API</div>
            </div>

          </header>
          {children}
        </div>
      </body>
    </html>
  );
}