import { getTokenIconUrl } from "../services/tokenService";

interface TokenSelectorProps {
  selectedToken: string;
  availableTokens: string[];
  onChange: (token: string) => void;
  disabled?: boolean;
}

const TokenSelector = ({
  selectedToken,
  availableTokens,
  onChange,
  disabled = false,
}: TokenSelectorProps) => {
  return (
    <div className="relative">
      <select
        value={selectedToken}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`appearance-none bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-300/50 rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-black cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 min-w-[140px] shadow-lg ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gradient-to-br hover:from-neutral-200 hover:to-neutral-300 hover:border-gray-400/50 hover:shadow-xl"
        }`}
      >
        <option value="" className="bg-white">
          Select a token
        </option>
        {availableTokens.map((token) => (
          <option key={token} value={token} className="bg-white">
            {token}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-black transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {selectedToken && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg transition-all duration-300 ease-in-out">
          <img
            src={getTokenIconUrl(selectedToken)}
            alt={selectedToken}
            width={32}
            height={32}
            className="w-full h-full object-cover transition-all duration-300 ease-in-out"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = "none";
            }}
            onLoad={(e) => {
              // Show image if it loads successfully
              (e.target as HTMLImageElement).style.display = "block";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
