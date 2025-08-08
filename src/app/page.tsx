"use client";
import { useEffect, useState } from "react";
import MarketBlock from "./market-block";
import { Market } from "./types.app";

export default function Home() {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        archived: "false",
        active: "true",
        closed: "false",
        liquidity_num_min: "100000",
      });

      const response = await fetch(`/api/markets?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Market data ", data);
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data ", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarketData();
  }, []);

  return (
    <div>
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">
          Polymarket Liquidity Analysis
        </h1>

        {loading && (
          <div className="text-center py-8">
            <p>Loading market data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {marketData && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black">Market Data</h2>
            <div className="text-black">
              {marketData.map((market: Market) => (
                <MarketBlock key={market.id} market={market} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
