import { MOCK_TRANSACTIONS } from "@/data/transactions"
import {
  Transaction,
  TransactionFilters,
  TransactionPagination,
} from "@/types/transaction"

// Local in-memory state for the session
let transactionsStore: Transaction[] = [...MOCK_TRANSACTIONS]

export interface GetTransactionsResult {
  data: Transaction[]
  pagination: TransactionPagination
}

export const TransactionService = {
  async getAll(
    filters?: Partial<TransactionFilters>,
    page: number = 1,
    limit: number = 8
  ): Promise<GetTransactionsResult> {
    // Simulate slight asynchronous resolution typical of a repository or data loader
    await new Promise((resolve) => setTimeout(resolve, 50))

    let filtered = [...transactionsStore]

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim()
      filtered = filtered.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.referenceNumber.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    }

    if (filters?.category && filters.category !== "All Categories") {
      filtered = filtered.filter((t) => t.category === filters.category)
    }

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status)
    }

    if (filters?.type && filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters?.accountId && filters.accountId !== "all") {
      filtered = filtered.filter((t) => t.accountId === filters.accountId)
    }

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (safePage - 1) * limit
    const paginatedData = filtered.slice(startIndex, startIndex + limit)

    return {
      data: paginatedData,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
    }
  },

  async getRecent(count: number = 5): Promise<Transaction[]> {
    return transactionsStore.slice(0, count)
  },

  async getById(id: string): Promise<Transaction | null> {
    const found = transactionsStore.find((t) => t.id === id)
    return found || null
  },

  async add(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const newTx: Transaction = {
      ...transaction,
      id: `tx_${Date.now().toString(36).toUpperCase()}`,
    }
    transactionsStore = [newTx, ...transactionsStore]
    return newTx
  },

  async getSummaryStats() {
    const totalIncome = transactionsStore
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactionsStore
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)

    const pendingCount = transactionsStore.filter(
      (t) => t.status === "pending"
    ).length

    return {
      totalIncome,
      totalExpense,
      pendingCount,
      netCashflow: totalIncome - totalExpense,
    }
  },
}
