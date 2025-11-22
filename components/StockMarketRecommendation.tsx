"use client";
import { formatCurrency, formatNumber, getVerdictColor } from "@/lib/constants";
import { StockRecommendationData } from "@/lib/types";
import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Loader2,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const StockMarketRecommendation = ({
  recommendation,
}: {
  recommendation: StockRecommendationData;
}) => {
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    fundamentals: true,
    technicals: true,
    risks: true,
    thesis: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mb-4" />
        <p className="text-gray-400">Analyzing market data...</p>
        <p className="text-gray-500 text-sm mt-2">
          This may take a few seconds
        </p>
      </div>
    );
  }

  const hasSnapshot =
    recommendation?.snapshot &&
    Object.values(recommendation.snapshot).some(
      (v) => v !== null && v !== undefined
    );
  const hasFundamentals =
    recommendation?.fundamentals &&
    Object.values(recommendation.fundamentals).some(
      (v) => v !== null && v !== undefined
    );
  const hasTechnicals =
    recommendation?.technicals &&
    Object.values(recommendation.technicals).some(
      (v) => v !== null && v !== undefined
    );
  const hasRisks =
    recommendation?.risks &&
    (recommendation?.risks?.financial_risks?.length > 0 ||
      recommendation!.risks.market_risks?.length > 0 ||
      recommendation.risks.sector_risks?.length > 0);
  const hasRecommendation =
    recommendation?.recommendation &&
    (recommendation.recommendation.verdict ||
      recommendation.recommendation.target_price);

  return (
    <div className="max-h-[80vh] overflow-y-auto text-white">
      {/* Header with Company Info */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">
          {recommendation?.company || "Stock Analysis"}
        </h3>
        {recommendation?.symbol && (
          <p className="text-gray-400 text-sm">{recommendation.symbol}</p>
        )}
      </div>

      {/* Recommendation Card */}
      {hasRecommendation && (
        <div
          className={`border-2 rounded-lg p-6 mb-6 ${getVerdictColor(
            recommendation.recommendation?.verdict
          )}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Recommendation</p>
                <p className="text-2xl font-bold">
                  {recommendation.recommendation?.verdict?.toUpperCase() ||
                    "N/A"}
                </p>
              </div>
            </div>
            {recommendation.recommendation?.target_price && (
              <div className="text-right">
                <p className="text-sm opacity-80">Target Price</p>
                <p className="text-xl font-semibold">
                  {recommendation.recommendation.target_price}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Snapshot */}
      {hasSnapshot && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {recommendation.snapshot?.current_price && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Current Price</p>
              <p className="text-xl font-bold text-white">
                ₹{recommendation.snapshot.current_price}
              </p>
            </div>
          )}
          {recommendation.snapshot?.market_cap && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Market Cap</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(recommendation.snapshot.market_cap)}
              </p>
            </div>
          )}
          {recommendation.snapshot?.pe_ratio && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">P/E Ratio</p>
              <p className="text-xl font-bold text-white">
                {formatNumber(recommendation.snapshot.pe_ratio)}
              </p>
            </div>
          )}
          {(recommendation.snapshot?.["52_week_low"] ||
            recommendation.snapshot?.["52_week_high"]) && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">52W Range</p>
              <p className="text-lg font-semibold text-white">
                ₹{recommendation.snapshot["52_week_low"] || "N/A"} - ₹
                {recommendation.snapshot["52_week_high"] || "N/A"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fundamentals */}
      {hasFundamentals && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-4">
          <button
            onClick={() => toggleSection("fundamentals")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Fundamentals</span>
            </div>
            {expandedSections.fundamentals ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.fundamentals && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {recommendation.fundamentals?.revenue && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Revenue</p>
                    <p className="font-semibold">
                      {formatCurrency(recommendation.fundamentals.revenue)}
                    </p>
                  </div>
                )}
                {recommendation.fundamentals?.net_income && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Net Income</p>
                    <p className="font-semibold">
                      {formatCurrency(recommendation.fundamentals.net_income)}
                    </p>
                  </div>
                )}
                {recommendation.fundamentals?.returnOnEquity && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">ROE</p>
                    <p className="font-semibold">
                      {(
                        recommendation.fundamentals.returnOnEquity * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                )}
                {recommendation.fundamentals?.forwardPE && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Forward P/E</p>
                    <p className="font-semibold">
                      {formatNumber(recommendation.fundamentals.forwardPE)}
                    </p>
                  </div>
                )}
                {recommendation.fundamentals?.priceToBook && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">P/B Ratio</p>
                    <p className="font-semibold">
                      {formatNumber(recommendation.fundamentals.priceToBook)}
                    </p>
                  </div>
                )}
                {recommendation.fundamentals?.return_on_assets && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">ROA</p>
                    <p className="font-semibold">
                      {(
                        recommendation.fundamentals.return_on_assets * 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                )}
              </div>
              {recommendation.fundamentals?.analysis && (
                <p className="text-sm text-gray-300 bg-gray-800 rounded p-3">
                  {recommendation.fundamentals.analysis}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Technicals */}
      {hasTechnicals && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-4">
          <button
            onClick={() => toggleSection("technicals")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">Technical Analysis</span>
            </div>
            {expandedSections.technicals ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.technicals && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {recommendation.technicals?.sma_20 && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">SMA 20</p>
                    <p className="font-semibold">
                      ₹{recommendation.technicals.sma_20}
                    </p>
                  </div>
                )}
                {recommendation.technicals?.sma_50 && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">SMA 50</p>
                    <p className="font-semibold">
                      ₹{recommendation.technicals.sma_50}
                    </p>
                  </div>
                )}
                {recommendation.technicals?.rsi && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">RSI</p>
                    <p className="font-semibold">
                      {recommendation.technicals.rsi}
                    </p>
                  </div>
                )}
              </div>
              {recommendation.technicals?.trend_signal && (
                <div className="flex items-center gap-2 bg-gray-800 rounded p-3">
                  <span className="text-gray-400 text-sm">Trend Signal:</span>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-xs ${
                      recommendation.technicals.trend_signal === "bearish"
                        ? "bg-red-500/20 text-red-500"
                        : recommendation.technicals.trend_signal === "bullish"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {recommendation.technicals.trend_signal.toUpperCase()}
                  </span>
                </div>
              )}
              {recommendation.technicals?.analysis && (
                <p className="text-sm text-gray-300 bg-gray-800 rounded p-3">
                  {recommendation.technicals.analysis}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Risks */}
      {hasRisks && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-4">
          <button
            onClick={() => toggleSection("risks")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="font-semibold">Risk Factors</span>
            </div>
            {expandedSections.risks ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.risks && (
            <div className="p-4 pt-0 space-y-3">
              {recommendation.risks?.financial_risks &&
                recommendation.risks.financial_risks.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-orange-500 mb-2">
                      Financial Risks
                    </p>
                    <ul className="space-y-1">
                      {recommendation.risks.financial_risks.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex items-start gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {recommendation.risks?.market_risks &&
                recommendation.risks.market_risks.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-500 mb-2">
                      Market Risks
                    </p>
                    <ul className="space-y-1">
                      {recommendation.risks.market_risks.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex items-start gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {recommendation.risks?.sector_risks &&
                recommendation.risks.sector_risks.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-yellow-500 mb-2">
                      Sector Risks
                    </p>
                    <ul className="space-y-1">
                      {recommendation.risks.sector_risks.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex items-start gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* Investment Thesis */}
      {recommendation?.investment_thesis && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 mb-4">
          <button
            onClick={() => toggleSection("thesis")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Investment Thesis</span>
            </div>
            {expandedSections.thesis ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.thesis && (
            <div className="p-4 pt-0">
              <p className="text-sm text-gray-300 leading-relaxed">
                {recommendation.investment_thesis}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6">
        <p className="text-xs text-yellow-500">
          <strong>Disclaimer:</strong> This is an AI-generated recommendation
          based on available data. Please conduct your own research and consult
          with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default StockMarketRecommendation;
