# Problem 1: Sum to N

## Task

Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

_Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`_.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## How to Run the Implementation

You can test all three implementations by running the provided JavaScript file:

### Prerequisites

- Node.js installed on your system
- Terminal or command prompt access

### Running the Script

1. **Navigate to the problem directory:**

   ```bash
   cd /path/to/your/project/src/problem1
   ```

2. **Run the JavaScript file:**
   ```bash
   node sum_to_n.js
   ```

### What the Script Does

The script will automatically execute:

- ✅ **Usage examples** showing all three implementations
- ✅ **Test cases** verifying correctness across different input values
- ✅ **Performance benchmarking** comparing execution times
- ✅ **Complexity analysis** with different input sizes
- ✅ **Memory usage visualization**
- ✅ **Edge case testing** including stack overflow demonstration
- ✅ **Error handling examples** with try-catch blocks

### Expected Output

You'll see sections like:

```
=== Usage Examples ===
sum_to_n_1(5): 15
sum_to_n_2(5): 15
sum_to_n_3(5): 15

=== Test Cases ===
n=0: 0 0 0
n=1: 1 1 1
n=5: 15 15 15

=== Performance Benchmarking ===
Iterative: 2.345ms
Mathematical: 0.123ms
Recursive (safe): 8.901ms

=== Stack Overflow Demonstration ===
❌ Stack Overflow Error: n=15000 is too large for recursive approach
💡 Recommendation: Use sum_to_n_2(15000) = 112507500 instead
```

### Using Individual Functions

You can also import and use the functions in your own code:

```javascript
const {
  sum_to_n_1,
  sum_to_n_2,
  sum_to_n_3,
  sum_to_n_3_safe,
} = require("./sum_to_n.js");

console.log(sum_to_n_1(100)); // Iterative approach
console.log(sum_to_n_2(100)); // Mathematical formula
console.log(sum_to_n_3_safe(100)); // Safe recursive approach
```

## Implementation 1: Iterative Approach

```javascript
function sum_to_n_1(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```

**Time Complexity**: O(n)  
**Space Complexity**: O(1)

### Description

This approach uses a simple for loop to iterate from 1 to n and accumulates the sum. It's the most intuitive and straightforward implementation that mirrors how humans would naturally calculate the sum.

### Pros:

- **Easy to understand**: The logic is immediately clear to any developer
- **Memory efficient**: Uses constant space regardless of input size
- **Predictable performance**: Linear time complexity with no hidden costs
- **Debugging friendly**: Easy to step through and validate each iteration
- **No risk of stack overflow**: Uses iteration instead of recursion

### Cons:

- **Not optimal for large numbers**: Slower than mathematical formula approach
- **More code**: Requires multiple lines compared to formula-based solution
- **CPU intensive**: Performs n operations instead of constant operations

### Real-World Use Cases:

- **Educational purposes**: Teaching basic programming concepts and loops
- **Progress tracking**: When you need to show incremental progress (e.g., loading bars)
- **Audit trails**: When each step needs to be logged or validated
- **Legacy systems**: When working with codebases that prioritize readability over performance
- **Small datasets**: When n is small enough that performance difference is negligible

## Implementation 2: Mathematical Formula

```javascript
function sum_to_n_2(n) {
  return (n * (n + 1)) / 2;
}
```

**Time Complexity**: O(1)  
**Space Complexity**: O(1)

### Description

This approach uses the mathematical formula for the sum of first n natural numbers: n(n+1)/2. This formula is derived from the arithmetic series sum formula and provides instant results regardless of the input size.

### Pros:

- **Maximum performance**: Constant time execution regardless of input size
- **Memory efficient**: Uses minimal memory with no loops or recursion
- **Scalable**: Works equally fast for n=10 or n=1,000,000
- **Clean and concise**: Single line of code
- **Mathematically elegant**: Leverages proven mathematical principles

### Cons:

- **Potential overflow**: For very large numbers, multiplication might exceed safe integer limits
- **Less intuitive**: Requires mathematical knowledge to understand
- **Floating point precision**: Division might introduce precision errors in some languages
- **Not educational**: Doesn't demonstrate algorithmic thinking for beginners

### Real-World Use Cases:

- **High-performance applications**: Financial calculations, real-time systems, game engines
- **Big data processing**: When processing millions of calculations per second
- **API endpoints**: When response time is critical for user experience
- **Mathematical libraries**: Scientific computing, statistics packages
- **Embedded systems**: When computational resources are limited
- **Competitive programming**: When execution time is strictly limited

## Implementation 3: Recursive Approach

```javascript
function sum_to_n_3(n) {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_3(n - 1);
}
```

**Time Complexity**: O(n)  
**Space Complexity**: O(n) due to call stack

### Description

This approach uses recursion where the function calls itself with n-1 until it reaches the base case. Each recursive call adds to the call stack, creating a chain of function calls that resolve from the innermost to outermost.

### Pros:

- **Demonstrates recursion**: Excellent for teaching recursive thinking
- **Functional programming style**: Aligns with functional programming paradigms
- **Mathematical elegance**: Mirrors the mathematical definition of summation
- **Divide and conquer**: Breaks problem into smaller subproblems
- **No explicit loops**: Uses function calls instead of iteration constructs

### Cons:

- **Stack overflow risk**: Can cause stack overflow for large values of n
- **Memory intensive**: Each call uses stack memory, leading to O(n) space complexity
- **Performance overhead**: Function call overhead makes it slower than iteration
- **Debugging complexity**: Harder to trace through multiple stack frames
- **Not tail-call optimized**: JavaScript doesn't optimize tail recursion

### Real-World Use Cases:

- **Educational environments**: Teaching recursion concepts in computer science courses
- **Tree traversals**: When working with hierarchical data structures
- **Mathematical computations**: Implementing mathematical recursive definitions
- **Functional programming**: In languages that optimize tail recursion (like Scheme, Haskell)
- **Small problem sizes**: When n is guaranteed to be small and readability matters
- **Algorithm interviews**: Demonstrating understanding of recursive problem-solving

## Complexity Analysis Explained

Understanding how to calculate time and space complexity is crucial for evaluating algorithm performance. Let's break down each implementation step by step.

### Time Complexity Analysis

**Time complexity** measures how the runtime grows as the input size increases. We use Big O notation to express the worst-case scenario.

#### Implementation 1: Iterative Approach

```javascript
function sum_to_n_1(n) {
  let sum = 0; // O(1) - constant time assignment
  for (let i = 1; i <= n; i++) {
    // Loop runs n times
    sum += i; // O(1) - constant time operation
  }
  return sum; // O(1) - constant time return
}
```

**Analysis:**

- The `for` loop executes exactly `n` iterations (from 1 to n)
- Each iteration performs constant time operations: comparison (`i <= n`), addition (`sum += i`), increment (`i++`)
- Total operations: n × O(1) = **O(n)**

#### Implementation 2: Mathematical Formula

```javascript
function sum_to_n_2(n) {
  return (n * (n + 1)) / 2; // O(1) - single arithmetic calculation
}
```

**Analysis:**

- Only performs basic arithmetic operations: multiplication, addition, division
- These operations take constant time regardless of the value of n
- Whether n = 5 or n = 1,000,000, it's always 3 operations
- Total operations: **O(1)**

#### Implementation 3: Recursive Approach

```javascript
function sum_to_n_3(n) {
  if (n <= 1) {
    // O(1) - constant time comparison
    return n; // O(1) - constant time return
  }
  return n + sum_to_n_3(n - 1); // O(1) + T(n-1)
}
```

**Analysis using recurrence relation:**

- T(n) = T(n-1) + O(1) for n > 1
- T(1) = O(1) (base case)
- Expanding: T(n) = T(n-1) + c = T(n-2) + 2c = ... = T(1) + (n-1)c
- This gives us **O(n)** total function calls

### Space Complexity Analysis

**Space complexity** measures how much additional memory the algorithm uses as input size grows.

#### Implementation 1: Iterative Approach

```javascript
function sum_to_n_1(n) {
  let sum = 0; // Uses 1 variable
  for (let i = 1; i <= n; i++) {
    // Uses 1 more variable (i)
    sum += i;
  }
  return sum;
}
```

**Analysis:**

- Uses only 2 variables: `sum` and `i`
- Memory usage doesn't grow with input size n
- Space complexity: **O(1)** - constant space

#### Implementation 2: Mathematical Formula

```javascript
function sum_to_n_2(n) {
  return (n * (n + 1)) / 2; // No additional variables
}
```

**Analysis:**

- No additional variables created
- Only uses the input parameter and temporary calculation space
- Space complexity: **O(1)** - constant space

#### Implementation 3: Recursive Approach

```javascript
function sum_to_n_3(n) {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_3(n - 1); // Creates new stack frame
}
```

**Analysis:**

- Each recursive call creates a new stack frame
- For sum_to_n_3(5), the call stack looks like:
  ```
  sum_to_n_3(5)
  ├── sum_to_n_3(4)
  │   ├── sum_to_n_3(3)
  │   │   ├── sum_to_n_3(2)
  │   │   │   └── sum_to_n_3(1) → returns 1
  │   │   └── returns 2 + 1 = 3
  │   └── returns 3 + 3 = 6
  └── returns 4 + 6 = 10, then 5 + 10 = 15
  ```
- Maximum stack depth = n
- Space complexity: **O(n)** - linear space

### Big O Notation Quick Reference

| Notation   | Name        | Example                  | Performance |
| ---------- | ----------- | ------------------------ | ----------- |
| O(1)       | Constant    | Array access, arithmetic | Excellent   |
| O(log n)   | Logarithmic | Binary search            | Very Good   |
| O(n)       | Linear      | Single loop              | Good        |
| O(n log n) | Log-linear  | Merge sort               | Acceptable  |
| O(n²)      | Quadratic   | Nested loops             | Poor        |
| O(2ⁿ)      | Exponential | Recursive fibonacci      | Very Poor   |

### Practical Impact of Complexity

```javascript
// Performance comparison for different input sizes
const testSizes = [100, 1000, 10000, 100000];

testSizes.forEach((n) => {
  console.log(`\nFor n = ${n}:`);

  // O(1) - Always fast
  console.time("Mathematical O(1)");
  sum_to_n_2(n);
  console.timeEnd("Mathematical O(1)");

  // O(n) - Gets slower as n increases
  console.time("Iterative O(n)");
  sum_to_n_1(n);
  console.timeEnd("Iterative O(n)");

  // O(n) with function call overhead - Slowest
  if (n <= 10000) {
    // Avoid stack overflow
    console.time("Recursive O(n)");
    sum_to_n_3(n);
    console.timeEnd("Recursive O(n)");
  }
});
```

### Memory Usage Visualization

```javascript
// Demonstrating space complexity differences
function analyzeMemoryUsage() {
  const n = 1000;

  console.log("Memory usage analysis:");

  // O(1) space - uses same memory regardless of n
  console.log("Iterative: Uses ~8 bytes (2 variables) regardless of n");

  // O(1) space - minimal memory
  console.log("Mathematical: Uses ~0 bytes additional memory");

  // O(n) space - memory grows with n
  console.log(
    `Recursive: Uses ~${n * 64} bytes (${n} stack frames × ~64 bytes each)`
  );
}
```

## Performance Comparison

| Implementation | Time Complexity | Space Complexity | Best Use Case                              |
| -------------- | --------------- | ---------------- | ------------------------------------------ |
| Iterative      | O(n)            | O(1)             | Educational, small datasets, debugging     |
| Mathematical   | O(1)            | O(1)             | Production systems, large datasets, APIs   |
| Recursive      | O(n)            | O(n)             | Learning recursion, functional programming |

## Usage Examples

```javascript
console.log(sum_to_n_1(5)); // Output: 15
console.log(sum_to_n_2(5)); // Output: 15
console.log(sum_to_n_3(5)); // Output: 15

console.log(sum_to_n_1(10)); // Output: 55
console.log(sum_to_n_2(10)); // Output: 55
console.log(sum_to_n_3(10)); // Output: 55
```

## Test Cases

```javascript
// Test cases to verify all implementations
const testCases = [0, 1, 5, 10, 100];

testCases.forEach((n) => {
  const result1 = sum_to_n_1(n);
  const result2 = sum_to_n_2(n);
  const result3 = sum_to_n_3(n);

  console.log(`n=${n}: ${result1} ${result2} ${result3}`);
  console.assert(
    result1 === result2 && result2 === result3,
    `Mismatch for n=${n}`
  );
});
```

## Performance Benchmarking

```javascript
// Simple performance test
function benchmark() {
  const n = 10000;
  const iterations = 1000;

  console.time("Iterative");
  for (let i = 0; i < iterations; i++) {
    sum_to_n_1(n);
  }
  console.timeEnd("Iterative");

  console.time("Mathematical");
  for (let i = 0; i < iterations; i++) {
    sum_to_n_2(n);
  }
  console.timeEnd("Mathematical");

  console.time("Recursive");
  for (let i = 0; i < iterations; i++) {
    sum_to_n_3(n);
  }
  console.timeEnd("Recursive");
}

// Run benchmark
benchmark();
```

## Edge Cases to Consider

```javascript
// Edge case testing
console.log("Testing edge cases:");
console.log("n=0:", sum_to_n_2(0)); // Should return 0
console.log("n=1:", sum_to_n_2(1)); // Should return 1
console.log("n=-5:", sum_to_n_2(-5)); // Negative numbers
console.log("Large n:", sum_to_n_2(1000000)); // Large numbers

// For recursive version, be careful with large numbers
// sum_to_n_3(10000); // This might cause stack overflow!
```

## Recommendations

1. **For Production**: Use the mathematical formula (Implementation 2) for its optimal performance
2. **For Learning**: Start with the iterative approach (Implementation 1) to understand the problem
3. **For Interviews**: Know all three approaches and their trade-offs
4. **For Large Inputs**: Always use the mathematical formula to avoid performance issues
5. **For Negative Numbers**: Add input validation to handle edge cases appropriately
