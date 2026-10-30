"use client"

import * as React from "react"
import { TransactionTable } from "./transaction-table"
import { TransactionCards } from "./transaction-cards"
import { TransactionFiltersBar } from "./transaction-filters"
import { TransactionDetailDialog } from "./transaction-detail-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Transaction, TransactionFilters, TransactionPagination } from "@/types/transaction"
import { TransactionService } from "../services/transaction.service"
import { ChevronLeft, ChevronRight, Inbox, RefreshCw } from "lucide-react"

interface TransactionManagementViewProps {
  initialData: Transaction[]
  initialPagination: TransactionPagination
}

export function TransactionManagementView({
  initialData,
  initialPagination,
}: TransactionManagementViewProps) {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialData)
  const [pagination, setPagination] = React.useState<TransactionPagination>(initialPagination)
  const [loading, setLoading] = React.useState(false)
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null)

  const [filters, setFilters] = React.useState<TransactionFilters>({
    search: "",
    category: "All Categories",
    status: "all",
    type: "all",
  })

  const fetchTransactions = React.useCallback(
    async (newFilters: TransactionFilters, page: number = 1) => {
      setLoading(true)
      try {
        const result = await TransactionService.getAll(newFilters, page, 8)
        setTransactions(result.data)
        setPagination(result.pagination)
      } catch (err) {
        console.error("Failed to load transactions", err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    fetchTransactions(updated, 1)
  }

  const handleResetFilters = () => {
    const defaultFilters: TransactionFilters = {
      search: "",
      category: "All Categories",
      status: "all",
      type: "all",
    }
    setFilters(defaultFilters)
    fetchTransactions(defaultFilters, 1)
  }

  const handlePageChange = (newPage: number) => {
    fetchTransactions(filters, newPage)
  }

  return (
    <div className="space-y-4">
      {/* Header with quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Transaction Ledger
          </h2>
          <p className="text-xs text-muted-foreground">
            Showing {pagination.total} audited institutional transactions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTransactions(filters, pagination.page)}
          disabled={loading}
          className="text-xs h-8 self-start sm:self-auto gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <TransactionFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Content Area: Table / Cards / Loading / Empty */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No transactions found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any records matching your filter parameters. Try adjusting or clearing your active filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-4 text-xs"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <TransactionTable
            transactions={transactions}
            onSelectTransaction={(tx) => setSelectedTx(tx)}
          />

          {/* Mobile Cards */}
          <TransactionCards
            transactions={transactions}
            onSelectTransaction={(tx) => setSelectedTx(tx)}
          />

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted-foreground">
            <span>
              Page <strong className="text-foreground">{pagination.page}</strong> of{" "}
              <strong className="text-foreground">{pagination.totalPages}</strong> (
              {pagination.total} records)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                disabled={pagination.page <= 1 || loading}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailDialog
        transaction={selectedTx}
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  )
}
