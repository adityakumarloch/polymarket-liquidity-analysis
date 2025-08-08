import { useEffect, useState } from "react";
import { Market, Orderbook } from "./types.app";

export default function MarketBlock({ market }: { market: Market }) {
  // console.log("The market data ", market);

  const [midPrice, setMidPrice] = useState<number>(0);
  const [totalDepth, setTotalDepth] = useState<number>(0);
  const [orderbook, setOrderbook] = useState<{
    bids: Orderbook;
    asks: Orderbook;
  }>({ bids: [], asks: [] });
  const getTokenData = async () => {
    // Parse clobTokenIds as array if needed
    let clobTokenIds: string[] = [];
    if (typeof market.clobTokenIds === "string") {
      try {
        clobTokenIds = JSON.parse(market.clobTokenIds);
      } catch (e) {
        console.error(
          "Failed to parse clobTokenIds string:",
          market.clobTokenIds,
          e
        );
        clobTokenIds = [];
      }
    } else if (Array.isArray(market.clobTokenIds)) {
      clobTokenIds = market.clobTokenIds;
    }

    const tokenId = clobTokenIds?.[0];
    if (tokenId) {
      const response = await fetch(
        `https://clob.polymarket.com/book?token_id=${tokenId}`
      );
      const data = await response.json();

      setOrderbook(data);

      // Calculate mid-price from best bid/ask
      const bestBid =
        data?.bids?.length > 0 ? parseFloat(data.bids[0].price) : null;
      const bestAsk =
        data?.asks?.length > 0 ? parseFloat(data.asks[0].price) : null;

      if (bestBid !== null && bestAsk !== null) {
        const midPrice = (bestBid + bestAsk) / 2;
        // Calculate price bounds
        const upper_bound = midPrice * 1.02;
        const lower_bound = midPrice * 0.98;

        // Sum bid liquidity for orders with price >= lower_bound
        let bidLiquidity = 0;
        if (data?.bids?.length > 0) {
          bidLiquidity = data.bids
            .filter((bid: any) => parseFloat(bid.price) >= lower_bound)
            .reduce((sum: number, bid: any) => sum + parseFloat(bid.size), 0);
        }

        // Sum ask liquidity for orders with price <= upper_bound
        let askLiquidity = 0;
        if (data?.asks?.length > 0) {
          askLiquidity = data.asks
            .filter((ask: any) => parseFloat(ask.price) <= upper_bound)
            .reduce((sum: number, ask: any) => sum + parseFloat(ask.size), 0);
        }

        // Set state for bid and ask liquidity

        // Total depth = sum of qualifying bid + ask liquidity
        const totalDepth = bidLiquidity + askLiquidity;
        setTotalDepth(totalDepth);
        setMidPrice(midPrice);
        console.log("Mid-price:", midPrice);
      } else {
        console.log("Cannot calculate mid-price: missing best bid or ask.");
      }
    }
  };
  useEffect(() => {
    getTokenData();
  }, []);
  console.log("The market ", market);

  const [isOrderbookOpen, setIsOrderbookOpen] = useState<boolean>(false);

  const toggleOrderbook = () => {
    setIsOrderbookOpen(!isOrderbookOpen);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md mt-2">
      <div className="text-md text-black">{market.question}</div>

      <div className="text-sm text-gray-500">liquidity: {market.liquidity}</div>
      <div className="text-sm text-gray-500">Mid price: {midPrice}</div>
      <div className="text-sm text-gray-500">Total depth: {totalDepth}</div>
      <div className="mt-2">
        <div className="font-semibold text-gray-700">
          Orderbook
          <button
            className="ml-2 text-[10px] text-gray-500 cursor-pointer hover:text-black"
            onClick={toggleOrderbook}
          >
            {isOrderbookOpen ? "Close" : "Open"}
          </button>
        </div>
        {isOrderbookOpen && (
          <div className="flex flex-row gap-8">
            <div>
              <div className="text-xs font-bold text-green-700">Bids</div>
              {orderbook && orderbook.bids.length > 0 ? (
                <ul>
                  {orderbook.bids.map((bid: any, idx: number) => (
                    <li key={idx} className="text-xs text-green-900">
                      Price: {bid.price} | Size: {bid.size}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-400">No bids</div>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-red-700">Asks</div>
              {orderbook && orderbook.asks.length > 0 ? (
                <ul>
                  {orderbook.asks.map((ask: any, idx: number) => (
                    <li key={idx} className="text-xs text-red-900">
                      Price: {ask.price} | Size: {ask.size}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-400">No asks</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
