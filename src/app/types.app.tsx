export type Market = {
  id: string;
  token_id: string;
  question: string;
  archived: boolean;
  active: boolean;
  liquidity: string;
  closed: boolean;

  clobTokenIds: string[];
};

export type Orderbook = {
  price: string;
  size: string;
}[];
