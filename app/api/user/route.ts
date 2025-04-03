import { NextResponse } from "next/server"
import { prisma, seedDatabase } from "@/lib/db"

export async function GET() {
  try {
    // Ensure database is seeded
    await seedDatabase()

    let user = await prisma.user.findUnique({
      where: { id: "single-user" },
    })

    if (!user) {
      // This should not happen after seeding, but just in case
      user = await prisma.user.create({
        data: {
          id: "single-user",
          walletBalance: 5000,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { walletBalance } = body

    if (walletBalance === undefined || isNaN(walletBalance) || walletBalance < 0) {
      return NextResponse.json({ success: false, error: "Valid wallet balance is required" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: "single-user" },
      data: { walletBalance },
    })

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user",
      },
      { status: 500 },
    )
  }
}

