import { formatCurrency } from "@/lib/utils"

export default function WalletInfo({
  balance,
  change = null,
}: {
  balance: number
  change?: number | null
}) {
  return (
    <div className="p-5 bg-white rounded-lg border shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-1">Wallet Balance</h3>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>

        {change !== null && (
          <span className={`text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}
            {formatCurrency(change)}
          </span>
        )}
      </div>
    </div>
  )
}

