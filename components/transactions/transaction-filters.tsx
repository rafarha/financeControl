"use client"

import { Button } from "@/components/ui/button"
import { MultiCombobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
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
    categoryCodes: searchParams.getAll("categoryCode"),
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()

    const page = searchParams.get("page")
    if (page) params.set("page", page)

    filters.categoryCodes.forEach((code) => params.append("categoryCode", code))
    if (filters.startDate) params.set("startDate", filters.startDate)
    if (filters.endDate) params.set("endDate", filters.endDate)

    router.push(`/transactions?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      categoryCodes: [],
      startDate: "",
      endDate: "",
    })
    const params = new URLSearchParams()
    const page = searchParams.get("page")
    if (page) params.set("page", page)
    router.push(`/transactions?${params.toString()}`)
  }

  const hasFilters = filters.categoryCodes.length > 0 || filters.startDate || filters.endDate

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Categories</label>
        <MultiCombobox
          value={filters.categoryCodes}
          onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, categoryCodes: value }))
          }
          items={categories.map((c) => ({ code: c.code, name: c.name, color: c.color ?? undefined }))}
          placeholder="Select categories..."
          emptyMessage="No category found."
        />
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
