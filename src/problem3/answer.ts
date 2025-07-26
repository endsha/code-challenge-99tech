// Problem 3: Messy React - Refactored TypeScript Solution
// This file demonstrates the corrected and optimized code

// Properly defined interfaces
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Fixed: Added missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Mock data with proper typing
const mockBalances: WalletBalance[] = [
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

// Fixed: Moved outside class to avoid recreation (in React context)
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

// REFACTORED SOLUTION
export class RefactoredWalletProcessor {
  private balances: WalletBalance[];
  private prices: Record<string, number>;
  private sortedBalancesCache: WalletBalance[] | null = null;
  private formattedBalancesCache: FormattedWalletBalance[] | null = null;

  constructor() {
    this.balances = mockBalances;
    this.prices = mockPrices;
  }

  // Fixed: Proper filtering and sorting logic
  private getSortedBalances(): WalletBalance[] {
    if (this.sortedBalancesCache) {
      return this.sortedBalancesCache;
    }

    this.sortedBalancesCache = this.balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed: Correct logic - keep balances with priority > -99 AND amount > 0
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Fixed: Complete sort function
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // Fixed: Handle equal priorities
      });

    return this.sortedBalancesCache;
  }

  // Fixed: Proper typing and caching
  private getFormattedBalances(): FormattedWalletBalance[] {
    if (this.formattedBalancesCache) {
      return this.formattedBalancesCache;
    }

    const sortedBalances = this.getSortedBalances();
    this.formattedBalancesCache = sortedBalances.map(
      (balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        formatted: balance.amount.toFixed(2), // Fixed: Added precision
      })
    );

    return this.formattedBalancesCache;
  }

  // Fixed: Proper error handling and typing
  public processBalances(): Array<{
    key: string;
    amount: number;
    usdValue: number;
    formattedAmount: string;
    currency: string;
    blockchain: string;
  }> {
    const formattedBalances = this.getFormattedBalances();

    return formattedBalances.map((balance: FormattedWalletBalance) => {
      // Fixed: Added null safety for price lookups
      const price = this.prices[balance.currency] || 0;
      const usdValue = price * balance.amount;

      return {
        key: balance.currency, // Fixed: Better key than index
        amount: balance.amount,
        usdValue: usdValue,
        formattedAmount: balance.formatted,
        currency: balance.currency,
        blockchain: balance.blockchain,
      };
    });
  }

  // Additional utility methods for demonstration
  public getStatistics(): {
    totalBalances: number;
    validBalances: number;
    totalUsdValue: number;
    topBlockchain: string;
  } {
    const processedBalances = this.processBalances();

    const totalUsdValue = processedBalances.reduce(
      (sum, balance) => sum + balance.usdValue,
      0
    );

    // Find most valuable blockchain
    const blockchainValues = processedBalances.reduce((acc, balance) => {
      acc[balance.blockchain] =
        (acc[balance.blockchain] || 0) + balance.usdValue;
      return acc;
    }, {} as Record<string, number>);

    const topBlockchain =
      Object.entries(blockchainValues).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "None";

    return {
      totalBalances: this.balances.length,
      validBalances: processedBalances.length,
      totalUsdValue,
      topBlockchain,
    };
  }

  // Clear cache when data changes (important for React useMemo equivalent)
  public updateBalances(newBalances: WalletBalance[]): void {
    this.balances = newBalances;
    this.sortedBalancesCache = null;
    this.formattedBalancesCache = null;
  }

  public updatePrices(newPrices: Record<string, number>): void {
    this.prices = newPrices;
    this.formattedBalancesCache = null; // Only clear formatted cache as sorting doesn't depend on prices
  }

  // Method to demonstrate the improvements
  public demonstrateImprovements(): void {
    console.log("=== REFACTORED SOLUTION ===");
    console.log("Improvements made:");
    console.log("✅ 1. Added missing blockchain property to interface");
    console.log("✅ 2. Fixed variable reference error");
    console.log(
      "✅ 3. Corrected filter logic to exclude zero/negative amounts"
    );
    console.log(
      "✅ 4. Completed sort function with proper equal case handling"
    );
    console.log("✅ 5. Fixed type consistency throughout");
    console.log("✅ 6. Added error handling and null safety");
    console.log("✅ 7. Implemented caching for performance optimization");
    console.log("✅ 8. Used meaningful keys instead of array indices");
    console.log("✅ 9. Added comprehensive typing");
    console.log("✅ 10. Separated concerns with utility methods");

    try {
      const result = this.processBalances();
      const stats = this.getStatistics();

      console.log("\\nProcessed Results:");
      console.log("Results:", result);
      console.log("\\nStatistics:", stats);

      console.log("\\nDemo: Update prices and show cache invalidation");
      this.updatePrices({ ...this.prices, BTC: 50000 });
      const updatedResult = this.processBalances();
      console.log("Updated Results (BTC price changed):", updatedResult);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Usage example
const refactoredProcessor = new RefactoredWalletProcessor();
refactoredProcessor.demonstrateImprovements();

// Export for comparison
export { getPriority, mockBalances, mockPrices };
export type { WalletBalance, FormattedWalletBalance };
