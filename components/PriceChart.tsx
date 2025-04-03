"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import { CHART_COLORS } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"
import type { Chart as ChartType } from "chart.js"

export default function PriceChart({
  prices,
  isLoading = false,
}: {
  prices: number[]
  isLoading?: boolean
}) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<ChartType | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (chartRef.current && prices.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        setIsAnimating(true)

        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: prices.map((_, i) => `Day ${i + 1}`),
            datasets: [
              {
                label: "Price History",
                data: prices,
                borderColor: CHART_COLORS.primary,
                backgroundColor: `${CHART_COLORS.primary}20`,
                tension: 0.3,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: CHART_COLORS.primary,
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              onComplete: () => {
                setIsAnimating(false)
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#000",
                bodyColor: "#000",
                borderColor: CHART_COLORS.grid,
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: (context) => {
                    return formatCurrency(context.parsed.y)
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: CHART_COLORS.grid,
                  borderColor: CHART_COLORS.grid,
                  display: true,
                },
                ticks: {
                  color: CHART_COLORS.text,
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 5,
                },
              },
              y: {
                grid: {
                  color: CHART_COLORS.grid,
                  borderColor: CHART_COLORS.grid,
                  display: true,
                },
                ticks: {
                  color: CHART_COLORS.text,
                  callback: (value) => formatCurrency(value as number),
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [prices])

  if (isLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className="relative h-64 w-full">
      <canvas ref={chartRef} className="w-full h-full" />
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="animate-pulse text-gray-500">Updating chart...</div>
        </div>
      )}
    </div>
  )
}

