"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";

interface RiskData {
  scores: {
    volatility: number;
    centralization: number;
    marketCap: number;
    maturity: number;
    diversification: number;
  };
  summary: string;
}

export default function RiskRadarChart() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchRisk();
    } else {
      setRiskData(null);
    }
  }, [address, isConnected, chainId]);

  const fetchRisk = async () => {
    setLoading(true);
    try {
      // ambil portofolio terbaru
      const portfolioRes = await fetch(
        `/api/portfolio?address=${address}&chainId=${chainId}`
      );
      const { tokens = [] } = await portfolioRes.json();

      if (!tokens.length) {
        // kosong → radar 0
        setRiskData({
          scores: {
            volatility: 0,
            centralization: 0,
            marketCap: 0,
            maturity: 0,
            diversification: 0,
          },
          summary: "No holdings on this chain.",
        });
        setLoading(false);
        return;
      }

      // panggil AI
      const aiRes = await fetch("/api/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: tokens }),
      });
      const data = await aiRes.json();
      setRiskData(data);
    } catch (err) {
      console.error(err);
      // fallback bila error
      setRiskData({
        scores: {
          volatility: 0,
          centralization: 0,
          marketCap: 0,
          maturity: 0,
          diversification: 0,
        },
        summary: "Unable to analyze risk.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">AI Risk Analysis</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">AI Risk Analysis</h2>
        <p className="text-gray-500">Connect your wallet to analyze risk</p>
      </div>
    );
  }

  // radar kosong bila tidak ada data
  const chartData = riskData?.scores
    ? [
        { subject: "Volatility", A: riskData.scores.volatility, fullMark: 10 },
        {
          subject: "Centralization",
          A: riskData.scores.centralization,
          fullMark: 10,
        },
        { subject: "Market Cap", A: riskData.scores.marketCap, fullMark: 10 },
        { subject: "Maturity", A: riskData.scores.maturity, fullMark: 10 },
        {
          subject: "Diversification",
          A: riskData.scores.diversification,
          fullMark: 10,
        },
      ]
    : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">AI Risk Analysis</h2>
      <div className="h-96">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
              <Radar
                name="Risk Score"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No risk data for this chain
          </div>
        )}
      </div>
      {riskData?.summary && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          {riskData.summary}
        </div>
      )}
    </div>
  );
}
