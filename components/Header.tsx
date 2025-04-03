import Link from "next/link"
import { Home } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1 rounded">TS</span>
          Trading Simulator
        </Link>

        <nav>
          <Link href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}

