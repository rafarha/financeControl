import { TransactionFilters } from "@/models/transactions"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"

const filterKeys = ["search", "dateFrom", "dateTo", "ordering", "categoryCode", "projectCode"]

export function useTransactionFilters(defaultFilters?: TransactionFilters) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<TransactionFilters>({
    ...defaultFilters,
    ...searchParamsToFilters(searchParams),
  })

  useEffect(() => {
    const newSearchParams = filtersToSearchParams(filters, searchParams)
    // Avoid pushing a new URL when the search params already match the
    // computed params. This prevents update loops where changing filters
    // causes a router.push which updates searchParams and then resets
    // filters again.
    const newParamsString = newSearchParams.toString()
    const currentParamsString = searchParams ? searchParams.toString() : ""

    // Debug: log when effect runs and the computed/current params
    // eslint-disable-next-line no-console
    console.debug("useTransactionFilters: effect run", { filters, newParamsString, currentParamsString })

    if (newParamsString !== currentParamsString) {
      // Debounce rapid pushes to avoid a burst of navigations when multiple
      // filter updates happen in quick succession (e.g. while selecting a
      // date range). This prevents the "one request per day" symptom.
      const delay = 120
      const pending = (useTransactionFilters as any).__pendingPushRef as React.MutableRefObject<number | undefined>
      if (!pending) {
        ;(useTransactionFilters as any).__pendingPushRef = { current: undefined }
      }
      const ref = (useTransactionFilters as any).__pendingPushRef as React.MutableRefObject<number | undefined>
      if (ref.current) {
        window.clearTimeout(ref.current)
      }
      ref.current = window.setTimeout(() => {
        // eslint-disable-next-line no-console
        console.debug("useTransactionFilters: performing router.push", `?${newParamsString}`)
        router.push(`?${newParamsString}`)
        ref.current = undefined
      }, delay)
    }
  }, [filters])

  useEffect(() => {
    const parsed = searchParamsToFilters(searchParams)
    // Only update state when parsed filters differ from current filters to
    // avoid triggering the filters->URL effect again.
    const isEqual = (Object.keys(parsed) as Array<keyof TransactionFilters>).every((k) => {
      const a = (parsed as any)[k] || ""
      const b = (filters as any)[k] || ""
      return a === b
    })
    // Debug: log parsed/current and whether we'll setFilters
    // eslint-disable-next-line no-console
    console.debug("useTransactionFilters: searchParams changed", { parsed, filters, isEqual })
    if (!isEqual) {
      setFilters(parsed)
    }
  }, [searchParams])

  return [filters, setFilters] as const
}

export function searchParamsToFilters(searchParams: URLSearchParams) {
  return filterKeys.reduce((acc, filter) => {
    acc[filter] = searchParams.get(filter) || ""
    return acc
  }, {} as Record<string, string>) as TransactionFilters
}

export function filtersToSearchParams(
  filters: TransactionFilters,
  currentSearchParams?: URLSearchParams
): URLSearchParams {
  // Copy of all non-filter parameters back to the URL
  const searchParams = new URLSearchParams()
  if (currentSearchParams) {
    currentSearchParams.forEach((value, key) => {
      if (!filterKeys.includes(key)) {
        searchParams.set(key, value)
      }
    })
  }

  if (filters.search) {
    searchParams.set("search", filters.search)
  } else {
    searchParams.delete("search")
  }

  if (filters.dateFrom) {
    searchParams.set("dateFrom", format(new Date(filters.dateFrom), "yyyy-MM-dd"))
  } else {
    searchParams.delete("dateFrom")
  }

  if (filters.dateTo) {
    searchParams.set("dateTo", format(new Date(filters.dateTo), "yyyy-MM-dd"))
  } else {
    searchParams.delete("dateTo")
  }

  if (filters.ordering) {
    searchParams.set("ordering", filters.ordering)
  } else {
    searchParams.delete("ordering")
  }

  if (filters.categoryCode && filters.categoryCode !== "-") {
    searchParams.set("categoryCode", filters.categoryCode)
  } else {
    searchParams.delete("categoryCode")
  }

  if (filters.projectCode && filters.projectCode !== "-") {
    searchParams.set("projectCode", filters.projectCode)
  } else {
    searchParams.delete("projectCode")
  }

  return searchParams
}

export function isFiltered(filters: TransactionFilters) {
  return Object.values(filters).some((value) => value !== "" && value !== "-")
}
