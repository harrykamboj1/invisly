
export type StockNewsType = {
    title: string;
    url: string;
    source: string;
    publishedAt: string;
    description: string;
  }
  
export interface StockSnapshot {
  current_price: string;       
  market_cap: number;
  pe_ratio: number;
  "52_week_high": number;      
  "52_week_low": number;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
}

export interface Fundamentals {
  revenue: number;
  net_income: number;
  return_on_assets: number;
  total_debt: number;
  totalCash: number;
  gross_profit: number;
  forwardPE: number;
  priceToBook: number;
  operationalCashFlow: number;
  returnOnEquity: number;
  analysis: string;
}

export interface Technicals {
  current_price: string;
  sma_20: string;
  sma_50: string;
  rsi: string;
  volume: number;
  trend_signal: 'bearish' | 'bullish' | 'neutral' | string; 
  analysis: string;
}

export interface Risks {
  financial_risks: string[];
  market_risks: string[];
  sector_risks: string[];
}

export interface Recommendation {
  verdict: 'Buy' | 'Hold' | 'Sell' | string;
  target_price: string;
}


export interface StockAnalysisResponse {
  company: string;
  symbol: string;
  snapshot: StockSnapshot;
  news: NewsItem[];
  fundamentals: Fundamentals;
  technicals: Technicals;
  risks: Risks;
  peers: string[];
  investment_thesis: string;
  recommendation: Recommendation;
}