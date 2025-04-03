import { PrismaClient } from "@prisma/client"
import { DEFAULT_COMPANIES, INITIAL_BALANCE } from "./constants"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}

export async function seedDatabase() {
  try {
    // Check if we already have companies
    const companyCount = await prisma.company.count()

    if (companyCount === 0) {
      console.log("Seeding database with initial data...")

      // Create default companies
      await Promise.all(
        DEFAULT_COMPANIES.map((company) =>
          prisma.company.create({
            data: {
              name: company.name,
              symbol: company.symbol,
              currentPrice: company.currentPrice,
              priceHistory: [company.currentPrice],
            },
          }),
        ),
      )

      // Create default user if not exists
      const user = await prisma.user.findUnique({
        where: { id: "single-user" },
      })

      if (!user) {
        await prisma.user.create({
          data: {
            id: "single-user",
            walletBalance: INITIAL_BALANCE,
          },
        })
      }

      console.log("Database seeded successfully!")
    }
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

