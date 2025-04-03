import { NextResponse } from "next/server"
import { prisma, seedDatabase } from "@/lib/db"

export async function GET() {
  try {
    // Ensure database is seeded
    await seedDatabase()

    const companies = await prisma.company.findMany({
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
    })

    return NextResponse.json({
      success: true,
      data: companies,
    })
  } catch (error) {
    console.error("Failed to fetch companies:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies",
      },
      { status: 500 },
    )
  }
}

