import { fetch } from "@tauri-apps/api/http";

interface SteamMarketItem {
  success: boolean;
  /* eslint-disable @typescript-eslint/naming-convention */
  lowest_price: string;
  /* eslint-enable @typescript-eslint/naming-convention */
}

function parseMarketItemPrice(item: SteamMarketItem): number {
  const priceMatch = item.lowest_price.match(/[\d.,]+/);
  if (!priceMatch) {
    throw new Error(`Invalid price value: ${item.lowest_price}`);
  }
  return parseFloat(priceMatch[0]);
}

async function fetchMarketItemPrice(url: string): Promise<number> {
  const priceResponse = await fetch<SteamMarketItem>(url);
  if (!priceResponse.ok || !priceResponse.data.success) {
    throw new Error(`Invalid Steam market response`);
  }
  return parseMarketItemPrice(priceResponse.data);
}

export async function fetchSteamRate(): Promise<number> {
  const getItemUrl = (currencyId: number) =>
    `https://steamcommunity.com/market/priceoverview/?appid=730&currency=${currencyId}&market_hash_name=Clutch%20Case%20Key`;
  enum CurrencyID {
    usd = 1,
    rub = 5,
  }
  const usdPrice = await fetchMarketItemPrice(getItemUrl(CurrencyID.usd));
  const rubPrice = await fetchMarketItemPrice(getItemUrl(CurrencyID.rub));
  return rubPrice / usdPrice;
}
