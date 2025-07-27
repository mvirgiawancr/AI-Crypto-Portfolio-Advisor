"use client";

import dynamic from "next/dynamic";
import WalletConnect from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

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
  const [portfolioData, setPortfolioData] = useState([]);
  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`/api/portfolio?address=${address}`);
      const result = await response.json();
      if (result.tokens) {
        setPortfolioData(result.tokens);
      }
    } catch (error) {
      console.error("Error fetching portfolio for risk analysis:", error);
    }
  };

  useEffect(() => {
    if (address && isConnected) {
      fetchPortfolioData();
    }
  }, [address, isConnected]);

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
            <RiskRadarChart portfolioData={portfolioData} />
          </div>
        )}
      </div>
    </main>
  );
}
