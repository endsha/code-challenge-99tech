import React, { useMemo } from "react";

// Mock data and hooks for demonstration
const mockBalances = [
  { currency: "BTC", amount: 1.5, blockchain: "Bitcoin" },
  { currency: "ETH", amount: 10.2, blockchain: "Ethereum" },
  { currency: "OSMO", amount: 500, blockchain: "Osmosis" },
  { currency: "ZIL", amount: 0, blockchain: "Zilliqa" },
  { currency: "NEO", amount: -5, blockchain: "Neo" },
  { currency: "ARB", amount: 25.7, blockchain: "Arbitrum" },
];

const mockPrices = {
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
    <span className="currency">Currency</span>
    <span className="amount">{formattedAmount}</span>
    <span className="usd-value">${usdValue.toFixed(2)}</span>
  </div>
);

// Mock classes object
const classes = {
  row: "wallet-row-class",
};

// ORIGINAL PROBLEMATIC CODE STARTS HERE
interface WalletBalance {
  currency: string;
  amount: number;
  // Missing blockchain property!
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Function recreated on every render
  const getPriority = (blockchain: any): number => {
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

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority((balance as any).blockchain);
        // ERROR: lhsPriority is not defined!
        // @ts-ignore - Ignoring to show the runtime error
        if (lhsPriority > -99) {
          // LOGIC ERROR: Keeps balances with amount <= 0
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority((lhs as any).blockchain);
        const rightPriority = getPriority((rhs as any).blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Missing return for equal case!
      });
  }, [balances, prices]); // prices is unnecessary dependency

  // Not memoized - recalculated every render
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // Not memoized - recalculated every render
  // Type inconsistency: uses sortedBalances but types as FormattedWalletBalance
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // No null check for prices
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // Bad practice: using index as key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={(balance as any).formatted || "N/A"}
        />
      );
    }
  );

  return (
    <div {...rest}>
      <h3>Problematic Implementation</h3>
      <div className="error">
        ⚠️ This component has multiple issues and will likely cause runtime
        errors!
      </div>
      {rows.length > 0 ? (
        rows
      ) : (
        <div className="loading">No valid balances found</div>
      )}
    </div>
  );
};

export default WalletPage;
