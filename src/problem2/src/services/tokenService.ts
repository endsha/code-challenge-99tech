import { useQuery } from "@tanstack/react-query";
import type { TokenData } from "../types";

const PRICES_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICONS_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

// Query key constants
export const QUERY_KEYS = {
  TOKEN_PRICES: ["tokenPrices"] as const,
} as const;

// API function for fetching token prices
const fetchTokenPricesAPI = async (): Promise<TokenData> => {
  const response = await fetch(PRICES_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }

  const prices = await response.json();

  // Convert array to object with currency as key for easier lookup
  const pricesMap: TokenData = {};
  prices.forEach((token: any) => {
    if (token.price && token.price > 0) {
      pricesMap[token.currency] = token;
    }
  });

  return pricesMap;
};

// React Query hook for fetching token prices
export const useTokenPrices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TOKEN_PRICES,
    queryFn: fetchTokenPricesAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Utility functions
export const getTokenIconUrl = (currency: string): string => {
  return `${TOKEN_ICONS_BASE_URL}/${currency}.svg`;
};

export const calculateExchangeRate = (
  fromToken: string,
  toToken: string,
  prices: TokenData
): number => {
  const fromPrice = prices[fromToken]?.price;
  const toPrice = prices[toToken]?.price;

  if (!fromPrice || !toPrice) {
    return 0;
  }

  return fromPrice / toPrice;
};

export const convertAmount = (amount: number, exchangeRate: number): number => {
  return amount * exchangeRate;
};

// Helper hook to get available tokens from prices data
export const useAvailableTokens = () => {
  const { data: tokenPrices, ...queryResult } = useTokenPrices();

  const availableTokens = tokenPrices ? Object.keys(tokenPrices).sort() : [];

  return {
    availableTokens,
    tokenPrices,
    ...queryResult,
  };
};
