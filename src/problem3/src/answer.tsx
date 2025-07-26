import React, { useMemo } from "react";

// Mock data and hooks for demonstration (same as problem)
const mockBalances = [
  { currency: "BTC", amount: 1.5, blockchain: "Bitcoin" },
  { currency: "ETH", amount: 10.2, blockchain: "Ethereum" },
  { currency: "OSMO", amount: 500, blockchain: "Osmosis" },
  { currency: "ZIL", amount: 0, blockchain: "Zilliqa" },
  { currency: "NEO", amount: -5, blockchain: "Neo" },
  { currency: "ARB", amount: 25.7, blockchain: "Arbitrum" },
];

const mockPrices: Record<string, number> = {
  BTC: 45000,
  ETH: 3000,
  OSMO: 1.2,
  ZIL: 0.05,
  NEO: 15,
  ARB: 1.8,
};

// Mock hooks
const useWalletBalances = () => mockBalances;
const usePrices = () => mockPrices;

// Mock BoxProps for demonstration
interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
}

// Mock WalletRow component
const WalletRow: React.FC<{
  className?: string;
  key: React.Key;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}> = ({ className, amount, usdValue, formattedAmount }) => (
  <div className={`wallet-row ${className || ""}`}>
    <span className="currency">{amount > 0 ? "✅" : "❌"}</span>
    <span className="amount">{formattedAmount}</span>
    <span className="usd-value">${usdValue.toFixed(2)}</span>
  </div>
);

// Mock classes object
const classes = {
  row: "wallet-row-class",
};

// REFACTORED SOLUTION STARTS HERE

// Fixed interface - added missing blockchain property
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

// Better interface inheritance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {
  // Add specific props if needed
}

// Moved outside component to avoid recreation on every render
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props; // Removed unused children
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed logic: keep balances with priority > -99 AND amount > 0
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Complete sort function with proper return for equal case
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // Handle equal priorities
      });
  }, [balances]); // Removed prices from dependencies as it's not used in sorting

  // Memoized to prevent unnecessary recalculations
  const formattedBalances = useMemo(() => {
    return sortedBalances.map(
      (balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        formatted: balance.amount.toFixed(2), // Added precision for better formatting
      })
    );
  }, [sortedBalances]);

  // Memoized and properly typed
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      // Added null safety for price lookups
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Better key than index - using unique identifier
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]); // Proper dependencies

  return (
    <div {...rest}>
      <h3>✅ Refactored Implementation</h3>
      <div style={{ color: "#4caf50", marginBottom: "1rem" }}>
        All issues fixed: proper types, performance optimized, error handling
        added
      </div>
      {rows.length > 0 ? (
        <div>
          <div
            style={{ marginBottom: "1rem", fontSize: "0.9em", color: "#666" }}
          >
            Showing {rows.length} valid balance(s) with positive amounts and
            supported blockchains
          </div>
          {rows}
        </div>
      ) : (
        <div className="loading">No valid balances found</div>
      )}
    </div>
  );
};

export default WalletPage;
