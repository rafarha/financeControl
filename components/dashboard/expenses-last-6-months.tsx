"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { MonthlyExpensesData } from "@/models/stats"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ExpensesLast6MonthsProps {
  data: MonthlyExpensesData[]
}

export function ExpensesLast6Months({ data }: ExpensesLast6MonthsProps) {
  const currentMonth = data[data.length - 1]
  const previousMonth = data[data.length - 2]

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "up" : "neutral"
    const percentChange = ((current - previous) / previous) * 100
    if (percentChange > 0) return "up"
    if (percentChange < 0) return "down"
    return "neutral"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-red-600"
      case "down":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Expenses - Last 6 Months</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((monthData, index) => {
          const isCurrentMonth = index === data.length - 1
          const trend = isCurrentMonth && previousMonth ? getTrend(monthData.totalExpenses, previousMonth.totalExpenses) : "neutral"

          return (
            <Card
              key={`${monthData.year}-${monthData.month}`}
              className={`relative ${isCurrentMonth ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {monthData.monthName}
                  {isCurrentMonth && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </CardTitle>
                {isCurrentMonth && getTrendIcon(trend)}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getTrendColor(trend)}`}>
                  {formatCurrency(monthData.totalExpenses, monthData.currency)}
                </div>
                {isCurrentMonth && previousMonth && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {trend === "up" && `+${(((monthData.totalExpenses - previousMonth.totalExpenses) / previousMonth.totalExpenses) * 100).toFixed(1)}% from last month`}
                    {trend === "down" && `${(((monthData.totalExpenses - previousMonth.totalExpenses) / previousMonth.totalExpenses) * 100).toFixed(1)}% from last month`}
                    {trend === "neutral" && "Same as last month"}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
