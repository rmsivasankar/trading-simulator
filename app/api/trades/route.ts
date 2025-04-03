import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { calculateTradeOutcome, getRandomPriceChange } from "@/lib/utils"

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: trades,
    })
  } catch (error) {
    console.error("Failed to fetch trades:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trades",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, amount } = body

    if (!companyId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Valid company ID and amount are required" }, { status: 400 })
    }

    // Get company and user data
    const [company, user] = await Promise.all([
      prisma.company.findUnique({
        where: { id: companyId },
      }),
      prisma.user.findUnique({
        where: { id: "single-user" },
      }),
    ])

    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if user has enough balance
    if (user.walletBalance < amount) {
      return NextResponse.json({ success: false, error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Calculate trade outcome
    const { isProfit, profitLossAmount } = calculateTradeOutcome(amount)

    // Calculate new price
    const newPrice = getRandomPriceChange(company.currentPrice)

    // Prepare updated price history
    const priceHistory = Array.isArray(company.priceHistory)
      ? [...company.priceHistory, newPrice]
      : [company.currentPrice, newPrice]

    // Calculate new wallet balance
    const walletBalanceChange = isProfit ? profitLossAmount : -profitLossAmount
    const newWalletBalance = user.walletBalance + walletBalanceChange

    // Execute transaction
    const [updatedCompany, trade, updatedUser] = await prisma.$transaction([
      // Update company price and history
      prisma.company.update({
        where: { id: companyId },
        data: {
          currentPrice: newPrice,
          priceHistory: priceHistory,
        },
      }),

      // Create trade record
      prisma.trade.create({
        data: {
          companyId,
          amount,
          priceAtTrade: company.currentPrice,
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

    return NextResponse.json({
      success: true,
      data: {
        trade,
        newPrice,
        newWalletBalance,
        isProfit,
        profitLossAmount,
      },
    })
  } catch (error) {
    console.error("Failed to process trade:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process trade",
      },
      { status: 500 },
    )
  }
}

