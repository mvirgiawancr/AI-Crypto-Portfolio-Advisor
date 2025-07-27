# AI Crypto Portfolio Advisor 🪄📊

One-page dApp built with **Next.js 14**, **Tailwind**, **Wagmi**, **RainbowKit**, **Recharts**, **Covalent** & **Google Gemini**.  
Connect any **EVM wallet**, see your **token allocation** in a pie chart, and get **AI-driven risk analysis** displayed as a radar chart.

---

## ✨ Features
| Feature | Status |
|---|---|
| 🔌 Wallet connect (MetaMask, WalletConnect, Coinbase) | ✅ |
| 🥧 Real-time **Pie Chart** of token allocation | ✅ |
| 🎯 **Radar Chart** risk score (Volatility, Centralization, Maturity, etc.) | ✅ |
| 🔄 Auto-refresh when switching **chains** or **addresses** | ✅ |
| 🪙 Supports **BNB Chain**, Ethereum, Polygon, Arbitrum, Optimism | ✅ |
| 🆓 Uses **Google Gemini free tier** (no OpenAI quota issues) | ✅ |

---

## 🛠️ Tech Stack
- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS  
- **Web3**: wagmi v2, viem, RainbowKit  
- **Charts**: Recharts  
- **Data**: Covalent API (balances) + Google Gemini (risk analysis)  
- **Deployment**: Vercel Edge Functions (API routes)  

---

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone https://github.com/mvirgiawancr/AI-Crypto-Portfolio-Advisor.git
cd ai-crypto-portfolio-advisor
npm install
```
### 2. Environment variables
Create .env file or just copy `.env.example` to `.env` and fill in your API key:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
COVALENT_API_KEY=your_covalent_key
GOOGLE_API_KEY=your_gemini_key
```
Get your API keys from:
- [Covalent API](https://www.covalenthq.com/)
- [Google Gemini](https://developers.google.com/gemini)
- [WalletConnect](https://cloud.walletconnect.com/)

### 3. Run Locally
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000)

### 🔧 API Endpoints
| Method | Path                 | Description                         |
| ------ | -------------------- | ----------------------------------- |
| `GET`  | `/api/portfolio`     | Token balances per chain (Covalent) |
| `POST` | `/api/risk-analysis` | AI risk scores (Google Gemini)      |

### 📦 Scripts
```bash
npm run dev      # start dev server
npm run build    # build for production
npm run start    # start production server
npm run lint     # ESLint
```

### 🤝 Contribute
PRs welcome! Please open an issue first for major changes.

### 📄 License
MIT © 2025 mvirgiawancr

Tip: Star ⭐ the repo if it helps you!
