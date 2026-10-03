"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TRANSACTION_CATEGORIES } from "@/lib/constants"
import { TransactionFilters } from "@/types/transaction"

interface TransactionFiltersBarProps {
  filters: TransactionFilters
  onFilterChange: (key: keyof TransactionFilters, value: string) => void
  onReset: () => void
}

export function TransactionFiltersBar({
  filters,
  onFilterChange,
  onReset,
}: TransactionFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by merchant, invoice, or note..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-8 h-9 text-xs bg-muted/30"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(val) => onFilterChange("category", val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type (Income / Expense) */}
        <Select
          value={filters.type}
          onValueChange={(val) => onFilterChange("type", val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Flows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flows</SelectItem>
            <SelectItem value="income">Inflow (Income)</SelectItem>
            <SelectItem value="expense">Outflow (Expense)</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(val) => onFilterChange("status", val)}
          >
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            title="Reset Filters"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
