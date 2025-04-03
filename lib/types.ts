import type { Company, Trade, User } from "@prisma/client"

export type CompanyWithTrades = Company & {
  trades: Trade[]
}

export type TradeWithCompany = Trade & {
  company: Company
}

export type UserData = User

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type TradeOutcome = {
  isProfit: boolean
  profitLossAmount: number
  profitLossPercentage: number
}

