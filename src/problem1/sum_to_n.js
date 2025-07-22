/**
 * Problem 1: Sum to N
 *
 * Provide 3 unique implementations of the following function in JavaScript.
 * Input: n - any integer
 * Output: summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 */

// Implementation 1: Iterative Approach
// Time Complexity: O(n), Space Complexity: O(1)
function sum_to_n_1(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Implementation 2: Mathematical Formula
// Time Complexity: O(1), Space Complexity: O(1)
function sum_to_n_2(n) {
  return (n * (n + 1)) / 2;
}

// Implementation 3: Recursive Approach
// Time Complexity: O(n), Space Complexity: O(n) due to call stack
function sum_to_n_3(n) {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_3(n - 1);
}

// Safe wrapper for recursive function with error handling
function sum_to_n_3_safe(n) {
  try {
    return sum_to_n_3(n);
  } catch (error) {
    if (
      error instanceof RangeError &&
      error.message.includes("Maximum call stack size exceeded")
    ) {
      console.error(
        `❌ Stack Overflow Error: n=${n} is too large for recursive approach`
      );
      console.error(
        `💡 Recommendation: Use sum_to_n_2(${n}) = ${sum_to_n_2(n)} instead`
      );
      return null;
    } else {
      throw error; // Re-throw if it's a different error
    }
  }
}

// Usage Examples
console.log("=== Usage Examples ===");
console.log("sum_to_n_1(5):", sum_to_n_1(5)); // Output: 15
console.log("sum_to_n_2(5):", sum_to_n_2(5)); // Output: 15
console.log("sum_to_n_3(5):", sum_to_n_3(5)); // Output: 15

console.log("sum_to_n_1(10):", sum_to_n_1(10)); // Output: 55
console.log("sum_to_n_2(10):", sum_to_n_2(10)); // Output: 55
console.log("sum_to_n_3(10):", sum_to_n_3(10)); // Output: 55

// Test Cases
console.log("\n=== Test Cases ===");
const testCases = [0, 1, 5, 10, 100];

testCases.forEach((n) => {
  const result1 = sum_to_n_1(n);
  const result2 = sum_to_n_2(n);

  // Use safe wrapper for recursive function
  let result3;
  if (n <= 5000) {
    // Safe limit for most systems
    result3 = sum_to_n_3(n);
  } else {
    console.log(
      `⚠️  Skipping recursive test for n=${n} (too large, would cause stack overflow)`
    );
    result3 = sum_to_n_2(n); // Use mathematical result for comparison
  }

  console.log(`n=${n}: ${result1} ${result2} ${result3}`);
  console.assert(
    result1 === result2 && result2 === result3,
    `Mismatch for n=${n}`
  );
});

// Performance Benchmarking
console.log("\n=== Performance Benchmarking ===");
function benchmark() {
  const n = 1000; // Reduced to avoid stack overflow
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

  console.time("Recursive (safe)");
  for (let i = 0; i < iterations; i++) {
    sum_to_n_3_safe(n);
  }
  console.timeEnd("Recursive (safe)");
}

// Run benchmark
benchmark();

// Practical Impact of Complexity
console.log("\n=== Performance Comparison for Different Input Sizes ===");
const testSizes = [100, 1000, 5000]; // Reduced max size for recursive safety

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

  // O(n) with function call overhead - Use safe wrapper
  console.time("Recursive O(n) - Safe");
  const recursiveResult = sum_to_n_3_safe(n);
  console.timeEnd("Recursive O(n) - Safe");

  if (recursiveResult === null) {
    console.log(
      `📊 Result comparison: Mathematical=${sum_to_n_2(
        n
      )}, Iterative=${sum_to_n_1(n)}, Recursive=OVERFLOW`
    );
  } else {
    console.log(`📊 Result: ${recursiveResult}`);
  }
});

// Memory Usage Analysis
console.log("\n=== Memory Usage Analysis ===");
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

analyzeMemoryUsage();

// Edge Cases Testing
console.log("\n=== Edge Cases Testing ===");
console.log("Testing edge cases:");
console.log("n=0:", sum_to_n_2(0)); // Should return 0
console.log("n=1:", sum_to_n_2(1)); // Should return 1
console.log("n=-5:", sum_to_n_2(-5)); // Negative numbers
console.log("Large n:", sum_to_n_2(1000000)); // Large numbers

// Stack Overflow Demonstration
console.log("\n=== Stack Overflow Demonstration ===");
console.log("Testing recursive function with progressively larger values:");

const testValues = [1000, 5000, 10000, 15000];
testValues.forEach((testN) => {
  console.log(`\nTesting with n=${testN}:`);
  const safeResult = sum_to_n_3_safe(testN);
  if (safeResult !== null) {
    console.log(`✅ Success: ${safeResult}`);
  } else {
    console.log(`❌ Stack overflow occurred`);
  }
});

console.log("\n🔬 Direct stack overflow test (controlled):");
try {
  console.log("Attempting sum_to_n_3(20000)...");
  const result = sum_to_n_3(20000);
  console.log("Surprisingly succeeded:", result);
} catch (error) {
  console.log("🚨 Expected Error:", error.name);
  console.log("📝 Error Message:", error.message);
  console.log("💡 Solution: Use sum_to_n_2(20000) =", sum_to_n_2(20000));
}

// Export functions for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    sum_to_n_1,
    sum_to_n_2,
    sum_to_n_3,
    sum_to_n_3_safe,
  };
}

console.log("\n✅ All demonstrations completed!");
console.log("\n📝 Key Takeaways:");
console.log(
  "1. Mathematical formula (O(1)) is fastest and safest for all input sizes"
);
console.log("2. Iterative approach (O(n)) is reliable and memory-efficient");
console.log(
  "3. Recursive approach (O(n) time, O(n) space) has stack overflow risk"
);
console.log("4. Always use try-catch when working with recursive functions");
console.log("5. For production: choose mathematical formula");
console.log(
  "6. For learning: start with iterative, understand recursive limitations"
);
