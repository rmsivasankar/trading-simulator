import Link from "next/link"
import { ArrowRight, BarChart3, DollarSign, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Trading Simulator</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Practice trading with virtual currency in a risk-free environment. Learn the basics of trading without risking
          real money.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium flex items-center gap-2 shadow-lg"
        >
          Start Trading
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Choose Companies</h3>
              <p className="text-gray-600">
                Browse our selection of virtual companies and view their current prices and trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Execute Trades</h3>
              <p className="text-gray-600">
                Use your virtual wallet to execute trades and test different trading strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Track Performance</h3>
              <p className="text-gray-600">
                Monitor your profits and losses in real-time and learn from your trading decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

