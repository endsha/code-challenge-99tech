// Demo script to run and compare both implementations
import { ProblematicWalletProcessor } from "./problem";
import { RefactoredWalletProcessor } from "./answer";

console.log("🚀 Problem 3: Messy React Code Analysis Demo");
console.log("=".repeat(60));

console.log("\\n📋 Running Problematic Implementation...");
console.log("-".repeat(40));
const problematicProcessor = new ProblematicWalletProcessor();
problematicProcessor.demonstrateIssues();

console.log("\\n\\n✨ Running Refactored Solution...");
console.log("-".repeat(40));
const refactoredProcessor = new RefactoredWalletProcessor();
refactoredProcessor.demonstrateImprovements();

console.log("\\n\\n📊 Performance Comparison");
console.log("-".repeat(40));

// Simple performance test
console.log("Running performance comparison...");

const iterations = 1000;

// Test problematic version (with error handling)
console.time("Problematic Implementation");
for (let i = 0; i < iterations; i++) {
  try {
    const problematic = new ProblematicWalletProcessor();
    problematic.processBalances(); // This will likely fail
  } catch (error) {
    // Ignore errors for performance test
  }
}
console.timeEnd("Problematic Implementation");

// Test refactored version
console.time("Refactored Implementation");
for (let i = 0; i < iterations; i++) {
  const refactored = new RefactoredWalletProcessor();
  refactored.processBalances();
}
console.timeEnd("Refactored Implementation");

console.log("\\n🎯 Summary of Key Issues Fixed:");
console.log("1. ❌ → ✅ Missing TypeScript interface properties");
console.log("2. ❌ → ✅ Variable reference errors");
console.log("3. ❌ → ✅ Incorrect filtering logic");
console.log("4. ❌ → ✅ Incomplete sorting function");
console.log("5. ❌ → ✅ Type inconsistencies");
console.log("6. ❌ → ✅ Missing error handling");
console.log("7. ❌ → ✅ Performance optimizations");
console.log("8. ❌ → ✅ Better key strategies");
console.log("9. ❌ → ✅ Proper memoization patterns");
