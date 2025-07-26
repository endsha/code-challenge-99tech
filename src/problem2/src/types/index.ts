export interface Token {
  currency: string;
  date: string;
  price: number;
}

export interface TokenData {
  [key: string]: Token;
}

export interface SwapFormData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

export interface ValidationErrors {
  fromAmount?: string;
  toAmount?: string;
  general?: string;
}
