import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trading Simulator",
  description: "Virtual trading platform for learning and practice",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t py-6">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Trading Simulator. All rights reserved.
              <p className="mt-1">This is a simulation platform. No real money is involved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

