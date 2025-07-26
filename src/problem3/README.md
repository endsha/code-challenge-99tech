# Problem 3: Messy React

<aside>
⏰ Duration: You should not spend more than 6 **hours** on this problem.
*Time estimation is for internship roles, if you are a software professional you should spend significantly less time.*

</aside>

## Demo Project

This is a Vite + React + TypeScript project demonstrating the issues found in the messy React code and their solutions.

### Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── problem.tsx      # Original problematic React component
│   ├── answer.tsx       # Refactored React component
│   └── index.css        # Styles
├── problem.ts           # Standalone TypeScript version of problematic code
├── answer.ts            # Standalone TypeScript version of refactored code
├── demo.ts              # Comparison demo script
└── package.json         # Project dependencies
```

### Available Scripts

#### React Development

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build

#### TypeScript Demos

- `npm run demo` - Run the comparison demo between problematic and refactored code
- `npm run problem` - Run only the problematic implementation
- `npm run answer` - Run only the refactored solution

### Installation

```bash
npm install
```

### Running the Project

#### Option 1: React Demo (Visual)

```bash
npm run dev
```

Then open http://localhost:5173 to see both implementations side by side.

#### Option 2: TypeScript Demo (Console)

```bash
npm run demo
```

This will run both implementations in the console and show the comparison.

## Task

List out the computational inefficiencies and anti-patterns found in the code block below.

1. This code block uses
   1. ReactJS with TypeScript.
   2. Functional components.
   3. React Hooks
2. You should also provide a refactored version of the code, but more points are awarded to accurately stating the issues and explaining correctly how to improve them.

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
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
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
```

## Issues and Inefficiencies Found

### 1. **Missing TypeScript Interface Properties**

- The `WalletBalance` interface is missing the `blockchain` property that is used in `getPriority(balance.blockchain)`
- The `Props` interface extends `BoxProps` but is empty and could be more specific

### 2. **Variable Reference Error**

- Line in filter function uses `lhsPriority` but the variable is named `balancePriority`
- This would cause a ReferenceError at runtime

### 3. **Incorrect Filter Logic**

- The filter condition `balance.amount <= 0` returns `true`, which means it keeps balances with zero or negative amounts
- This is likely incorrect - usually you'd want to filter OUT zero/negative balances
- The logic should probably be `balance.amount > 0`

### 4. **Incomplete Sort Function**

- The sort function doesn't handle the case where priorities are equal
- Missing return statement for the equal case, which could lead to unstable sorting

### 5. **Unnecessary useMemo Dependency**

- `prices` is included in the dependency array of `sortedBalances` useMemo, but prices is not used in the filtering/sorting logic
- This causes unnecessary recalculations when prices change

### 6. **Missing useMemo for Expensive Operations**

- `formattedBalances` is recalculated on every render without memoization
- `rows` is also recalculated on every render and involves expensive operations (price calculations)

### 7. **Type Inconsistency**

- `formattedBalances` is typed as `WalletBalance` but should be `FormattedWalletBalance`
- `rows` maps over `sortedBalances` but types the parameter as `FormattedWalletBalance`

### 8. **Inefficient Key Usage**

- Using array `index` as React key is an anti-pattern that can cause rendering issues
- Should use a unique identifier like `balance.currency` or a combination of properties

### 9. **Function Declaration Inside Component**

- `getPriority` function is redeclared on every render
- Should be moved outside the component or memoized with `useCallback`

### 10. **Missing Error Handling**

- No null checks for `prices[balance.currency]`
- Could cause runtime errors if price data is missing

### 11. **Unused Props**

- `children` is destructured but never used

## Refactored Version

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {
  // Add specific props if needed
}

// Move outside component to avoid recreation
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
  const { children, ...rest } = props;
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

        // Complete sort function
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // Equal priorities
      });
  }, [balances]); // Removed prices from dependencies

  const formattedBalances = useMemo(() => {
    return sortedBalances.map(
      (balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      })
    );
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Better key than index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
```

## Key Improvements Made

1. **Added missing `blockchain` property** to `WalletBalance` interface
2. **Fixed variable reference error** (`lhsPriority` → `balancePriority`)
3. **Corrected filter logic** to exclude zero/negative amounts
4. **Completed sort function** with proper equal case handling
5. **Removed unnecessary dependency** (`prices`) from `sortedBalances` useMemo
6. **Added memoization** for `formattedBalances` and `rows`
7. **Fixed type consistency** throughout the component
8. **Used better React keys** (currency instead of index)
9. **Moved `getPriority` outside component** to prevent recreation
10. **Added null safety** for price lookups
11. **Improved code formatting** and consistency

## Technologies Used

- **Vite** - Build tool and development server
- **React 18** - UI library
- **TypeScript** - Type safety
- **CSS** - Styling

## Learning Outcomes

This project demonstrates:

- Common React performance anti-patterns
- TypeScript type safety issues
- Proper use of React hooks (`useMemo`, `useCallback`)
- Error handling best practices
- Component optimization strategies
