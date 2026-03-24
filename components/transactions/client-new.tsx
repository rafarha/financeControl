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
}: {
  children?: React.ReactNode
  categories: Category[]
  currencies: Currency[]
  projects: Project[]
  settings: Record<string, string>
  initialValues?: Partial<TransactionData>
  onClose?: () => void
}) {
  const [open, setOpen] = React.useState<boolean>(Boolean(initialValues))

  React.useEffect(() => {
    setOpen(Boolean(initialValues))
  }, [initialValues])

  React.useEffect(() => {
    if (!open && typeof onClose === "function") {
      onClose()
    }
  }, [open, onClose])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
