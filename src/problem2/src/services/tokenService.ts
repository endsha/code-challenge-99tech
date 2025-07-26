import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { TokenData, AccountBalance } from "../types";

const PRICES_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICONS_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

// Query key constants
export const QUERY_KEYS = {
  TOKEN_PRICES: ["tokenPrices"] as const,
  ACCOUNT_BALANCES: ["accountBalances"] as const,
} as const;

// Mock account balances data
const MOCK_ACCOUNT_BALANCES: AccountBalance = {
  BLUR: 1250.75,
  bNEO: 500.0,
  BUSD: 2500.5,
  USD: 10000.0,
  ETH: 5.25,
  GMX: 100.0,
  STEVMOS: 750.25,
  LUNA: 1000.0,
  RATOM: 250.5,
  STRD: 800.0,
  EVMOS: 1500.75,
  IBCX: 300.0,
  IRIS: 600.25,
  ampLUNA: 150.0,
  KUJI: 450.5,
  STOSMO: 900.0,
  USDC: 5000.0,
  axlUSDC: 2000.0,
  ATOM: 200.75,
  STATOM: 350.0,
  OSMO: 1800.5,
  rSWTH: 50.25,
  STLUNA: 125.0,
  LSI: 75.5,
  OKB: 400.0,
  OKT: 300.75,
  SWTH: 10000.0,
  USC: 1200.0,
  WBTC: 0.5,
  wstETH: 3.25,
  YieldUSD: 800.0,
  ZIL: 15000.0,
};

// Dynamic balances state (starts with mock data)
let currentBalances: AccountBalance = { ...MOCK_ACCOUNT_BALANCES };

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

// API function for fetching account balances (mocked)
const fetchAccountBalancesAPI = async (): Promise<AccountBalance> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...currentBalances };
};

// React Query hook for fetching account balances
export const useAccountBalances = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT_BALANCES,
    queryFn: fetchAccountBalancesAPI,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: 1000,
  });
};

// Utility function to get balance for a specific token
export const getTokenBalance = (
  currency: string,
  balances: AccountBalance | undefined
): number => {
  return balances?.[currency] ?? 0;
};

// Utility function to format balance for display
export const formatBalance = (balance: number): string => {
  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(2)}M`;
  }
  if (balance >= 1000) {
    return `${(balance / 1000).toFixed(2)}K`;
  }
  return balance.toFixed(2);
};

// Swap transaction interface
export interface SwapTransaction {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
}

// Function to update balances after a swap
const executeSwap = async (
  transaction: SwapTransaction
): Promise<AccountBalance> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Update the current balances
  currentBalances = {
    ...currentBalances,
    [transaction.fromToken]:
      (currentBalances[transaction.fromToken] || 0) - transaction.fromAmount,
    [transaction.toToken]:
      (currentBalances[transaction.toToken] || 0) + transaction.toAmount,
  };

  return { ...currentBalances };
};

// React Query mutation hook for swap transactions
export const useSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeSwap,
    onSuccess: () => {
      // Invalidate and refetch account balances after successful swap
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_BALANCES });
    },
  });
};
