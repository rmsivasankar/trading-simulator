import { notFound } from "next/navigation"
import TradingPanel from "@/components/TradingPanel"
import { prisma, seedDatabase } from "@/lib/db"
import { calculateTradeOutcome, getRandomPriceChange } from "@/lib/utils"

export default async function CompanyPage({
  params,
}: {
  params: { companyId: string }
}) {
  // Ensure database is seeded
  await seedDatabase()

  // Validate companyId exists
  if (!params?.companyId) return notFound()

  // Fetch data in parallel
  const [company, user] = await Promise.all([
    prisma.company.findUnique({
      where: { id: params.companyId },
      select: {
        id: true,
        name: true,
        symbol: true,
        currentPrice: true,
        priceHistory: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: "single-user" },
      select: {
        walletBalance: true,
      },
    }),
  ])

  if (!company || !user) return notFound()

  // Handle priceHistory safely
  const priceHistory =
    Array.isArray(company.priceHistory) && company.priceHistory.length > 0
      ? company.priceHistory
      : [company.currentPrice]

  // Server Action for trading
  const handleTrade = async (amount: number) => {
    "use server"

    try {
      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "Invalid amount" }
      }

      // Get fresh company and user data
      const [currentCompany, currentUser] = await Promise.all([
        prisma.company.findUniqueOrThrow({
          where: { id: params.companyId },
        }),
        prisma.user.findUniqueOrThrow({
          where: { id: "single-user" },
        }),
      ])

      // Check if user has enough balance
      if (currentUser.walletBalance < amount) {
        return { success: false, error: "Insufficient balance" }
      }

      // Calculate trade outcome
      const { isProfit, profitLossAmount } = calculateTradeOutcome(amount)

      // Calculate new price
      const newPrice = getRandomPriceChange(currentCompany.currentPrice)

      // Prepare updated price history
      const currentPriceArray =
        Array.isArray(currentCompany.priceHistory) && currentCompany.priceHistory.length > 0
          ? currentCompany.priceHistory
          : [currentCompany.currentPrice]

      const updatedPriceHistory = [...currentPriceArray, newPrice].slice(-20) // Keep last 20 prices

      // Calculate new wallet balance
      const walletBalanceChange = isProfit ? profitLossAmount : -profitLossAmount
      const newWalletBalance = currentUser.walletBalance + walletBalanceChange

      // Execute transaction
      const [updatedCompany, trade, updatedUser] = await prisma.$transaction([
        // Update company price and history
        prisma.company.update({
          where: { id: params.companyId },
          data: {
            currentPrice: newPrice,
            priceHistory: updatedPriceHistory,
          },
        }),

        // Create trade record
        prisma.trade.create({
          data: {
            companyId: params.companyId,
            amount,
            priceAtTrade: currentCompany.currentPrice,
            isProfit,
            profitLossAmount,
          },
        }),

        // Update user wallet
        prisma.user.update({
          where: { id: "single-user" },
          data: {
            walletBalance: newWalletBalance,
          },
        }),
      ])

      return {
        success: true,
        newBalance: newWalletBalance,
        isProfit,
        profitLossAmount,
      }
    } catch (error) {
      console.error("Trade processing failed:", error)
      return { success: false, error: "Trade processing failed" }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TradingPanel
        company={{
          id: company.id,
          name: company.name,
          symbol: company.symbol,
          currentPrice: company.currentPrice,
          priceHistory: priceHistory,
        }}
        walletBalance={user.walletBalance}
        onTrade={handleTrade}
      />
    </div>
  )
}

