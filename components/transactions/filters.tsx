"use client"

import { DateRangePicker } from "@/components/forms/date-range-picker"
import { ColumnSelector } from "@/components/transactions/fields-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionFilters } from "@/models/transactions"
import { Category, Field, Project } from "@/prisma/client"
import { format } from "date-fns"
import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function TransactionSearchAndFilters({
  categories,
  projects,
  fields,
  currentFilters,
}: {
  categories: Category[]
  projects: Project[]
  fields: Field[]
  currentFilters: TransactionFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentFilters.search || "")

  const applyFilters = (newFilters: Partial<TransactionFilters>) => {
    const params = new URLSearchParams()
    
    const finalFilters = { ...currentFilters, ...newFilters }
    
    if (finalFilters.search) params.set("search", finalFilters.search)
    if (finalFilters.dateFrom) params.set("dateFrom", finalFilters.dateFrom)
    if (finalFilters.dateTo) params.set("dateTo", finalFilters.dateTo)
    if (finalFilters.ordering) params.set("ordering", finalFilters.ordering)
    if (finalFilters.categoryCode && finalFilters.categoryCode !== "-") {
      params.set("categoryCode", finalFilters.categoryCode)
    }
    if (finalFilters.projectCode && finalFilters.projectCode !== "-") {
      params.set("projectCode", finalFilters.projectCode)
    }
    if (finalFilters.type) params.set("type", finalFilters.type)

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/transactions")
  }

  const isFiltered = Object.values(currentFilters).some((v) => v && v !== "-")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters({ search: searchInput || undefined })
              }
            }}
            className="w-full"
          />
        </div>

        <Select
          value={currentFilters.categoryCode || "-"}
          onValueChange={(value) =>
            applyFilters({ categoryCode: value === "-" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">All categories</SelectItem>
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

        {projects.length > 1 && (
          <Select
            value={currentFilters.projectCode || "-"}
            onValueChange={(value) =>
              applyFilters({ projectCode: value === "-" ? undefined : value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.code} value={project.code}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DateRangePicker
          defaultDate={{
            from: currentFilters.dateFrom
              ? new Date(currentFilters.dateFrom)
              : undefined,
            to: currentFilters.dateTo ? new Date(currentFilters.dateTo) : undefined,
          }}
          onChange={(date) => {
            applyFilters({
              dateFrom: date?.from
                ? format(date.from, "yyyy-MM-dd")
                : undefined,
              dateTo: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
            })
          }}
        />

        {isFiltered && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <ColumnSelector fields={fields} />
      </div>
    </div>
  )
}
