"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "@/prisma/client"
import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface TransactionFiltersProps {
  categories: Category[]
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    categoryCode: searchParams.get("categoryCode") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()

    // Preserve page parameter
    const page = searchParams.get("page")
    if (page) params.set("page", page)

    if (filters.categoryCode) params.set("categoryCode", filters.categoryCode)
    if (filters.startDate) params.set("startDate", filters.startDate)
    if (filters.endDate) params.set("endDate", filters.endDate)

    router.push(`/transactions?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      categoryCode: "",
      startDate: "",
      endDate: "",
    })
    const params = new URLSearchParams()
    const page = searchParams.get("page")
    if (page) params.set("page", page)
    router.push(`/transactions?${params.toString()}`)
  }

  const hasFilters = filters.categoryCode || filters.startDate || filters.endDate

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select
          value={filters.categoryCode || "all"}
          onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, categoryCode: value === "all" ? "" : value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.code} value={category.code}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-medium mb-2 block">Start Date</label>
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-medium mb-2 block">End Date</label>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
