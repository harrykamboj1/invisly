'use server';
import { cache } from "react";
import { POPULAR_INDIAN_STOCK_SYMBOLS } from "../constants";
import YahooFinance from "yahoo-finance2";
import { StockNewsType } from "../types";
import { auth } from "../better-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "./watch.actions";
import { formatChangePercent, formatMarketCapValue, formatPrice } from "../utils";


type StockMatch = { [k: string]: string };
type StockWithWatchlistStatus = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
};

const DEFAULT_REGION = 'India';
const DEFAULT_TYPE = 'Stock';
const ALPHA_TIMEOUT_MS = 7000;

const ALPHA_ADVANTAGE_BASE_URL = 'https://www.alphavantage.co';
const MARKET_AUX_BASE_URL = 'https://api.marketaux.com/v1';
const yahooFinance = new YahooFinance();


async function fetchJson<T>(url: string, revalidateSeconds?: number, timeoutMs = ALPHA_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds }, signal: controller.signal }
    : { cache: 'no-store', signal: controller.signal };

  try {
    const res = await fetch(url, options);
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Fetch failed ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function mapInBatches<T, R>(items: T[], batchSize: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const res = await Promise.all(batch.map(fn));
    out.push(...res);
  }
  return out;
}

export const getStockNews = cache(async (symbol: string): Promise<StockNewsType[]> => {
  try{
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const queryParam = typeof symbol === 'string' ? symbol.trim() : '';
    if (!queryParam) {
      return [];
    }
    const url = `${MARKET_AUX_BASE_URL}/news/all?symbols=${queryParam}&filter_entities=true&language=en&api_token=${process.env.MARKETAUX_KEY}&limit=3&filter_entities=true&must_have_entities=true`;
    const data:any = await fetchJson(url, 10000);
    if (!data || !data.data || !Array.isArray(data.data)) {
      return [];
    }
    const news: StockNewsType[] = data?.data.map((item: any) => ({
      title: item.title || 'N/A',
      url: item.url || '',
      source: item.source || 'N/A',
      publishedAt: item.published_at || '',
      description: item.description || 'N/A'
    }));

    return news;

  }catch(err){
    console.error('Fetching stock news failed', err);
    return [];
  }
});

export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const userWatchlistSymbols = await getWatchlistSymbolsByEmail(
      session.user.email
    );

    const watchlistSet = new Set(
      userWatchlistSymbols.list.map((sym: string) => sym.symbol)
    );
    const queryParam = typeof query === 'string' ? query.trim() : '';
    let rawResults: StockWithWatchlistStatus[] = [];

    if (!queryParam) {
      const top = POPULAR_INDIAN_STOCK_SYMBOLS.slice(0, 10);

      const profiles = await mapInBatches(
        top,
        3,
        async (symbol) => {
          try {
            const profile = await yahooFinance.search(symbol);
            return { symbol, profile } as { symbol: string; profile: any };
          } catch (err) {
            console.error('Error searching symbol', symbol, err);
            return { symbol, profile: null } as { symbol: string; profile: any };
          }
        }
      );

      for (const p of profiles) {
        const data = p.profile;
        if (data && Array.isArray(data.quotes)) {
          for (const quote of data.quotes) {
            rawResults.push({
              symbol: quote.symbol ?? p.symbol ?? 'N/A',
              name: quote.longname ?? quote.shortname ?? 'N/A',
              exchange: quote.exchDisp ?? quote.exchange ?? '',
              type: quote.quoteType ?? DEFAULT_TYPE,
              isInWatchlist: watchlistSet.has(quote.symbol)
            });
          }
        } else {
          rawResults.push({
            symbol: p.symbol,
            name: 'N/A',
            exchange: '',
            type: DEFAULT_TYPE,
            isInWatchlist: watchlistSet.has(p.symbol)
          });
        }
      }
    } else {
      const data = await yahooFinance.search(queryParam);
      
      if (data === null || !data.quotes || !Array.isArray(data.quotes)) {
        rawResults = [];
      } else {
        rawResults = data.quotes.map((quote: any) => {
          return {
            symbol: quote.symbol ?? 'N/A',
            name: quote.longname ?? quote.shortname ?? 'N/A',
            exchange: quote.exchDisp ?? quote.exchange ?? '',
            type: quote.quoteType ?? DEFAULT_TYPE,
            isInWatchlist: watchlistSet.has(quote.symbol)
          };
        });
      }
    }

    const seen = new Set<string>();
    const normalized: StockWithWatchlistStatus[] = [];

    for (const r of rawResults) {
      const sym = (r.symbol ?? 'N/A').toUpperCase();
      if (sym === 'N/A' || seen.has(sym)) continue;
      seen.add(sym);

      normalized.push({
        symbol: sym,
        name: r.name && r.name !== '' ? r.name : sym,
        exchange: (r.exchange && r.exchange !== '') ? r.exchange : DEFAULT_REGION,
        type: r.type ?? DEFAULT_TYPE,
        isInWatchlist: watchlistSet.has(sym)
      });

      if (normalized.length >= 10) break;
    }

    return normalized;
  } catch (err) {
    console.error('Stock search failed', err);
    return [];
  }
});


export const getStocksDetails = cache(async(symbol:string)=>{
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect('/sign-in');

  const cleanSymbol = symbol.trim().toUpperCase();

  try{
    const quote = await yahooFinance.quote(symbol);

    return {
      symbol:cleanSymbol,
      company:quote.longName,
      currentPrice:quote.regularMarketPrice,
      changePercent: quote.regularMarketChangePercent,
      priceFormatted:formatPrice(quote.regularMarketPrice),
      changeFormatted: formatChangePercent(quote.regularMarketChangePercent),
      peRatio: quote.trailingPE?.toFixed(1) || '—',
      marketCapFormatted: formatMarketCapValue(quote.marketCap)
    }
  }catch(err){
    console.error('Error in getStockDetails :: ' + err)
    return null;
  }
})