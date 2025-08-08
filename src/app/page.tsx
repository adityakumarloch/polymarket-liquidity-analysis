"use client";
import { useEffect, useState } from "react";
import MarketBlock from "./market-block";
import { Market } from "./types.app";

export default function Home() {
  const [marketData, setMarketData] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minLiquidity, setMinLiquidity] = useState<number>(100000);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy] = useState<"liquidity">("liquidity");

  const handleMinLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinLiquidity(Number(e.target.value));
  };

  const getMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        archived: "false",
        active: "true",
        closed: "false",
        liquidity_num_min: minLiquidity.toString(),
        limit: "5",
        ascending: sortOrder === "asc" ? "true" : "false",
        order: sortBy,
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
    <div className="p-8 ">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-6">
          Polymarket Liquidity Analysis
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={getMarketData}
        >
          Get Data
        </button>
        <div className="flex flex-col gap-2">
          <label htmlFor="minLiquidity">Min Liquidity</label>
          <div>
            <input
              type="number"
              id="minLiquidity"
              value={minLiquidity}
              onChange={handleMinLiquidityChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div>Sorting by: </div>
        <div className="flex gap-4 items-center">
          <button
            className={` px-3 py-1 rounded hover:bg-gray-300  ${
              sortBy === "liquidity"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSortOrder("asc")}
            disabled={sortBy === "liquidity"}
          >
            Liquidity
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className={` px-3 py-1 rounded  ${
              sortOrder === "asc"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-500"
            }`}
            onClick={() => setSortOrder("asc")}
            disabled={sortOrder === "asc"}
          >
            Ascending
          </button>
          <button
            className={` px-3 py-1 rounded  ${
              sortOrder === "desc"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-500"
            }`}
            onClick={() => setSortOrder("desc")}
            disabled={sortOrder === "desc"}
          >
            Descending
          </button>
        </div>

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

        {marketData && marketData.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black">Market Data</h2>
            <div className="text-black">
              {marketData.map((market: Market) => (
                <MarketBlock key={market.id} market={market} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">No data found</div>
        )}
      </div>
    </div>
  );
}
