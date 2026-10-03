import { MOCK_ACCOUNTS } from "@/data/accounts"
import { BankAccount } from "@/types/account"

let accountsStore: BankAccount[] = [...MOCK_ACCOUNTS]

export const AccountService = {
  async getAll(): Promise<BankAccount[]> {
    return [...accountsStore]
  },

  async getById(id: string): Promise<BankAccount | null> {
    const acc = accountsStore.find((a) => a.id === id)
    return acc || null
  },

  async getTotalBalances() {
    const totalAssets = accountsStore
      .filter((a) => a.balance > 0)
      .reduce((sum, a) => sum + a.balance, 0)

    const totalLiabilities = Math.abs(
      accountsStore
        .filter((a) => a.balance < 0)
        .reduce((sum, a) => sum + a.balance, 0)
    )

    const totalAvailable = accountsStore.reduce(
      (sum, a) => sum + Math.max(0, a.availableBalance),
      0
    )

    const netWorth = totalAssets - totalLiabilities

    return {
      netWorth,
      totalAssets,
      totalLiabilities,
      totalAvailable,
    }
  },

  async createAccount(
    data: Omit<BankAccount, "id" | "accountNumber"> & { initialDeposit: number }
  ): Promise<BankAccount> {
    const generatedNumber = `48${Math.floor(1000000000 + Math.random() * 9000000000)}`
    const newAcc: BankAccount = {
      id: `acc_${Date.now().toString(36)}`,
      name: data.name,
      accountType: data.accountType,
      accountNumber: generatedNumber,
      routingNumber: data.routingNumber || "121000358",
      balance: data.initialDeposit,
      availableBalance: data.initialDeposit,
      currency: "USD",
      status: "active",
      cardLast4: generatedNumber.slice(-4),
      institutionName: data.institutionName || "Aegis Reserve Bank",
      colorTheme: data.colorTheme || "slate",
    }

    accountsStore = [...accountsStore, newAcc]
    return newAcc
  },
}
