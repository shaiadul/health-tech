export type TransactionType = "income" | "expense"
export type TransactionStatus = "completed" | "pending" | "failed"

export interface Transaction {
  id: string
  merchant: string
  merchantLogo?: string
  amount: number // in minor units (e.g. cents, 125000 = $1,250.00)
  type: TransactionType
  status: TransactionStatus
  category: string
  date: string // ISO string
  accountId: string
  accountName: string
  referenceNumber: string
  description?: string
  paymentMethod: "card" | "wire" | "ach" | "internal"
}

export interface TransactionFilters {
  search: string
  category: string
  status: string
  type: string
  dateRange?: string
  accountId?: string
}

export interface TransactionPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
