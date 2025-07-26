import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface TokenSelectionContextType {
  selectedFromToken: string;
  selectedToToken: string;
  setSelectedFromToken: (token: string) => void;
  setSelectedToToken: (token: string) => void;
  swapTokenSelections: () => void;
  initializeTokens: (availableTokens: string[]) => void;
}

const TokenSelectionContext = createContext<
  TokenSelectionContextType | undefined
>(undefined);

interface TokenSelectionProviderProps {
  children: ReactNode;
}

export const TokenSelectionProvider: React.FC<TokenSelectionProviderProps> = ({
  children,
}) => {
  const [selectedFromToken, setSelectedFromToken] = useState<string>("");
  const [selectedToToken, setSelectedToToken] = useState<string>("");

  // Initialize tokens when available tokens are provided
  const initializeTokens = (availableTokens: string[]) => {
    if (availableTokens.length >= 2 && !selectedFromToken && !selectedToToken) {
      setSelectedFromToken(availableTokens[0]);
      setSelectedToToken(availableTokens[1]);
    }
  };

  // Function to swap the selected tokens
  const swapTokenSelections = () => {
    const tempFromToken = selectedFromToken;
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(tempFromToken);
  };

  // Load persisted selections from localStorage on mount
  useEffect(() => {
    const savedFromToken = localStorage.getItem("selectedFromToken");
    const savedToToken = localStorage.getItem("selectedToToken");

    if (savedFromToken) {
      setSelectedFromToken(savedFromToken);
    }
    if (savedToToken) {
      setSelectedToToken(savedToToken);
    }
  }, []);

  // Persist selections to localStorage when they change
  useEffect(() => {
    if (selectedFromToken) {
      localStorage.setItem("selectedFromToken", selectedFromToken);
    }
  }, [selectedFromToken]);

  useEffect(() => {
    if (selectedToToken) {
      localStorage.setItem("selectedToToken", selectedToToken);
    }
  }, [selectedToToken]);

  const value: TokenSelectionContextType = {
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    swapTokenSelections,
    initializeTokens,
  };

  return (
    <TokenSelectionContext.Provider value={value}>
      {children}
    </TokenSelectionContext.Provider>
  );
};

export const useTokenSelection = (): TokenSelectionContextType => {
  const context = useContext(TokenSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useTokenSelection must be used within a TokenSelectionProvider"
    );
  }
  return context;
};
