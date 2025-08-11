export type MarketType = {
  id: string;
  token_id: string;
  question: string;
  archived: boolean;
  active: boolean;
  liquidity: string;
  closed: boolean;
  bestBid: number;
  bestAsk: number;
  clobTokenIds: string[];
  endDate: string;
};

export type Orderbook = {
  price: string;
  size: string;
}[];
export type TimeRemainingType = "All" | "1d" | "7d" | "30d";
