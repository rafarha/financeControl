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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

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
  console.log("bulk-actions: fetching transaction", first)
  const res = await fetch(`/api/transactions/${first}`, { credentials: "same-origin" })
  console.log("bulk-actions: fetch status", res.status)
  if (!res.ok) throw new Error(`Failed to fetch transaction: ${res.status}`)
  const tx = await res.json()
      console.log("bulk-actions: fetched transaction", tx)
      setInitialValues(tx)
      setDialogOpen(true)
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
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v)
          if (!v) setInitialValues(undefined)
        }}
      />

      {selectedIds.length === 1 && (
        <Button className="min-w-48 gap-2" onClick={handleDuplicate}>
          <Copy className="h-4 w-4" />
          Duplicate
        </Button>
      )}
      <Button variant="destructive" className="min-w-48 gap-2" disabled={isLoading} onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
        Delete {selectedIds.length} transactions
      </Button>
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-20 right-4 z-50 p-2 bg-white border rounded text-xs w-64 max-h-40 overflow-auto">
          <div className="font-semibold">Debug (dev):</div>
          <div>dialogOpen: {String(dialogOpen)}</div>
          <div>initialValues: {initialValues ? JSON.stringify(initialValues).slice(0, 200) : "(none)"}</div>
        </div>
      )}
    </div>
  )
}
