"use client";

import dynamic from "next/dynamic";
import WalletConnect from "@/components/WalletConnect";
import { useAccount, useChainId } from "wagmi";
import { useState, useEffect } from "react";
import { useCallback } from "react";

const PortfolioPieChart = dynamic(
  () => import("@/components/PortfolioPieChart"),
  {
    ssr: false,
  }
);

const RiskRadarChart = dynamic(() => import("@/components/RiskRadarChart"), {
  ssr: false,
});

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [portfolioData, setPortfolioData] = useState([]);
  const fetchPortfolioData = useCallback(async () => {
    if (!address || !isConnected) return;
    try {
      const res = await fetch(
        `/api/portfolio?address=${address}&chainId=${chainId}`
      );
      const { tokens = [] } = await res.json();
      setPortfolioData(tokens);
    } catch (err) {
      console.error(err);
    }
  }, [address, isConnected, chainId]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Crypto Portfolio Advisor
          </h1>
          <p className="text-lg text-gray-600">
            Connect your wallet to get AI-powered portfolio analysis
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PortfolioPieChart />
            <RiskRadarChart />
          </div>
        )}
      </div>
    </main>
  );
}
