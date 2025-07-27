"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";

interface TokenData {
  symbol: string;
  value: number;
  balance: string;
  percentage: number;
}

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

export default function PortfolioPieChart() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [data, setData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchPortfolio();
    } else {
      setData([]);
    }
  }, [address, isConnected, chainId]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/portfolio?address=${address}&chainId=${chainId}`
      );
      const { tokens = [] } = await res.json();

      const total = tokens.reduce((sum, t) => sum + t.value, 0);
      setData(
        total
          ? tokens.map((t) => ({
              ...t,
              percentage: (t.value / total) * 100,
            }))
          : []
      );

      if (tokens.length) {
        await refetchRisk(tokens);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refetchRisk = async (portfolio: any[]) => {
    try {
      await fetch("/api/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio }),
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Portfolio Allocation</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Portfolio Allocation</h2>
        <p className="text-gray-500">Connect your wallet to view portfolio</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Portfolio Allocation</h2>
      <div className="h-96">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ symbol, percentage }) =>
                  `${symbol} ${percentage.toFixed(1)}%`
                }
                outerRadius={120}
                dataKey="value"
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 text-lg">
            No tokens on this chain
          </div>
        )}
      </div>
    </div>
  );
}
