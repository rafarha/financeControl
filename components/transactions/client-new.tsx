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
}: {
  children: React.ReactNode
  categories: Category[]
  currencies: Currency[]
  projects: Project[]
  settings: Record<string, string>
  initialValues?: Partial<TransactionData>
}) {
  const [open, setOpen] = React.useState<boolean>(Boolean(initialValues))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
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
