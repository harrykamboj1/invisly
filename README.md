  # Invisly.ai — AI-Powered Stock Intelligence Platform

Invisly.ai is an advanced, AI-driven stock analysis platform that empowers retail investors with **real-time insights, chart-driven analytics, AI agent recommendations, stock alerts, and curated financial news** — all in a clean, fast Next.js interface.

Built with **Next.js, TailwindCSS, Shadcn UI, LangChain Agents, MongoDB, Better Auth, and Inngest**, Invisly.ai brings institutional-grade intelligence to everyday investors.

---

##  Features

###  1. Advanced Stock Charts
- Interactive charts with price, volume, and intraday performance  
- Multi-timeframe charting  
- Clean UI powered by Shadcn + Tailwind  

###  2. AI-Driven Stock Analysis
- LangChain Agents analyze fundamentals, sector trends, news sentiment & macro indicators  
- Clear buy/sell/hold recommendations  
- Multi-model reasoning (Gemini, Tavily, Alpha Vantage)

###  3. Price Alerts
- Real-time price alerts  
- Background tasks via **Inngest**  
- Email notifications with Nodemailer  

###  4. Personalized Watchlist News
- Latest market news powered by MarketAux  
- AI-generated summaries  
- Relevance-ranked by sentiment and trend  

###  5. Watchlist Management
- Add/remove stocks  
- Track performance and sentiment  
- AI annotations on major price movements  

###  6. Secure Authentication
- Powered by **Better Auth**  
- Production-ready, session-secure login system  

###  7. Production Deployment
- Fully deployed on **Vercel**  

###  8. Open for Contributions
Developers are encouraged to extend, optimize, and enhance the platform.

---

## Tech Stack

### **Frontend**
- Next.js (App Router)
- React
- Shadcn UI
- TailwindCSS

### **Backend**
- Next.js API Routes / Server Actions  
- LangChain Agents  
- MongoDB  
- Better Auth  
- Inngest (scheduled jobs)

### **External APIs / AI**
- Gemini API  
- Tavily Search API  
- Alpha Vantage (price feed)  
- MarketAux (news)  
- Google API  

### **Deployment**
- **Vercel**

---

##  Environment Variables

Create an `.env.local` file in the project root:

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=

GEMINI_API_KEY=
PROD_URL=

ALPHA_ADVANTAGE_API_KEY=
MARKETAUX_KEY=
TAVILY_API_KEY=
GOOGLE_API_KEY=
```
## Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/<your-repo>/invisly.ai.git
cd invisly.ai
npm install
npm run dev
http://localhost:3000
```
