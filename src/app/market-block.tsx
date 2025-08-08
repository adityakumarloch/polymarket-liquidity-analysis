import { Market } from "./types.app";

export default function MarketBlock({ market }: { market: Market }) {
  return <div>{market.question}</div>;
}
