import ClientNewTransactionDialog from "./client-new"
import { getCurrentUser } from "@/lib/auth"
import { getCategories } from "@/models/categories"
import { getCurrencies } from "@/models/currencies"
import { getProjects } from "@/models/projects"
import { getSettings } from "@/models/settings"
import { getTransactionById } from "@/models/transactions"

export async function NewTransactionDialog({ children, fromTransactionId }: { children: React.ReactNode; fromTransactionId?: string }) {
  const user = await getCurrentUser()
  const categories = await getCategories(user.id)
  const currencies = await getCurrencies(user.id)
  const settings = await getSettings(user.id)
  const projects = await getProjects(user.id)

  let initialValues = undefined
  if (fromTransactionId) {
    const tx = await getTransactionById(fromTransactionId, user.id)
    if (tx) {
      // map transaction to TransactionData shape (minimal)
      initialValues = {
        name: tx.name ?? undefined,
        merchant: tx.merchant ?? undefined,
        description: tx.description ?? undefined,
        total: tx.total ?? undefined,
        convertedTotal: tx.convertedTotal ?? undefined,
        currencyCode: tx.currencyCode ?? undefined,
        convertedCurrencyCode: tx.convertedCurrencyCode ?? undefined,
        type: tx.type ?? undefined,
        categoryCode: tx.categoryCode ?? undefined,
        projectCode: tx.projectCode ?? undefined,
        issuedAt: tx.issuedAt ?? undefined,
        note: tx.note ?? undefined,
      }
    }
  }

  return (
    // render a client dialog with the fetched props
    <ClientNewTransactionDialog
      categories={categories}
      currencies={currencies}
      settings={settings}
      projects={projects}
      initialValues={initialValues}
    >
      {children}
    </ClientNewTransactionDialog>
  )
}
