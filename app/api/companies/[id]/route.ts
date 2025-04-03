import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const companyId = params.id

    if (!companyId) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 400 })
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        symbol: true,
        currentPrice: true,
        priceHistory: true,
      },
    })

    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error("Failed to fetch company:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch company",
      },
      { status: 500 },
    )
  }
}

