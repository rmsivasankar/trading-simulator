"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import PriceChart from "./PriceChart"
import WalletInfo from "./WalletInfo"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export default function TradingPanel({
  company,
  walletBalance,
  onTrade,
}: {
  company: { id: string; name: string; symbol: string; currentPrice: number; priceHistory: number[] }
  walletBalance: number
  onTrade: (amount: number) => Promise<{
    success: boolean
    newBalance?: number
    isProfit?: boolean
    profitLossAmount?: number
  }>
}) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [isTrading, setIsTrading] = useState(false)
  const [tradeResult, setTradeResult] = useState<{
    newBalance: number
    isProfit: boolean
    profitLossAmount: number
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setTradeResult(null)

    const tradeAmount = Number.parseFloat(amount)
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (tradeAmount > walletBalance) {
      setError("Amount exceeds wallet balance")
      return
    }

    setIsTrading(true)
    try {
      const result = await onTrade(tradeAmount)
      if (result.success && result.newBalance !== undefined) {
        setAmount("")
        setTradeResult({
          newBalance: result.newBalance,
          isProfit: result.isProfit || false,
          profitLossAmount: result.profitLossAmount || 0,
        })
      } else {
        setError("Trade failed. Please try again.")
      }
    } catch (err) {
      setError("Trade failed. Please try again.")
    } finally {
      setIsTrading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
            <p className="text-gray-500">{company.symbol}</p>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(company.currentPrice)}</p>
          </div>
        </div>

        <PriceChart prices={company.priceHistory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WalletInfo
          balance={tradeResult ? tradeResult.newBalance : walletBalance}
          change={
            tradeResult ? (tradeResult.isProfit ? tradeResult.profitLossAmount : -tradeResult.profitLossAmount) : null
          }
        />

        {tradeResult && (
          <div
            className={`p-5 rounded-lg border shadow-sm ${tradeResult.isProfit ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <h3 className="font-semibold text-gray-700 mb-1">Trade Result</h3>
            <div className="flex items-center gap-2">
              {tradeResult.isProfit ? (
                <ArrowUp className="text-green-600 h-5 w-5" />
              ) : (
                <ArrowDown className="text-red-600 h-5 w-5" />
              )}
              <p className={`text-xl font-bold ${tradeResult.isProfit ? "text-green-600" : "text-red-600"}`}>
                {tradeResult.isProfit ? "+" : "-"}
                {formatCurrency(tradeResult.profitLossAmount)}
              </p>
              <p className={`text-sm ${tradeResult.isProfit ? "text-green-600" : "text-red-600"}`}>
                ({formatPercentage(tradeResult.profitLossAmount / (Number.parseFloat(amount) || 1))})
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Execute Trade</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to trade ({formatCurrency(0)})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.01"
                step="0.01"
                max={walletBalance}
                placeholder="Enter amount"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAmount(walletBalance.toString())}
              className="text-blue-600 text-sm hover:underline"
            >
              Use max balance
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isTrading}
            >
              {isTrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Execute Trade"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

