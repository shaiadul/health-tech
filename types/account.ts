export type AccountCategory = "checking" | "savings" | "credit" | "investment"
export type AccountStatus = "active" | "frozen" | "pending"

export interface BankAccount {
  id: string
  name: string
  accountType: AccountCategory
  accountNumber: string // raw string to be masked by maskAccountNumber()
  routingNumber: string
  balance: number // in minor units (cents)
  availableBalance: number // in minor units
  currency: string
  status: AccountStatus
  cardLast4?: string
  creditLimit?: number // in minor units
  interestRate?: number // e.g. 0.048 for 4.8% APY
  institutionName: string
  colorTheme?: "navy" | "emerald" | "slate" | "indigo"
}
