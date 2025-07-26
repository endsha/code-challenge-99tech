import LoadingSpinner from "./LoadingSpinner";

interface SwapButtonProps {
  loading: boolean;
  disabled: boolean;
}

const SwapButton = ({ loading, disabled }: SwapButtonProps) => {
  return (
    <button
      type="submit"
      className={`w-full gradient-button text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 ease-in-out flex items-center justify-center gap-3 text-lg shadow-xl ${
        disabled || loading
          ? "opacity-50 cursor-not-allowed bg-gradient-to-r from-neutral-300 to-neutral-400 text-gray-500"
          : "cursor-pointer hover:shadow-2xl hover:shadow-gray-300/25 active:scale-95 hover:-translate-y-1 pulse-glow"
      }`}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" />
          <span className="font-semibold">Processing Swap...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-bold">Swap Tokens</span>
        </>
      )}
    </button>
  );
};

export default SwapButton;
