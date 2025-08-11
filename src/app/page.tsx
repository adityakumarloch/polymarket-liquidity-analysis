"use client";
import { useEffect, useState } from "react";
import MarketBlock from "./market-block";
import { MarketType, TimeRemainingType } from "./types.app";

export default function Home() {
  const [marketData, setMarketData] = useState<MarketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy] = useState<"liquidity">("liquidity");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const timeOptions: TimeRemainingType[] = ["All", "1d", "7d", "30d"];
  const [timeRemaining, setTimeRemaining] = useState<TimeRemainingType>("All");

  // Liquidity
  const [minLiquidity, setMinLiquidity] = useState<number | null>(100000);
  const handleMinLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0) {
      setMinLiquidity(0);
      return;
    }
    setMinLiquidity(Number(e.target.value));
  };
  // Liquidity

  // Volume
  const [minVolume, setMinVolume] = useState<number | null>(null);
  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0) {
      setMinVolume(0);
      return;
    }
    setMinVolume(Number(e.target.value));
  };
  // volume

  const getMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        archived: "false",
        active: "true",
        closed: "false",
        limit: "50",
        ascending: sortOrder === "asc" ? "true" : "false",
        order: sortBy,
        offset: pageNumber.toString(),
      });
      if (minVolume) {
        params.append("volume_num_min", minVolume.toString());
      }
      if (minLiquidity) {
        params.append("liquidity_num_min", minLiquidity.toString());
      }
      if (timeRemaining !== "All") {
        const endTime = new Date();
        let timeInSeconds: number;
        switch (timeRemaining) {
          case "1d":
            endTime.setDate(endTime.getDate() + 1);
            break;
          case "7d":
            endTime.setDate(endTime.getDate() + 7);
            break;
          case "30d":
            endTime.setDate(endTime.getDate() + 30);
            break;
          default:
            // "All" or unknown, do not modify endTime
            break;
        }
        timeInSeconds = Math.floor(endTime.getTime() / 1000);
        params.append("end_date_max", timeInSeconds.toString());
      }

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
  const goToNextPage = () => {
    setPageNumber(pageNumber + 1);
  };
  const goToPreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  useEffect(() => {
    getMarketData();
  }, [pageNumber]);

  return (
    <div className="p-8 ">
      <div className="w-full flex flex-col gap-4">
        <div
          className={`w-full flex flex-col gap-4 ${
            loading ? "pointer-events-none" : ""
          }`}
        >
          <h1 className="text-3xl font-bold mb-6">
            Polymarket Liquidity Analysis
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={getMarketData}
          >
            Get Data
          </button>
          <div className="flex item-center gap-[20px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="minLiquidity">Min Liquidity</label>
              <div>
                <input
                  type="number"
                  id="minLiquidity"
                  value={minLiquidity || ""}
                  onChange={handleMinLiquidityChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="minVolume">Min Volume</label>
              <div>
                <input
                  type="number"
                  id="minVolume"
                  value={minVolume || ""}
                  onChange={handleMinVolumeChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>
          <div>
            <div>Time Remaining: </div>
            <div className="flex item-center gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  className={` px-3 py-1 rounded  ${
                    timeRemaining === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-500 cursor-pointer"
                  }`}
                  onClick={() => setTimeRemaining(option)}
                  disabled={timeRemaining === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>Sort by: </div>
          {/* <div className="flex gap-4 items-center">
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
          </div> */}
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

          <div className="mt-[30px] w-full flex items-center justify-between gap-2">
            <button
              className={` px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 disabled:pointer-events-none`}
              disabled={pageNumber === 1}
              onClick={goToPreviousPage}
            >
              Previous
            </button>
            <div className="text-white text-[20px]">Page: {pageNumber}</div>
            <button
              className={` px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 disabled:pointer-events-none`}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-center py-8">
            <p>Loading market data...</p>
          </div>
        ) : (
          <>
            {marketData && marketData.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-black">
                  Market Data
                </h2>
                <div className="text-black">
                  {marketData.map((market: MarketType) => (
                    <MarketBlock key={market.id} market={market} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-red-500">No data found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
