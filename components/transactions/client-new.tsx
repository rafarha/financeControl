"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import TransactionCreateForm from "./create"
import { Category, Currency, Project, Transaction } from "@/prisma/client"
import { TransactionData } from "@/models/transactions"

export default function ClientNewTransactionDialog({
  children,
  categories,
  currencies,
  projects,
  settings,
  initialValues,
  onClose,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode
  categories: Category[]
  currencies: Currency[]
  projects: Project[]
  settings: Record<string, string>
  initialValues?: Partial<TransactionData>
  onClose?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(Boolean(initialValues))

  const isControlled = typeof open !== "undefined"
  const dialogOpen = isControlled ? (open as boolean) : internalOpen

  React.useEffect(() => {
    if (!isControlled) setInternalOpen(Boolean(initialValues))
  }, [initialValues, isControlled])

  React.useEffect(() => {
    console.log("client-new: initialValues changed", initialValues)
    console.log("client-new: open state", dialogOpen)
    // fallback: if initialValues exists but open is false, force open for uncontrolled
    if (initialValues && !dialogOpen && !isControlled) {
      setInternalOpen(true)
    }
  }, [initialValues, dialogOpen, isControlled])

  React.useEffect(() => {
    if (!dialogOpen && typeof onClose === "function") {
      onClose()
    }
  }, [dialogOpen, onClose])

  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setInternalOpen(v)
    if (onOpenChange) onOpenChange(v)
    if (!v && typeof onClose === "function") onClose()
  }

  return (
  <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children ? (
        <DialogTrigger asChild>
          <Button>{children}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Transaction</DialogTitle>
          <DialogDescription>Create a new transaction</DialogDescription>
        </DialogHeader>

        <TransactionCreateForm
          categories={categories}
          currencies={currencies}
          settings={settings}
          projects={projects}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  )
}
