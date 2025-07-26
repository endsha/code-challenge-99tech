import CurrencySwapForm from "./components/CurrencySwapForm";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="h-screen modern-gradient-bg transition-all duration-500 ease-in-out relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-secondary-400/10 to-accent-400/10 rounded-full blur-3xl"></div>
          </div>

          {/* Main Content */}
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-full max-w-lg">
                {/* Main Swap Card */}
                <div className="crypto-card rounded-3xl p-8 transition-all duration-500 ease-in-out hover:shadow-2xl float-animation">
                  <CurrencySwapForm />
                </div>
              </div>
            </div>
          </main>

          {/* Toast Container */}
          <ToastContainer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
