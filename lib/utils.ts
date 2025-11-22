import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
import type { StockResearch } from "./types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



const NewsItemSchema = z.object({
  title: z.string(),
  summary: z.string(),
});

const SnapshotSchema = z.object({
  current_price: z.union([z.string(), z.number()]),
  market_cap: z.number(),
  pe_ratio: z.number(),
  "52_week_high": z.number(),
  "52_week_low": z.number(),
});

const FundamentalsSchema = z.object({
  revenue: z.number(),
  net_income: z.number(),
  return_on_assets: z.number(),
  total_debt: z.number(),
  totalCash: z.number(),
  gross_profit: z.number(),
  forwardPE: z.number(),
  priceToBook: z.number(),
  operationalCashFlow: z.number(),
  returnOnEquity: z.number(),
  analysis: z.string(),
});

const TechnicalsSchema = z.object({
  current_price: z.union([z.string(), z.number()]),
  sma_20: z.union([z.string(), z.number()]),
  sma_50: z.union([z.string(), z.number()]),
  rsi: z.union([z.string(), z.number()]),
  volume: z.number(),
  trend_signal: z.string(),
  analysis: z.string(),
});

const RisksSchema = z.object({
  financial_risks: z.array(z.string()),
  market_risks: z.array(z.string()),
  sector_risks: z.array(z.string()),
});

const RecommendationSchema = z.object({
  verdict: z.string(),
  target_price: z.string(),
});

export const StockResearchSchema = z.object({
  company: z.string(),
  symbol: z.string(),
  snapshot: SnapshotSchema,
  news: z.array(NewsItemSchema),
  fundamentals: FundamentalsSchema,
  technicals: TechnicalsSchema,
  risks: RisksSchema,
  peers: z.array(z.any()),
  investment_thesis: z.string(),
  recommendation: RecommendationSchema,
});

type StockResearchParsed = z.infer<typeof StockResearchSchema>;

/** Helper: convert numeric strings to numbers in known fields */
function parseNumber(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[₹,$\s,]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

export function parseAndNormalize(raw: unknown): StockResearch {
  const validated = StockResearchSchema.parse(raw) as StockResearchParsed;

  const snapshot = {
    ...validated.snapshot,
    current_price:
      parseNumber(validated.snapshot.current_price as any) ??
      validated.snapshot.current_price,
    "52_week_high": validated.snapshot["52_week_high"],
    "52_week_low": validated.snapshot["52_week_low"],
  };

  const technicals = {
    ...validated.technicals,
    current_price:
      parseNumber(validated.technicals.current_price as any) ??
      validated.technicals.current_price,
    sma_20:
      parseNumber(validated.technicals.sma_20 as any) ??
      validated.technicals.sma_20,
    sma_50:
      parseNumber(validated.technicals.sma_50 as any) ??
      validated.technicals.sma_50,
    rsi:
      parseNumber(validated.technicals.rsi as any) ??
      validated.technicals.rsi,
  };

  return {
    ...validated,
    snapshot: snapshot as any,
    technicals: technicals as any,
  } as StockResearch;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(price);
};

export const formatChangePercent = (changePercent?: number) => {
  if (!changePercent) return '';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

export function formatMarketCapValue(marketCapUsd: number): string {
  if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return 'N/A';

  if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`; 
  if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`; 
  if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`; 
  return `$${marketCapUsd.toFixed(2)}`; 
}


export function getChangeColorClass(percent: number): string {
  if (percent > 0) return "text-green-500";  
  if (percent < 0) return "text-red-500";    
  return "text-zinc-400";                    
}