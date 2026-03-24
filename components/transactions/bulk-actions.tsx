"use client"

import { bulkDeleteTransactionsAction } from "@/app/(app)/transactions/actions"
import { Button } from "@/components/ui/button"
import { Trash2, Copy } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ClientNewTransactionDialog from "@/components/transactions/client-new"

// Types for props we'll accept from page
import { Category, Currency, Project } from "@/prisma/client"

interface BulkActionsMenuProps {
  selectedIds: string[]
  onActionComplete?: () => void
  // optional collections so the client dialog can be opened inline
  categories?: Category[]
  currencies?: Currency[]
  projects?: Project[]
  settings?: Record<string, string>
}

export function BulkActionsMenu({ selectedIds, onActionComplete, categories = [], currencies = [], projects = [], settings = {} }: BulkActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [initialValues, setInitialValues] = useState<any | undefined>(undefined)

  const handleDelete = async () => {
    const confirmMessage =
      "Are you sure you want to delete these transactions and all their files? This action cannot be undone."
    if (!confirm(confirmMessage)) return

    try {
      setIsLoading(true)
      const result = await bulkDeleteTransactionsAction(selectedIds)
      if (!result.success) {
        throw new Error(result.error)
      }
      onActionComplete?.()
    } catch (error) {
      console.error("Failed to delete transactions:", error)
      alert(`Failed to delete transactions: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async () => {
    if (!selectedIds || selectedIds.length === 0) return
    const first = selectedIds[0]
    try {
      const res = await fetch(`/api/transactions/${first}`)
      if (!res.ok) throw new Error("Failed to fetch transaction")
      const tx = await res.json()
      setInitialValues(tx)
    } catch (err) {
      console.error("Failed to fetch transaction for duplicate:", err)
      alert("Failed to fetch transaction for duplicate")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      {/* Render client dialog without trigger - it will open when initialValues is set */}
      <ClientNewTransactionDialog
        categories={categories}
        currencies={currencies}
        projects={projects}
        settings={settings}
        initialValues={initialValues}
      />

      <Button className="min-w-48 gap-2" disabled={selectedIds.length === 0} onClick={handleDuplicate}>
        <Copy className="h-4 w-4" />
        Duplicate
      </Button>
      <Button variant="destructive" className="min-w-48 gap-2" disabled={isLoading} onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
        Delete {selectedIds.length} transactions
      </Button>
    </div>
  )
}
