import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getRandomPriceChange(basePrice: number, volatility = 0.05): number {
  const changePercent = (Math.random() - 0.5) * 2 * volatility
  return Number.parseFloat((basePrice * (1 + changePercent)).toFixed(2))
}

export function calculateTradeOutcome(amount: number): {
  isProfit: boolean
  profitLossAmount: number
  profitLossPercentage: number
} {
  const isProfit = Math.random() > 0.5
  const profitLossPercentage = Math.random() * 0.1 // 0-10% profit/loss
  const profitLossAmount = Number.parseFloat((amount * profitLossPercentage).toFixed(2))

  return {
    isProfit,
    profitLossAmount,
    profitLossPercentage,
  }
}

