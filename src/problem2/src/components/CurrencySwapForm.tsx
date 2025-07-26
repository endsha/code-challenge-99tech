import { useState, useEffect, useCallback } from "react";
import type { SwapFormData, ValidationErrors } from "../types";
import {
  useAvailableTokens,
  calculateExchangeRate,
  convertAmount,
  useAccountBalances,
  getTokenBalance,
  formatBalance,
  useSwapMutation,
  type SwapTransaction,
} from "../services/tokenService";
import { useToast } from "../contexts/ToastContext";
import { useTokenSelection } from "../contexts/TokenSelectionContext";
import TokenSelector from "./TokenSelector";
import SwapInput from "./SwapInput";
import SwapButton from "./SwapButton";
import LoadingSpinner from "./LoadingSpinner";

const CurrencySwapForm = () => {
  const {
    availableTokens,
    tokenPrices,
    isLoading,
    error: queryError,
  } = useAvailableTokens();

  const {
    data: accountBalances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useAccountBalances();

  const swapMutation = useSwapMutation();

  const {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    swapTokenSelections,
    initializeTokens,
  } = useTokenSelection();

  const { addToast } = useToast();

  const [swapping, setSwapping] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: selectedFromToken,
    toToken: selectedToToken,
    fromAmount: "",
    toAmount: "",
  });

  // Set default tokens when available tokens are loaded
  useEffect(() => {
    if (availableTokens.length >= 2) {
      // Initialize tokens in context if not already set
      initializeTokens(availableTokens);

      // Update formData with context values
      setFormData((prev) => ({
        ...prev,
        fromToken: selectedFromToken || availableTokens[0],
        toToken: selectedToToken || availableTokens[1],
      }));
    }
  }, [availableTokens, selectedFromToken, selectedToToken, initializeTokens]);

  // Handle query error
  useEffect(() => {
    if (queryError || balancesError) {
      setErrors({
        general: "Failed to load market data. Please try again.",
      });
    } else {
      setErrors({});
    }
  }, [queryError, balancesError]);

  // Calculate exchange rate and update toAmount when fromAmount or tokens change
  const updateExchangeRate = useCallback(() => {
    if (
      !formData.fromToken ||
      !formData.toToken ||
      !formData.fromAmount ||
      !tokenPrices ||
      !tokenPrices[formData.fromToken] ||
      !tokenPrices[formData.toToken]
    ) {
      setFormData((prev) => ({ ...prev, toAmount: "" }));
      return;
    }

    const fromAmount = parseFloat(formData.fromAmount);
    if (isNaN(fromAmount) || fromAmount <= 0) {
      setFormData((prev) => ({ ...prev, toAmount: "" }));
      return;
    }

    const exchangeRate = calculateExchangeRate(
      formData.fromToken,
      formData.toToken,
      tokenPrices
    );

    if (exchangeRate > 0) {
      const toAmount = convertAmount(fromAmount, exchangeRate);
      setFormData((prev) => ({ ...prev, toAmount: toAmount.toFixed(6) }));
    }
  }, [formData.fromToken, formData.toToken, formData.fromAmount, tokenPrices]);

  useEffect(() => {
    updateExchangeRate();
  }, [updateExchangeRate]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fromAmount || parseFloat(formData.fromAmount) <= 0) {
      newErrors.fromAmount = "Please enter a valid amount";
      addToast({
        type: "warning",
        title: "Invalid Amount",
        message: "Please enter a valid amount to swap",
        duration: 4000,
      });
    }

    // Check for sufficient balance
    if (formData.fromAmount && formData.fromToken && accountBalances) {
      const fromAmount = parseFloat(formData.fromAmount);
      const balance = getTokenBalance(formData.fromToken, accountBalances);

      if (fromAmount > balance) {
        newErrors.fromAmount = `Insufficient balance. Available: ${formatBalance(
          balance
        )}`;
        addToast({
          type: "warning",
          title: "Insufficient Balance",
          message: `You only have ${formatBalance(balance)} ${
            formData.fromToken
          } available`,
          duration: 4000,
        });
      }
    }

    if (!formData.fromToken) {
      newErrors.general = "Please select a token to swap from";
      addToast({
        type: "warning",
        title: "Missing Token",
        message: "Please select a token to swap from",
        duration: 4000,
      });
    }

    if (!formData.toToken) {
      newErrors.general = "Please select a token to swap to";
      addToast({
        type: "warning",
        title: "Missing Token",
        message: "Please select a token to swap to",
        duration: 4000,
      });
    }

    if (formData.fromToken === formData.toToken) {
      newErrors.general = "Cannot swap the same token";
      addToast({
        type: "warning",
        title: "Invalid Swap",
        message: "Cannot swap the same token. Please select different tokens",
        duration: 4000,
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFromAmountChange = (value: string) => {
    setFormData((prev) => ({ ...prev, fromAmount: value }));
    setErrors((prev) => ({ ...prev, fromAmount: undefined }));
  };

  const handleMaxClick = () => {
    if (formData.fromToken && accountBalances) {
      const balance = getTokenBalance(formData.fromToken, accountBalances);
      setFormData((prev) => ({ ...prev, fromAmount: balance.toString() }));
      setErrors((prev) => ({ ...prev, fromAmount: undefined }));
    }
  };

  const handleTokenChange = (type: "from" | "to", token: string) => {
    if (type === "from") {
      setSelectedFromToken(token);
      setFormData((prev) => ({ ...prev, fromToken: token }));
    } else {
      setSelectedToToken(token);
      setFormData((prev) => ({ ...prev, toToken: token }));
    }
    setErrors((prev) => ({ ...prev, general: undefined }));
  };

  const handleSwapTokens = () => {
    // Swap tokens in context
    swapTokenSelections();

    // Update form data with swapped values
    setFormData((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSwapping(true);

    try {
      // Create swap transaction
      const swapTransaction: SwapTransaction = {
        fromToken: formData.fromToken,
        toToken: formData.toToken,
        fromAmount: parseFloat(formData.fromAmount),
        toAmount: parseFloat(formData.toAmount),
      };

      // Execute the swap using the mutation
      await swapMutation.mutateAsync(swapTransaction);

      // Show success toast
      addToast({
        type: "success",
        title: "Swap Successful!",
        message: `Successfully swapped ${formData.fromAmount} ${formData.fromToken} for ${formData.toAmount} ${formData.toToken}`,
        duration: 6000,
      });

      // Reset form amounts but keep selected tokens
      setFormData((prev) => ({
        ...prev,
        fromAmount: "",
        toAmount: "",
      }));
    } catch (error) {
      addToast({
        type: "error",
        title: "Swap Failed",
        message: "Something went wrong. Please try again.",
        duration: 5000,
      });
      setErrors({ general: "Swap failed. Please try again." });
    } finally {
      setSwapping(false);
    }
  };

  return (
    <div className="w-full relative p-8">
      {/* Loading overlay */}
      <div
        style={{
          opacity: isLoading || balancesLoading ? 1 : 0,
          zIndex: isLoading || balancesLoading ? 100 : -1,
        }}
        className="w-full h-full absolute inset-0 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 bg-white"
      >
        <LoadingSpinner />
        <p className="text-black text-sm font-medium mt-4">
          Loading market data...
        </p>
      </div>
      <div
        style={{
          opacity: isLoading || balancesLoading ? 0 : 1,
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black">Swap Tokens</h2>
            <p className="text-sm text-black mt-1">
              Trade tokens in an instant
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Token Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">From</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-black font-medium">
                  Balance:{" "}
                  {formData.fromToken
                    ? formatBalance(
                        getTokenBalance(formData.fromToken, accountBalances)
                      )
                    : "0.00"}
                </span>
                {formData.fromToken &&
                  accountBalances &&
                  getTokenBalance(formData.fromToken, accountBalances) > 0 && (
                    <button
                      type="button"
                      onClick={handleMaxClick}
                      disabled={swapping || swapMutation.isPending}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      MAX
                    </button>
                  )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-300 rounded-2xl transition-all duration-300 ease-in-out  hover:shadow-lg backdrop-blur-sm">
              <div className="relative flex items-center justify-between gap-2">
                <SwapInput
                  id="from-amount"
                  value={formData.fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.00"
                  error={errors.fromAmount}
                />
                <TokenSelector
                  selectedToken={formData.fromToken}
                  availableTokens={availableTokens}
                  onChange={(token) => handleTokenChange("from", token)}
                  disabled={swapping || swapMutation.isPending}
                />
              </div>
              {errors.fromAmount && (
                <p className="text-red-500 text-xs mt-3 flex items-center transition-all duration-300 bg-red-50 px-3 py-2 rounded-xl">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.fromAmount}
                </p>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              className="cursor-pointer bg-gradient-to-br from-white to-neutral-50 border-4 border-white rounded-full w-14 h-14 flex items-center justify-center text-black hover:text-gray-500 transition-all duration-300 ease-in-out hover:scale-110 hover:border-gray-200 hover:shadow-xl group"
              onClick={handleSwapTokens}
              disabled={swapping || swapMutation.isPending}
            >
              <svg
                className="w-6 h-6 transition-transform duration-500 ease-in-out group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Token Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-black">To</label>
              <span className="text-xs text-black font-medium">
                Balance:{" "}
                {formData.toToken
                  ? formatBalance(
                      getTokenBalance(formData.toToken, accountBalances)
                    )
                  : "0.00"}
              </span>
            </div>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-300 rounded-2xl transition-all duration-300 ease-in-out backdrop-blur-sm hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <SwapInput
                  id="to-amount"
                  value={formData.toAmount}
                  onChange={() => {}} // Read-only
                  placeholder="0.00"
                  readOnly
                />
                <TokenSelector
                  selectedToken={formData.toToken}
                  availableTokens={availableTokens}
                  onChange={(token) => handleTokenChange("to", token)}
                  disabled={swapping || swapMutation.isPending}
                />
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {formData.fromToken &&
            formData.toToken &&
            tokenPrices &&
            tokenPrices[formData.fromToken] &&
            tokenPrices[formData.toToken] && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl p-4 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black font-medium">Exchange Rate</span>
                  <span className="text-black font-bold">
                    1 {formData.fromToken} ={" "}
                    {calculateExchangeRate(
                      formData.fromToken,
                      formData.toToken,
                      tokenPrices
                    ).toFixed(6)}{" "}
                    {formData.toToken}
                  </span>
                </div>
              </div>
            )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-red-600 text-sm font-medium">
                  {errors.general}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <SwapButton
            loading={swapping || swapMutation.isPending}
            disabled={!formData.fromAmount || !formData.toAmount}
          />
        </form>
      </div>
    </div>
  );
};

export default CurrencySwapForm;
