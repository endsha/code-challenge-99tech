import ProblemComponent from "./problem";
import AnswerComponent from "./answer";

function App() {
  return (
    <div className="app">
      <h1>Problem 3: Messy React - Demonstration</h1>

      <div className="section problem">
        <h2>❌ Original Problematic Code</h2>
        <p>
          <strong>Issues:</strong> Runtime errors, performance problems, type
          issues
        </p>
        <ProblemComponent />
      </div>

      <div className="section solution">
        <h2>✅ Refactored Solution</h2>
        <p>
          <strong>Improvements:</strong> Fixed errors, optimized performance,
          proper types
        </p>
        <AnswerComponent />
      </div>
    </div>
  );
}

export default App;
