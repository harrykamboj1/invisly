"use client";
import TradingViewWidgets from "@/components/TradingViewWidgets";
import { Button } from "@/components/ui/button";
import WatchListButton from "@/components/WatchListButton";
import { Circles } from "react-loader-spinner";
import {
  getStockNews,
  getStocksDetails,
} from "@/lib/actions/alphaAdvantage.actions";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  IndianRupee,
  Info,
  Loader2,
  Newspaper,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { runResearch } from "@/lib/langchain/stockmarketAgent";
import { StockAnalysisResponse } from "@/lib/types";
import { getUserWatchlist } from "@/lib/actions/watch.actions";
import { notFound } from "next/navigation";
import { IWatchlist } from "@/lib/models/WatchList";

type StockDetailsParams = {
  params: Promise<{
    symbol: string;
  }>;
};

type StockData = {
  symbol: string;
  company: string;
  currentPrice: any;
  changePercent: any;
  priceFormatted: string;
  changeFormatted: string;
  peRatio: any;
  marketCapFormatted: string;
} | null;

const StockDetails = ({ params }: StockDetailsParams) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stockNews, setStockNews] = useState([]);
  const [finalSymbol, setFinalSymbol] = useState("");
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState<StockData>(null);
  const [watchlist, setWatchlist] = useState<IWatchlist[]>([]);
  const [isWatchList, setIsWatchList] = useState<boolean>(false);
  const [recommendation, setRecommendation] =
    useState<StockAnalysisResponse | null>(null);

  const handleAIStockRecommendation = async () => {
    setError("");
    setRecommendation(null);
    setOpen(true);
    setLoading(true);

    try {
      const result = await runResearch(symbol);

      if (result != null) {
        const cleanJson = result
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        if (cleanJson?.startsWith("Error")) {
          setError(result);
          setLoading(false);
          return;
        }
        try {
          const parsedData = JSON.parse(cleanJson);
          const typedData = parsedData as StockAnalysisResponse;
          setRecommendation(typedData);
        } catch (e: any) {
          console.error("JSON Parse Error:", e);
          setError(
            "Failed to process AI response. The model returned invalid JSON."
          );
        }
        setLoading(false);
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "An unexpected error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { symbol } = await params;
      if (!symbol) {
        return;
      }
      setSymbol(symbol);

      const [news, stockDetails, userWatchlist] = await Promise.all([
        getStockNews(symbol),
        getStocksDetails(symbol.toUpperCase()),
        getUserWatchlist(),
      ]);

      setStockData(stockDetails);
      setWatchlist(userWatchlist);
      setStockNews(news);

      const extractSymbol = symbol
        .replace(/\.(BSE|BO|NS|NSE)$/i, "")
        .toUpperCase();
      setFinalSymbol("BSE:" + extractSymbol);
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    if (!symbol || !watchlist || watchlist.length === 0) {
      setIsWatchList(false);
      return;
    }

    const normalizedSymbol = symbol.toUpperCase();

    const isInWatchlist = watchlist.some(
      (item: IWatchlist) => item.symbol === normalizedSymbol
    );

    setIsWatchList(isInWatchlist);
  }, [watchlist, symbol]);

  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  if (!finalSymbol) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  if (!stockData) notFound();
  return (
    <div>
      <section className="grid stock-details-container">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TradingViewWidgets
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(finalSymbol)}
            height={170}
          />

          <TradingViewWidgets
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(finalSymbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidgets
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(finalSymbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {stockData && (
              <WatchListButton
                symbol={symbol.toUpperCase()}
                company={stockData.company}
                isInWatchlist={isWatchList}
                type="button"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => handleAIStockRecommendation()}
              className="bg-green-500 text-base hover:bg-green-500 text-gray-900 w-full rounded h-11 font-semibold cursor-pointer"
            >
              Ask AI (Stock Recommendation)
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="bg-zinc-950 border-zinc-800 w-[95vw] max-w-6xl h-[95vh] overflow-hidden text-zinc-100 p-0 flex flex-col">
                {/* HEADER SECTION - Fixed */}
                <div className="flex-shrink-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-8 py-6">
                  <DialogTitle className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl">
                        <Sparkles className="w-7 h-7 text-yellow-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          {recommendation
                            ? recommendation.company
                            : "AI Market Analysis"}
                        </h2>
                        {recommendation && (
                          <p className="text-sm text-zinc-400 font-mono mt-1.5">
                            {recommendation.symbol}
                          </p>
                        )}
                      </div>
                    </div>

                    {recommendation && (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">
                          ₹{recommendation.snapshot.current_price}
                        </div>
                        <div
                          className={`flex items-center justify-end gap-1.5 text-sm font-medium mt-1 ${
                            recommendation.technicals.trend_signal === "bullish"
                              ? "text-green-400"
                              : recommendation.technicals.trend_signal ===
                                "bearish"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {recommendation.technicals.trend_signal ===
                          "bullish" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : recommendation.technicals.trend_signal ===
                            "bearish" ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <Activity className="w-4 h-4" />
                          )}
                          {recommendation.technicals.trend_signal.toUpperCase()}
                        </div>
                      </div>
                    )}
                  </DialogTitle>
                </div>

                {/* SCROLLABLE CONTENT AREA */}
                <div className="flex-1 overflow-y-auto px-8 py-8">
                  <div className="space-y-10 max-w-full">
                    {/* LOADING STATE */}
                    {loading && (
                      <div className="flex flex-col items-center justify-center py-32 space-y-5">
                        <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
                        <div className="text-center space-y-2">
                          <p className="text-xl font-medium text-zinc-200">
                            Analyzing market data...
                          </p>
                          <p className="text-sm text-zinc-500">
                            Reading charts, news, and fundamentals
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ERROR STATE */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 flex items-start gap-5">
                        <AlertCircle className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-400 text-lg">
                            Analysis Failed
                          </h3>
                          <p className="text-sm text-red-300/80 mt-2">
                            {error}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DATA DISPLAY */}
                    {!loading && !error && recommendation && (
                      <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          <MetricCard
                            label="Market Cap"
                            value={formatCompactNumber(
                              recommendation.snapshot.market_cap
                            )}
                            icon={
                              <IndianRupee className="w-5 h-5 text-zinc-400" />
                            }
                          />
                          <MetricCard
                            label="P/E Ratio"
                            value={recommendation.snapshot.pe_ratio.toFixed(2)}
                            icon={
                              <Activity className="w-5 h-5 text-zinc-400" />
                            }
                          />
                          <MetricCard
                            label="52W High"
                            value={`₹${recommendation.snapshot["52_week_high"]}`}
                            highlight="text-green-400"
                          />
                          <MetricCard
                            label="Target Price"
                            value={
                              recommendation.recommendation.target_price.startsWith(
                                "$"
                              )
                                ? recommendation.recommendation.target_price.replace(
                                    "$",
                                    "₹"
                                  )
                                : `₹${recommendation.recommendation.target_price}`
                            }
                            highlight="text-yellow-400"
                          />
                        </div>

                        {/* Investment Thesis */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                            Investment Thesis
                          </h3>
                          <p className="text-zinc-300 leading-relaxed text-base">
                            {recommendation.investment_thesis}
                          </p>
                          <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-4">
                            <span className="text-sm text-zinc-500 font-medium">
                              Recommendation
                            </span>
                            <span
                              className={`px-5 py-2 rounded-full text-sm font-bold ${
                                recommendation.recommendation.verdict
                                  .toLowerCase()
                                  .includes("buy")
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : recommendation.recommendation.verdict
                                      .toLowerCase()
                                      .includes("sell")
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}
                            >
                              {recommendation.recommendation.verdict.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* Technical Indicators */}
                          <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                              Technical Indicators
                            </h3>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
                              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                                <span className="text-zinc-400 text-base">
                                  RSI (14)
                                </span>
                                <span className="font-mono font-medium text-lg">
                                  {recommendation.technicals.rsi}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                                <span className="text-zinc-400 text-base">
                                  SMA 50
                                </span>
                                <span className="font-mono font-medium text-lg">
                                  ₹{recommendation.technicals.sma_50}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-500 italic leading-relaxed pt-2">
                                {recommendation.technicals.analysis}
                              </p>
                            </div>
                          </div>

                          {/* Risk Assessment */}
                          <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                              Risk Assessment
                            </h3>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                              <ul className="space-y-4">
                                {recommendation.risks.financial_risks
                                  .slice(0, 3)
                                  .map((risk, i) => (
                                    <li
                                      key={i}
                                      className="flex gap-3 text-sm text-zinc-300 leading-relaxed"
                                    >
                                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                      <span>{risk}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Recent News */}
                        <div className="space-y-5">
                          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Newspaper className="w-5 h-5" /> Recent News
                            Context
                          </h3>
                          <div className="grid gap-4">
                            {recommendation.news.slice(0, 3).map((item, i) => (
                              <a
                                key={i}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={item.url !== "" ? item.url : "#"}
                                className="group block bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800 rounded-lg p-5 transition-all hover:border-zinc-700"
                              >
                                <h4 className="text-zinc-200 font-medium group-hover:text-yellow-400 transition-colors line-clamp-2">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                                  {item.summary}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 flex items-start gap-5">
                          <Info className="w-7 h-7 text-yellow-500 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-yellow-400 text-lg">
                              Disclaimer
                            </h3>
                            <p className="text-sm text-yellow-300/80 mt-2 leading-relaxed">
                              This is an AI-generated recommendation based on
                              available data. Please conduct your own research
                              and consult with a financial advisor before making
                              investment decisions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TradingViewWidgets
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(finalSymbol)}
            height={400}
          />

          <TradingViewWidgets
            scriptUrl={`${scriptUrl}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(finalSymbol)}
            height={440}
          />

          <TradingViewWidgets
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(finalSymbol)}
            height={464}
          />
        </div>
      </section>

      {stockNews.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {stockNews.map((newsItem: any, index: number) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              description={newsItem.description}
              url={newsItem.url}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default StockDetails;

function NewsCard({ title, description, url }: any) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 border border-gray-700 hover:border-gray-500">
      <h2 className="text-yellow-400 text-xl font-bold">{title}</h2>
      <p className="text-gray-300">{description}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline font-medium"
      >
        Read more →
      </a>
    </div>
  );
}

const MetricCard = ({ label, value, icon, highlight }: any) => (
  <div className="bg-zinc-900 border p-1 border-zinc-800 flex flex-col items-center justify-center  rounded-xl">
    <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium mb-1">
      {/* {icon} */}
      {label}
    </div>
    <div className={`text-md font-semibold ${highlight || "text-zinc-200"}`}>
      {value}
    </div>
  </div>
);

const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};
