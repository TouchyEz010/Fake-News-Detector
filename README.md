# 🕵️ Fake News Detector

A web application built with Next.js, React, and TypeScript designed to detect and assess news credibility, verify factual claims, and inspect link safety in real time.

---

### 🌐 Live Demo
👉 **Try it here:** [fake-news-detector-lime-five.vercel.app](https://fake-news-detector-lime-five.vercel.app)

---

### ⚡ Key Features
- **News Credibility Analysis:** Evaluates news sources, headlines, and articles using heuristics for risk assessment (Low, Medium, High).
- **Google Fact Check Tools API Integration:** Cross-references claims against verified fact-checking organizations.
- **Google Safe Browsing API:** Inspects URLs for phishing, malware, and malicious web indicators.
- **Direct URL & NewsAPI Search:** Search by keywords or input a direct URL for instant automated scanning.

---

### 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / Modern CSS Modules
- **APIs:** NewsAPI, Google Fact Check Tools API, Google Safe Browsing API
- **Deployment:** Vercel

---

### 🚀 Getting Started (Local Development)

#### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

#### Installation & Setup

1. Clone the repository:
git clone https://github.com/TouchyEz010/Fake-News-Detector.git
cd Fake-News-Detector

2. Install dependencies:
npm install

3. Setup Environment Variables:
Create a file named .env.local in the root directory and configure your API keys:
NEWSAPI_KEY=your_newsapi_key_here
FACTCHECK_API_KEY=your_google_factcheck_key_here
SAFEBROWSING_API_KEY=your_google_safebrowsing_key_here

4. Run the development server:
npm run dev

Open http://localhost:3001 with your browser to see the application.

---

### ⚠️ Disclaimer
This tool uses heuristics (source reputation, wording patterns, clickbait indicators) and available fact-checking databases. It is intended for educational and analytical purposes and should not be considered an absolute authority on truth.
