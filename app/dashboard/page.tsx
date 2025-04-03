import { prisma, seedDatabase } from "@/lib/db"
import CompanyCard from "@/components/CompanyCard"
import WalletInfo from "@/components/WalletInfo"
import TradeHistory from "@/components/TradeHistory"

export default async function DashboardPage() {
  // Ensure database is seeded
  await seedDatabase()

  // Fetch data in parallel
  const [companies, user] = await Promise.all([
    prisma.company.findMany({
      select: {
        id: true,
        name: true,
        symbol: true,
        currentPrice: true,
        priceHistory: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.user.findUnique({
      where: { id: "single-user" },
      select: {
        walletBalance: true,
      },
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Dashboard</h1>
        <p className="text-gray-600">Select a company to start trading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          <TradeHistory />
        </div>

        <div className="space-y-6">
          <WalletInfo balance={user?.walletBalance || 0} />

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Tips</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Start with small trades to learn the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Monitor price trends before making decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Diversify your trades across different companies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>Practice regularly to improve your skills</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

