import {tool} from '@langchain/core/tools';
import {symbol, z} from 'zod';
import YahooFinance from "yahoo-finance2";
import { TavilySearch } from "@langchain/tavily";

const yahooFinance = new YahooFinance();

const tavilyApiKey = process.env.TAVILY_API_KEY || "";
let webSearch: TavilySearch | null = null;

if (tavilyApiKey) {
    webSearch = new TavilySearch({
        tavilyApiKey: tavilyApiKey,
        maxResults: 5,
    })
}


export const getStockPrice =  tool(async ({symbol}: {symbol: string}) => {
        try{
            const quote = await yahooFinance.quote(symbol);
            const history = await yahooFinance.chart(symbol, {
                period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
                interval: "1d",
              });

              if (!history.quotes || history.quotes.length === 0) {
                return JSON.stringify({ error: `Could not retrieve data for ${symbol}` });
              }

              const currentPrice = history.quotes[history.quotes.length -1].close;

              const result = {
                symbol,
                current_price: currentPrice?.toFixed(2),
                company_name: quote.longName || symbol,
                market_cap: quote.marketCap || 0,
                pe_ratio: quote.trailingPE || "N/A",
                "52_week_high": quote.fiftyTwoWeekHigh || 0,
                "52_week_low": quote.fiftyTwoWeekLow || 0,
              }

              return JSON.stringify(result, null, 2);
            }catch(error){
                console.error(`Error fetching stock data for ${symbol}:`, error);
                return `Error fetching stock data for ${symbol}: ${error}`;
            }
    },
    {
        name: "get_stock_price",
        description: "Get the current stock price and other details for a given stock symbol.", 
        schema: z.object({ 
            symbol: z.string().describe("The stock symbol to look up, e.g., AAPL for Apple Inc."),
        }),
      }
);


export const getFinancialStatement = tool( async ({ symbol }: { symbol: string }) => {
    try{
        const financials = await yahooFinance.quoteSummary(symbol, {
            modules: ["financialData", "defaultKeyStatistics"],
          });

          const financial = financials.financialData;
          const defaultKeyStatistics = financials.defaultKeyStatistics;
          return JSON.stringify(
            {
              symbol,
              revenue: financial?.totalRevenue || "N/A",
              net_income: defaultKeyStatistics?.netIncomeToCommon || "N/A",
              return_on_assets: financial?.returnOnAssets || "N/A",
              total_debt: financial?.totalDebt || "N/A",
              totalCash: financial?.totalCash || "N/A",
              ebitda: financial?.ebitda || "N/A",
              gross_profit: financial?.grossProfits || "N/A",
              priceToEarnings: defaultKeyStatistics?.priceToEarnings || "N/A",
              forwardPE: defaultKeyStatistics?.forwardPE || "N/A",
              priceToBook: defaultKeyStatistics?.priceToBook || "N/A",
              operationalCashFlow: financial?.operatingCashflow || "N/A",
              freeCashflow: financial?.freeCashflow || "N/A",
              returnOnAssets: financial?.returnOnAssets || "N/A",
              returnOnEquity: financial?.returnOnEquity || "N/A",
            },
            null,
            2
          );

    }catch(error){
        console.error(`Error fetching financial statement for ${symbol}:`, error);
        return `Error fetching financial statement for ${symbol}: ${error}`;
    }
},{
    name: "getFinancialStatement",
    description: "Retrieve key financial statement data.",
    schema: z.object({
      symbol: z.string().describe("The stock symbol (e.g., RELIANCE, TATAMOTORS)"),
    }),
  })


  // Get Technical Indicators Tool
export const getTechnicalIndicators = tool(
    async ({ symbol, period = "3mo" }: { symbol: string; period?: string }) => {
        
        const periodMap: { [key: string]: number } = {
            "1mo": 30,
            "3mo": 90,
            "6mo": 180,
            "1y": 365,
          };

        const days = periodMap[period] || 90;
        const history = await yahooFinance.chart(symbol,{ 
            period1: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            interval: "1d",})  

            if (!history.quotes || history.quotes.length === 0) {
                return JSON.stringify({ error: `No historical data for ${symbol}` });
              }
              
              const quotes = history.quotes;
              const closes = quotes.map((q) => q.close || 0); 
              
              const calculateSMA = (data: number[], window: number) => {
                if (data.length < window) return 0;
                const slice = data.slice(-window);
                return slice.reduce((a, b) => a + b, 0) / window;
              };
              
              const calculateRSI = (data: number[], period: number = 14) => {
        if (data.length < period + 1) return 0;
        
        let gains = 0;
        let losses = 0;

        for (let i = data.length - period; i < data.length; i++) {
          const change = data[i] - data[i - 1];
          if (change > 0) gains += change;
          else losses -= change;
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        return 100 - 100 / (1 + rs);
      };

      const sma20 = calculateSMA(closes, 20);
      const sma50 = calculateSMA(closes, 50);
      const rsi = calculateRSI(closes);
      const latest = quotes[quotes.length - 1];

      return JSON.stringify(
        {
          symbol,
          current_price: latest.close?.toFixed(2),
          sma_20: sma20.toFixed(2),
          sma_50: sma50.toFixed(2),
          rsi: rsi.toFixed(2),
          volume: latest.volume || 0,
          trend_signal:
            latest.close && latest.close > sma20 && sma20 > sma50
              ? "bullish"
              : "bearish",
        },
        null,
        2
      );  
    },{
        name: "getTechnicalIndicators",
        description: "Get and calculate technical indicators for a given stock symbol over a specified period.",
        schema: z.object({
          symbol: z.string().describe("The stock symbol (e.g., RELIANCE, TATAMOTORS)"),
          period: z.string().optional().describe("Period for analysis (e.g., 1mo, 3mo, 6mo, 1y)"),
        }),
      }
)

export const searchMarketTrend = tool(
    async ({ topic }: { topic: string }) => {
      if (!webSearch) {
        return JSON.stringify({ error: "No search provider configured" });
      }
  
      try {
        const searchQuery = `${topic} market analysis trends 2024 2025 and future investment outlook forecast`;
        const results = await webSearch.invoke({ query: searchQuery });
  
        return JSON.stringify(
          {
            topic,
            search_query: searchQuery,
            trend_results: results,
          },
          null,
          2
        );
      } catch (error) {
        return JSON.stringify({ error: `Failed to search trends: ${error}` });
      }
    },
    {
      name: "searchMarketTrend",
      description: "Search for market trends and analysis on a specific topic using Tavily Search.",
      schema: z.object({
        topic: z.string().describe("The market topic to search for"),
      }),
    }
  );
  
  // Search Financial News Tool
  export const searchFinancialNews = tool(
    async ({ companyName, symbol }: { companyName: string, symbol: string }) => {
      if (!webSearch) {
        return JSON.stringify({ error: "No search provider configured" });
      }
  
      try {
        const query = `${companyName} ${symbol} financial news stock earnings latest`;
        const results = await webSearch.invoke({query: query});
        return JSON.stringify(
          {
            symbol,
            company: companyName,
            results,
          },
          null,
          2
        );
      } catch (error) {
        return JSON.stringify({ error: `${error}` });
      }
    },
    {
      name: "searchFinancialNews",
      description:
        "Search for recent financial news about a company using Tavily Search. Call this tool ONLY ONCE per query, unless specifically asked for additional news.",
      schema: z.object({
        companyName: z.string().describe("The company name"),
        symbol: z.string().describe("The stock symbol"),
        url: z.string().optional().describe("The news article URL if available"),
      }),
    }
  );


  export const searchFinancialNewsNotTool =  async ({ companyName, symbol }: { companyName: string, symbol: string }) => {
      if (!webSearch) {
        return JSON.stringify({ error: "No search provider configured" });
      }

     

      try {
        const query = `${companyName} ${symbol} financial news stock earnings latest`;
        const results = await webSearch.invoke({query: query});
        return JSON.stringify(
          {
            symbol,
            company: companyName,
            results,
          },
          null,
          2
        );
      } catch (error) {
        return JSON.stringify({ error: `${error}` });
      }
    }

  export {webSearch};