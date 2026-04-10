import { ExportTransactionsDialog } from "@/components/export/transactions"
import { UploadButton } from "@/components/files/upload-button"
import { TransactionList } from "@/components/transactions/list"
import { NewTransactionDialog } from "@/components/transactions/new"
import { Pagination } from "@/components/transactions/pagination"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getCategories } from "@/models/categories"
import { getFields } from "@/models/fields"
import { getProjects } from "@/models/projects"
import { getCurrencies } from "@/models/currencies"
import { getSettings } from "@/models/settings"
import { getTransactions } from "@/models/transactions"
import { Download, Plus, Upload } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Transactions",
  description: "Manage your transactions",
}

const TRANSACTIONS_PER_PAGE = 500

export default async function TransactionsPage(props: { searchParams: Promise<{ page?: string; from?: string; categoryCode?: string; startDate?: string; endDate?: string }> }) {
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page as string) || 1
  const from = searchParams.from
  const categoryCode = searchParams.categoryCode
  const startDate = searchParams.startDate
  const endDate = searchParams.endDate

  const user = await getCurrentUser()
  const filters = {
    ...(categoryCode && { categoryCode }),
    ...(startDate && { dateFrom: startDate }),
    ...(endDate && { dateTo: endDate }),
  }

  const { transactions, total } = await getTransactions(user.id, filters, {
    limit: TRANSACTIONS_PER_PAGE,
    offset: (page - 1) * TRANSACTIONS_PER_PAGE,
  })

  const categories = await getCategories(user.id)
  const projects = await getProjects(user.id)
  const fields = await getFields(user.id)
  const currencies = await getCurrencies(user.id)
  const settings = await getSettings(user.id)

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-2 mb-8">
        <h2 className="flex flex-row gap-3 md:gap-5">
          <span className="text-3xl font-bold tracking-tight">Transactions</span>
          <span className="text-3xl tracking-tight opacity-20">{total}</span>
        </h2>
        <div className="flex gap-2">
          <ExportTransactionsDialog fields={fields} categories={categories} projects={projects} total={total}>
            <Download /> <span className="hidden md:block">Export</span>
          </ExportTransactionsDialog>
          <NewTransactionDialog fromTransactionId={from}>
            <Plus /> <span className="hidden md:block">Add Transaction</span>
          </NewTransactionDialog>
        </div>
      </header>

      <TransactionFilters categories={categories} />

      <main>
        <Suspense fallback={<div>Loading transactions...</div>}>
        <TransactionList 
          transactions={transactions} 
          fields={fields} 
          categories={categories} 
          projects={projects} 
          currencies={currencies} 
          settings={settings} 
        />
        </Suspense>

        {total > TRANSACTIONS_PER_PAGE && (
          <Pagination totalItems={total} itemsPerPage={TRANSACTIONS_PER_PAGE} />
        )}

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[400px]">
            <p className="text-muted-foreground">
              You don&apos;t seem to have any transactions yet. Let&apos;s start and create the first one!
            </p>
            <div className="flex flex-row gap-5 mt-8">
              <UploadButton>
                <Upload /> Analyze New Invoice
              </UploadButton>
              <NewTransactionDialog fromTransactionId={from}>
                <Button variant="outline">
                  <Plus />
                  Add Manually
                </Button>
              </NewTransactionDialog>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
