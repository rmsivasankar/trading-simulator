"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { ArrowDown, ArrowUp, Clock } from "lucide-react"
import type { TradeWithCompany } from "@/lib/types"

export default function TradeHistory() {
  const [trades, setTrades] = useState<TradeWithCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch("/api/trades")
        const data = await response.json()

        if (data.success && data.data) {
          setTrades(data.data)
        } else {
          setError("Failed to load trade history")
        }
      } catch (err) {
        setError("Failed to load trade history")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading trade history...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
        <div className="text-gray-500 text-center py-8">
          <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No trades yet. Start trading to see your history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-500">Company</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Price</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Result</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice(0, 5).map((trade) => (
              <tr key={trade.id} className="border-b last:border-0">
                <td className="py-3 px-2">
                  <div>
                    <p className="font-medium text-gray-900">{trade.company.name}</p>
                    <p className="text-xs text-gray-500">{trade.company.symbol}</p>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-medium text-gray-900">{formatCurrency(trade.amount)}</td>
                <td className="py-3 px-2 text-right text-gray-700">{formatCurrency(trade.priceAtTrade)}</td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {trade.isProfit ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-medium ${trade.isProfit ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(trade.profitLossAmount)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-500">
                  {new Date(trade.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

