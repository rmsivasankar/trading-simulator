import Link from "next/link"
import { ArrowDown, ArrowUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function CompanyCard({
  company,
}: {
  company: {
    id: string
    name: string
    symbol: string
    currentPrice: number
    priceHistory: number[]
  }
}) {
  // Calculate price change
  const previousPrice =
    company.priceHistory.length > 1 ? company.priceHistory[company.priceHistory.length - 2] : company.currentPrice

  const priceChange = company.currentPrice - previousPrice
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0

  const isPositive = priceChange >= 0

  return (
    <Link
      href={`/dashboard/${company.id}`}
      className="block bg-white border rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{company.name}</h3>
            <p className="text-gray-500 text-sm">{company.symbol}</p>
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(priceChangePercent).toFixed(2)}%
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(company.currentPrice)}</p>
          <p className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}
            {formatCurrency(priceChange)}
          </p>
        </div>
      </div>
    </Link>
  )
}

