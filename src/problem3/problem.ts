// Problem 3: Messy React - Problematic TypeScript Code
// This file demonstrates the original problematic code with all its issues

// Mock data types and implementations
interface WalletBalance {
  currency: string;
  amount: number;
  // Missing blockchain property that is used later!
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// Mock data
const mockBalances = [
  { currency: "BTC", amount: 1.5, blockchain: "Bitcoin" },
  { currency: "ETH", amount: 10.2, blockchain: "Ethereum" },
  { currency: "OSMO", amount: 500, blockchain: "Osmosis" },
  { currency: "ZIL", amount: 0, blockchain: "Zilliqa" },
  { currency: "NEO", amount: -5, blockchain: "Neo" },
  { currency: "ARB", amount: 25.7, blockchain: "Arbitrum" },
] as any;

const mockPrices = {
  BTC: 45000,
  ETH: 3000,
  OSMO: 1.2,
  ZIL: 0.05,
  NEO: 15,
  ARB: 1.8,
};

// PROBLEMATIC IMPLEMENTATION
export class ProblematicWalletProcessor {
  private balances: WalletBalance[];
  private prices: any;

  constructor() {
    this.balances = mockBalances;
    this.prices = mockPrices;
  }

  // Issue 1: Function recreated every time (if this was inside a React component)
  private getPriority(blockchain: any): number {
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
  }

  // Issue 2: Multiple computational inefficiencies
  public processBalances(): any[] {
    // Issue 3: Unnecessary filtering with wrong variable reference
    const sortedBalances = this.balances
      .filter((balance: WalletBalance) => {
        const balancePriority = this.getPriority((balance as any).blockchain);
        // Issue 4: lhsPriority is not defined! This would cause ReferenceError
        // @ts-ignore - Ignoring to show the runtime error
        if (lhsPriority > -99) {
          // Issue 5: Wrong logic - keeps balances with amount <= 0
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = this.getPriority((lhs as any).blockchain);
        const rightPriority = this.getPriority((rhs as any).blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Issue 6: Missing return for equal case
      });

    // Issue 7: Not optimized - should be memoized in React
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });

    // Issue 8: Type inconsistency and missing error handling
    const result = sortedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        // Issue 9: No null check for prices - could cause runtime error
        const usdValue = this.prices[balance.currency] * balance.amount;
        return {
          key: index, // Issue 10: Using index as key (React anti-pattern)
          amount: balance.amount,
          usdValue: usdValue,
          formattedAmount: (balance as any).formatted || "N/A", // Type casting needed
        };
      }
    );

    return result;
  }

  // Method to demonstrate the issues
  public demonstrateIssues(): void {
    console.log("=== PROBLEMATIC IMPLEMENTATION ===");
    console.log("This implementation has the following issues:");
    console.log("1. Missing TypeScript interface properties");
    console.log("2. Variable reference error (lhsPriority)");
    console.log("3. Incorrect filter logic");
    console.log("4. Incomplete sort function");
    console.log("5. Type inconsistencies");
    console.log("6. Missing error handling");
    console.log("7. Performance issues (would be worse in React)");

    try {
      const result = this.processBalances();
      console.log("Result:", result);
    } catch (error) {
      console.error("Runtime Error:", error);
    }
  }
}

// Usage example
const problematicProcessor = new ProblematicWalletProcessor();
problematicProcessor.demonstrateIssues();
