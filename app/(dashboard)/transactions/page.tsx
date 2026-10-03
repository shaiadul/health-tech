import { TransactionService } from "@/features/transactions/services/transaction.service"
import { TransactionManagementView } from "@/features/transactions/components/transaction-management-view"

export const metadata = {
  title: "Transactions | Aegis Financial",
  description: "Search, filter, inspect and download verified transaction receipts.",
}

export default async function TransactionsPage() {
  const initialResult = await TransactionService.getAll({}, 1, 8)

  return (
    <TransactionManagementView
      initialData={initialResult.data}
      initialPagination={initialResult.pagination}
    />
  )
}
