import { MOCK_ACCOUNTS } from "@/data/accounts"
import { BankAccount } from "@/types/account"
import { getAccountsAction, createAccountAction } from "@/lib/actions"

let accountsStore: BankAccount[] = [...MOCK_ACCOUNTS]

export const AccountService = {
  async getAll(): Promise<BankAccount[]> {
    try {
      const res = await getAccountsAction()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data as BankAccount[]
      }
    } catch {
      // Fallback
    }
    return [...accountsStore]
  },

  async getById(id: string): Promise<BankAccount | null> {
    try {
      const all = await AccountService.getAll()
      const found = all.find((a) => a.id === id)
      if (found) return found
    } catch {
      // Fallback
    }
    const acc = accountsStore.find((a) => a.id === id)
    return acc || null
  },

  async getTotalBalances() {
    const accounts = await AccountService.getAll()
    const totalAssets = accounts
      .filter((a) => a.balance > 0)
      .reduce((sum, a) => sum + a.balance, 0)

    const totalLiabilities = Math.abs(
      accounts
        .filter((a) => a.balance < 0)
        .reduce((sum, a) => sum + a.balance, 0)
    )

    const totalAvailable = accounts.reduce(
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
    try {
      const res = await createAccountAction({
        name: data.name,
        accountType: data.accountType,
        routingNumber: data.routingNumber,
        initialDeposit: data.initialDeposit,
        institutionName: data.institutionName,
        colorTheme: data.colorTheme,
      })
      if (res.success && res.data) {
        const created = res.data as BankAccount
        accountsStore = [...accountsStore, created]
        return created
      }
    } catch {
      // Fallback
    }

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
